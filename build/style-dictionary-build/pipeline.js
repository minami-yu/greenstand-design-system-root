/**
 * Style Dictionary pipeline for Greenstand tokens.
 *
 * Flow:
 * 1. Load manifest → flatten `sources`; normalize each JSON (wrap `color` / `size` / `font`, prefix aliases).
 * 2. Write `style-dictionary/.generated-sources/*.json` (flattened typography + per-theme elevation).
 * 3. Build bundles (color-*, size, typography-*, elevation-*) with explicit source lists.
 *
 * Elevation styles alias variable tokens (`{color.shadow.*}`, `{size.depth.*}`, …); generated elevation JSON
 * injects theme `color.shadow` plus flattened layers; bundles include `colorBase` + `size`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';
import { repoRoot, TOKEN_GROUPS, toCamelCase, toPosixPath } from './shared.js';

const defaultPlatformBuildPaths = {
  web: 'web',
  reactNative: 'react-native'
};

const COLOR_SOURCE_NAMES = new Set(['colorBase', 'colorLight', 'colorDark']);

/** @param {Record<string, string>} platformBuildPaths */
function resolvePlatformPaths(platformBuildPaths) {
  return { ...defaultPlatformBuildPaths, ...platformBuildPaths };
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeGeneratedTokenFile(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(contents, null, 2)}\n`);
}

function isAliasString(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function prefixAlias(value, prefix) {
  if (!isAliasString(value)) {
    return value;
  }
  const aliasPath = value.slice(1, -1);
  return aliasPath.startsWith(`${prefix}.`) ? value : `{${prefix}.${aliasPath}}`;
}

function mapTokenValues(node, mapper) {
  if (Array.isArray(node)) {
    return node.map((item) => mapTokenValues(item, mapper));
  }
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => (
      key === '$value' ? [key, mapper(value)] : [key, mapTokenValues(value, mapper)]
    )));
  }
  return node;
}

function wrapUnderKey(rootKey, aliasPrefix, document) {
  return {
    [rootKey]: mapTokenValues(document, (value) => prefixAlias(value, aliasPrefix))
  };
}

function normalizeSourceDocument(sourceName, document) {
  if (COLOR_SOURCE_NAMES.has(sourceName) && document[TOKEN_GROUPS.color] === undefined) {
    return wrapUnderKey(TOKEN_GROUPS.color, TOKEN_GROUPS.color, document);
  }
  if (sourceName === 'size' && document[TOKEN_GROUPS.size] === undefined) {
    return wrapUnderKey(TOKEN_GROUPS.size, TOKEN_GROUPS.size, document);
  }
  if ((sourceName === 'typographyMobile' || sourceName === 'typographyDesktop') && document.font === undefined) {
    return wrapUnderKey('font', 'font', document);
  }
  return document;
}

/** Load and normalize every file in `sourceConfig` (flat name → relative path). */
async function loadNormalizedSources(sourceConfig) {
  return Object.fromEntries(await Promise.all(
    Object.entries(sourceConfig).map(async ([sourceName, relativePath]) => [
      sourceName,
      normalizeSourceDocument(
        sourceName,
        await readJsonFile(path.join(repoRoot, relativePath))
      )
    ])
  ));
}

export async function prepareBuildDirectory(buildPath, platformBuildPaths = {}) {
  await fs.rm(buildPath, { recursive: true, force: true });
  await fs.mkdir(buildPath, { recursive: true });
  await Promise.all(
    Object.values(resolvePlatformPaths(platformBuildPaths)).map((p) => fs.mkdir(path.join(buildPath, p), { recursive: true }))
  );
}

export async function mergeWebCssFile(buildPath, platformBuildPaths, primaryFileName, helperFileName) {
  const webDir = path.join(buildPath, resolvePlatformPaths(platformBuildPaths).web);
  const primaryPath = path.join(webDir, primaryFileName);
  const helperPath = path.join(webDir, helperFileName);
  const [primaryCss, helperCss] = await Promise.all([
    fs.readFile(primaryPath, 'utf8'),
    fs.readFile(helperPath, 'utf8')
  ]);
  const cleanedHelper = helperCss.replace(/^\/\*\*[\s\S]*?\*\/\s*/u, '').trim();
  await fs.writeFile(primaryPath, `${primaryCss.trimEnd()}\n\n${cleanedHelper}\n`);
  await fs.rm(helperPath, { force: true });
}

export async function writeReactNativeIndex(buildPath, platformBuildPaths, bundleNames) {
  const rnDir = path.join(buildPath, resolvePlatformPaths(platformBuildPaths).reactNative);
  const lines = bundleNames.flatMap((bundleName) => {
    const m = toCamelCase(bundleName);
    return [
      `export { ${m} } from './${bundleName}';`,
      `export { default as ${m}Default } from './${bundleName}';`
    ];
  });
  await fs.writeFile(path.join(rnDir, 'index.ts'), `${lines.join('\n')}\n`);
}

function flattenTypographyStyles(textStyles) {
  return Object.fromEntries(Object.entries(textStyles).map(([styleName, styleToken]) => [
    styleName,
    {
      'font-family': {
        '$type': 'string',
        '$value': styleToken.$value.fontFamily,
        '$description': styleToken.$description
      },
      'font-size': { '$type': 'number', '$value': styleToken.$value.fontSize },
      'font-weight': { '$type': 'number', '$value': styleToken.$value.fontWeight },
      'line-height': { '$type': 'string', '$value': styleToken.$value.lineHeight },
      'letter-spacing': { '$type': 'string', '$value': styleToken.$value.letterSpacing }
    }
  ]));
}

function normalizeShadowDimension(value) {
  if (typeof value === 'string' && value.endsWith('px')) {
    return Number(value.slice(0, -2));
  }
  return value;
}

function elevationLayerToTokens(layer) {
  return {
    color: { '$type': 'color', '$value': layer.color },
    'offset-x': { '$type': 'number', '$value': normalizeShadowDimension(layer.offsetX) },
    'offset-y': { '$type': 'number', '$value': normalizeShadowDimension(layer.offsetY) },
    blur: { '$type': 'number', '$value': normalizeShadowDimension(layer.blur) },
    spread: { '$type': 'number', '$value': normalizeShadowDimension(layer.spread) }
  };
}

function flattenElevationStyles(elevationTokens) {
  return Object.fromEntries(Object.entries(elevationTokens).map(([name, token]) => [
    name,
    Object.fromEntries(token.$value.map((layer, i) => [`layer-${i + 1}`, elevationLayerToTokens(layer)]))
  ]));
}

const PASSTHROUGH_GENERATED = [
  'colorBase',
  'colorLight',
  'colorDark',
  'size',
  'typographyMobile',
  'typographyDesktop'
];

export async function prepareGeneratedSources(buildPath, sourceConfig) {
  const generatedDir = path.join(buildPath, '.generated-sources');
  const loaded = await loadNormalizedSources(sourceConfig);

  const fileForKey = {
    colorBase: 'color-base.json',
    colorLight: 'color-light.json',
    colorDark: 'color-dark.json',
    size: 'size.json',
    typographyMobile: 'typography-mobile.json',
    typographyDesktop: 'typography-desktop.json',
    typography: 'typography.json',
    elevationLight: 'elevation-light.json',
    elevationDark: 'elevation-dark.json'
  };
  const generatedSources = Object.fromEntries(
    Object.keys(fileForKey).map((k) => [k, path.join(generatedDir, fileForKey[k])])
  );

  await Promise.all(PASSTHROUGH_GENERATED.map((key) => writeGeneratedTokenFile(generatedSources[key], loaded[key])));

  await writeGeneratedTokenFile(generatedSources.typography, {
    [TOKEN_GROUPS.typography]: flattenTypographyStyles(loaded.typographyStyle[TOKEN_GROUPS.typography])
  });

  const flatElevation = flattenElevationStyles(loaded.elevationStyle.elevation);
  await writeGeneratedTokenFile(generatedSources.elevationLight, {
    color: { shadow: loaded.colorLight.color.shadow },
    elevation: flatElevation
  });
  await writeGeneratedTokenFile(generatedSources.elevationDark, {
    color: { shadow: loaded.colorDark.color.shadow },
    elevation: flatElevation
  });

  return generatedSources;
}

function ensureObjectPath(document, objectPath, fileLabel) {
  const result = objectPath.reduce((node, segment) => node?.[segment], document);
  if (result === undefined) {
    throw new Error(`Expected "${objectPath.join('.')}" in ${fileLabel}`);
  }
}

function assertNoCaseInsensitiveDuplicateSiblingKeys(node, fileLabel, pathLabel) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return;
  }
  const lowerToKey = new Map();
  for (const key of Object.keys(node).filter((k) => !k.startsWith('$'))) {
    const folded = key.toLowerCase();
    if (lowerToKey.has(folded)) {
      throw new Error(
        `Case-insensitive duplicate keys "${lowerToKey.get(folded)}" and "${key}" under ${pathLabel} in ${fileLabel}. `
        + 'They produce the same platform token name in generated outputs. Keep one spelling (e.g. only "white").'
      );
    }
    lowerToKey.set(folded, key);
  }
}

function validateTypographyStyleShape(document, fileLabel) {
  const textStyles = document[TOKEN_GROUPS.typography];
  for (const [styleName, styleToken] of Object.entries(textStyles)) {
    if (styleToken?.$type !== 'typography') {
      throw new Error(`Expected ${TOKEN_GROUPS.typography}.${styleName} in ${fileLabel} to use "$type": "typography"`);
    }
    for (const field of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']) {
      if (styleToken?.$value?.[field] === undefined) {
        throw new Error(`Expected ${TOKEN_GROUPS.typography}.${styleName}.$value.${field} in ${fileLabel}`);
      }
    }
  }
}

function validateElevationShape(document, fileLabel) {
  for (const [elevationName, elevationToken] of Object.entries(document.elevation)) {
    if (elevationToken?.$type !== 'shadow' || !Array.isArray(elevationToken.$value)) {
      throw new Error(`Expected elevation.${elevationName} in ${fileLabel} to use "$type": "shadow" with an array "$value"`);
    }
    for (const field of ['color', 'offsetX', 'offsetY', 'blur', 'spread']) {
      if (elevationToken.$value.some((layer) => layer?.[field] === undefined)) {
        throw new Error(`Expected every elevation.${elevationName} layer in ${fileLabel} to define "${field}"`);
      }
    }
  }
}

function validateSourceDocument(sourceName, document, relativePath) {
  if (COLOR_SOURCE_NAMES.has(sourceName)) {
    ensureObjectPath(document, ['color'], relativePath);
  }
  if (sourceName === 'colorBase') {
    assertNoCaseInsensitiveDuplicateSiblingKeys(document.color, relativePath, 'color');
  }
  if (sourceName === 'size') {
    ensureObjectPath(document, ['size'], relativePath);
  }
  if (sourceName === 'typographyMobile' || sourceName === 'typographyDesktop') {
    ensureObjectPath(document, ['font', 'family'], relativePath);
    ensureObjectPath(document, ['font', 'size'], relativePath);
    ensureObjectPath(document, ['font', 'weight'], relativePath);
  }
  if (sourceName === 'typographyStyle') {
    ensureObjectPath(document, [TOKEN_GROUPS.typography], relativePath);
    validateTypographyStyleShape(document, relativePath);
  }
  if (sourceName === 'elevationStyle') {
    ensureObjectPath(document, ['elevation'], relativePath);
    validateElevationShape(document, relativePath);
  }
}

export async function validateConfiguredSources(sourceConfig) {
  const entries = Object.entries(sourceConfig);
  await Promise.all(entries.map(async ([sourceName, relativePath]) => {
    try {
      await fs.access(path.join(repoRoot, relativePath));
    } catch {
      throw new Error(`Configured source "${sourceName}" was not found: ${relativePath}`);
    }
  }));

  const loaded = await loadNormalizedSources(sourceConfig);
  for (const [sourceName, relativePath] of entries) {
    validateSourceDocument(sourceName, loaded[sourceName], relativePath);
  }
}

const BUNDLE_DEFINITIONS = [
  { name: 'color-light', sourceKeys: ['colorBase', 'colorLight'] },
  { name: 'color-dark', sourceKeys: ['colorBase', 'colorDark'] },
  { name: 'size', sourceKeys: ['size'] },
  { name: 'typography-mobile', sourceKeys: ['typographyMobile', 'typography'] },
  { name: 'typography-desktop', sourceKeys: ['typographyDesktop', 'typography'] },
  { name: 'elevation-light', sourceKeys: ['colorBase', 'size', 'elevationLight'] },
  { name: 'elevation-dark', sourceKeys: ['colorBase', 'size', 'elevationDark'] }
];

export function createBundleDefinitions(generatedSources) {
  return BUNDLE_DEFINITIONS.map(({ name, sourceKeys }) => ({
    name,
    source: sourceKeys.map((key) => generatedSources[key])
  }));
}

function webVariableCss(bundleName) {
  return {
    destination: `${bundleName}.css`,
    format: 'css/variables',
    options: { outputReferences: true }
  };
}

function webFiles(bundleName, { typo, elevation }) {
  const base = webVariableCss(bundleName);
  const helperFormat = typo ? 'greenstand/css-typography-classes'
    : elevation ? 'greenstand/css-elevation-classes'
      : null;
  return helperFormat
    ? [base, { destination: `${bundleName}-classes.css`, format: helperFormat }]
    : [base];
}

function reactNativeFormat(bundleName) {
  if (bundleName.startsWith('typography-')) {
    return 'greenstand/react-native-typography';
  }
  if (bundleName.startsWith('elevation-')) {
    return 'greenstand/react-native-elevation';
  }
  return 'greenstand/react-native-module';
}

export function createPlatformConfig({
  buildPath,
  platformBuildPaths = {},
  prefix,
  bundleName,
  webTransformGroup
}) {
  const baseDir = toPosixPath(buildPath);
  const paths = resolvePlatformPaths(platformBuildPaths);
  const typo = bundleName.startsWith('typography-');
  const elevation = bundleName.startsWith('elevation-');

  return {
    platforms: {
      web: {
        transformGroup: webTransformGroup,
        buildPath: `${baseDir}/${toPosixPath(paths.web)}/`,
        files: webFiles(bundleName, { typo, elevation }),
        prefix
      },
      reactNative: {
        prefix,
        transformGroup: 'react-native',
        buildPath: `${baseDir}/${toPosixPath(paths.reactNative)}/`,
        files: [{
          destination: `${bundleName}.ts`,
          format: reactNativeFormat(bundleName),
          options: { moduleName: toCamelCase(bundleName) }
        }]
      }
    }
  };
}

export async function buildBundle({
  buildPath,
  platformBuildPaths,
  prefix,
  source,
  bundleName,
  webTransformGroup
}) {
  const dictionary = new StyleDictionary({
    source,
    ...createPlatformConfig({
      buildPath,
      platformBuildPaths,
      prefix,
      bundleName,
      webTransformGroup
    })
  });
  await dictionary.buildAllPlatforms();
}
