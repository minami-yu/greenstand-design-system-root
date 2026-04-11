import fs from 'node:fs/promises';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';
import { repoRoot, TOKEN_GROUPS, toCamelCase, toPascalCase, toPosixPath } from './shared.js';

const defaultPlatformBuildPaths = {
  web: 'web',
  android: 'android',
  ios: 'ios',
  reactNative: 'react-native'
};

// Reads a JSON token file from disk.
async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

// Writes a generated JSON token file used as an intermediate build source.
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
    return Object.fromEntries(Object.entries(node).map(([key, value]) => {
      if (key === '$value') {
        return [key, mapper(value)];
      }

      return [key, mapTokenValues(value, mapper)];
    }));
  }

  return node;
}

function normalizeSourceDocument(sourceName, document) {
  if ((sourceName === 'colorBase' || sourceName === 'colorLight' || sourceName === 'colorDark')
    && document[TOKEN_GROUPS.color] === undefined) {
    return {
      [TOKEN_GROUPS.color]: mapTokenValues(document, (value) => prefixAlias(value, TOKEN_GROUPS.color))
    };
  }

  if (sourceName === 'size' && document[TOKEN_GROUPS.size] === undefined) {
    return {
      [TOKEN_GROUPS.size]: mapTokenValues(document, (value) => prefixAlias(value, TOKEN_GROUPS.size))
    };
  }

  if ((sourceName === 'typographyMobile' || sourceName === 'typographyDesktop') && document.font === undefined) {
    return {
      font: mapTokenValues(document, (value) => prefixAlias(value, 'font'))
    };
  }

  return document;
}

// Removes previous generated artifacts so obsolete files do not survive build shape changes.
export async function prepareBuildDirectory(buildPath, platformBuildPaths = {}) {
  await fs.rm(buildPath, { recursive: true, force: true });
  await fs.mkdir(buildPath, { recursive: true });
  await Promise.all(Object.values({
    ...defaultPlatformBuildPaths,
    ...platformBuildPaths
  }).map((platformPath) => fs.mkdir(path.join(buildPath, platformPath), { recursive: true })));
}

// Merges a helper CSS file into the main bundle file so web outputs stay single-file.
export async function mergeWebCssFile(buildPath, platformBuildPaths, primaryFileName, helperFileName) {
  const webBuildPath = platformBuildPaths.web || defaultPlatformBuildPaths.web;
  const primaryPath = path.join(buildPath, webBuildPath, primaryFileName);
  const helperPath = path.join(buildPath, webBuildPath, helperFileName);
  const [primaryCss, helperCss] = await Promise.all([
    fs.readFile(primaryPath, 'utf8'),
    fs.readFile(helperPath, 'utf8')
  ]);
  const cleanedHelperCss = helperCss
    .replace(/^\/\*\*[\s\S]*?\*\/\s*/u, '')
    .trim();

  await fs.writeFile(primaryPath, `${primaryCss.trimEnd()}\n\n${cleanedHelperCss}\n`);
  await fs.rm(helperPath, { force: true });
}

// Builds an index module for React Native consumers.
export async function writeReactNativeIndex(buildPath, platformBuildPaths, bundleNames) {
  const reactNativeBuildPath = platformBuildPaths.reactNative || defaultPlatformBuildPaths.reactNative;
  const indexPath = path.join(buildPath, reactNativeBuildPath, 'index.ts');
  const lines = bundleNames.flatMap((bundleName) => {
    const moduleName = toCamelCase(bundleName);
    return [
      `export { ${moduleName} } from './${bundleName}';`,
      `export { default as ${moduleName}Default } from './${bundleName}';`
    ];
  });

  await fs.writeFile(indexPath, `${lines.join('\n')}\n`);
}

// Converts a typography composite token into primitive alias-backed token properties.
function flattenTypographyStyles(textStyles) {
  return Object.fromEntries(Object.entries(textStyles).map(([styleName, styleToken]) => ([
    styleName,
    {
      'font-family': {
        '$type': 'string',
        '$value': styleToken.$value.fontFamily,
        '$description': styleToken.$description
      },
      'font-size': {
        '$type': 'number',
        '$value': styleToken.$value.fontSize
      },
      'font-weight': {
        '$type': 'number',
        '$value': styleToken.$value.fontWeight
      },
      'line-height': {
        '$type': 'string',
        '$value': styleToken.$value.lineHeight
      },
      'letter-spacing': {
        '$type': 'string',
        '$value': styleToken.$value.letterSpacing
      }
    }
  ])));
}

// Converts px strings used in shadow layers into numbers that match the size variable tokens.
function normalizeShadowDimension(value) {
  if (typeof value === 'string' && value.endsWith('px')) {
    return Number(value.slice(0, -2));
  }

  return value;
}

// Converts shadow arrays into primitive per-layer tokens so platform outputs stay usable.
function flattenElevationStyles(elevationTokens) {
  return Object.fromEntries(Object.entries(elevationTokens).map(([elevationName, elevationToken]) => ([
    elevationName,
    Object.fromEntries(elevationToken.$value.map((layer, index) => {
      const layerName = `layer-${index + 1}`;

      return [
        layerName,
        {
          color: {
            '$type': 'color',
            '$value': layer.color
          },
          'offset-x': {
            '$type': 'number',
            '$value': normalizeShadowDimension(layer.offsetX)
          },
          'offset-y': {
            '$type': 'number',
            '$value': normalizeShadowDimension(layer.offsetY)
          },
          blur: {
            '$type': 'number',
            '$value': normalizeShadowDimension(layer.blur)
          },
          spread: {
            '$type': 'number',
            '$value': normalizeShadowDimension(layer.spread)
          }
        }
      ];
    }))
  ])));
}

// Creates build-time source files that flatten style definitions onto the variable tokens they depend on.
export async function prepareGeneratedSources(buildPath, sourceConfig) {
  const generatedDir = path.join(buildPath, '.generated-sources');
  const loadedSources = Object.fromEntries(await Promise.all(
    Object.entries(sourceConfig).map(async ([sourceName, relativePath]) => ([
      sourceName,
      normalizeSourceDocument(sourceName, await readJsonFile(path.join(repoRoot, relativePath)))
    ]))
  ));
  const typographyStyle = loadedSources.typographyStyle;
  const elevationStyle = loadedSources.elevationStyle;

  const generatedSources = {
    colorBase: path.join(generatedDir, 'color-base.json'),
    colorLight: path.join(generatedDir, 'color-light.json'),
    colorDark: path.join(generatedDir, 'color-dark.json'),
    size: path.join(generatedDir, 'size.json'),
    typographyMobile: path.join(generatedDir, 'typography-mobile.json'),
    typographyDesktop: path.join(generatedDir, 'typography-desktop.json'),
    typography: path.join(generatedDir, 'typography.json'),
    elevationLight: path.join(generatedDir, 'elevation-light.json'),
    elevationDark: path.join(generatedDir, 'elevation-dark.json')
  };

  await writeGeneratedTokenFile(generatedSources.colorBase, loadedSources.colorBase);
  await writeGeneratedTokenFile(generatedSources.colorLight, loadedSources.colorLight);
  await writeGeneratedTokenFile(generatedSources.colorDark, loadedSources.colorDark);
  await writeGeneratedTokenFile(generatedSources.size, loadedSources.size);
  await writeGeneratedTokenFile(generatedSources.typographyMobile, loadedSources.typographyMobile);
  await writeGeneratedTokenFile(generatedSources.typographyDesktop, loadedSources.typographyDesktop);

  await writeGeneratedTokenFile(generatedSources.typography, {
    [TOKEN_GROUPS.typography]: flattenTypographyStyles(typographyStyle[TOKEN_GROUPS.typography])
  });

  await writeGeneratedTokenFile(generatedSources.elevationLight, {
    color: elevationStyle.variables.color.light,
    elevation: flattenElevationStyles(elevationStyle.elevation)
  });

  await writeGeneratedTokenFile(generatedSources.elevationDark, {
    color: elevationStyle.variables.color.dark,
    elevation: flattenElevationStyles(elevationStyle.elevation)
  });

  return generatedSources;
}

// Validates that a nested object path exists in a JSON document.
function ensureObjectPath(document, objectPath, fileLabel) {
  const result = objectPath.reduce((node, segment) => node?.[segment], document);

  if (result === undefined) {
    throw new Error(`Expected "${objectPath.join('.')}" in ${fileLabel}`);
  }
}

// Validates that a typography style token contains the required composite fields.
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

// Validates that an elevation token contains shadow layers with the expected fields.
function validateElevationShape(document, fileLabel) {
  const elevationTokens = document.elevation;

  for (const [elevationName, elevationToken] of Object.entries(elevationTokens)) {
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

// Validates the configured source files and their required top-level structure.
export async function validateConfiguredSources(sourceConfig) {
  const sourceEntries = Object.entries(sourceConfig);

  await Promise.all(sourceEntries.map(async ([sourceName, relativePath]) => {
    const absolutePath = path.join(repoRoot, relativePath);

    try {
      await fs.access(absolutePath);
    } catch {
      throw new Error(`Configured source "${sourceName}" was not found: ${relativePath}`);
    }
  }));

  const loadedSources = await Promise.all(sourceEntries.map(async ([sourceName, relativePath]) => ([
    sourceName,
    normalizeSourceDocument(sourceName, await readJsonFile(path.join(repoRoot, relativePath))),
    relativePath
  ])));

  for (const [sourceName, document, relativePath] of loadedSources) {
    if (sourceName === 'colorBase' || sourceName === 'colorLight' || sourceName === 'colorDark') {
      ensureObjectPath(document, ['color'], relativePath);
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
      ensureObjectPath(document, ['variables', 'color', 'light'], relativePath);
      ensureObjectPath(document, ['variables', 'color', 'dark'], relativePath);
      ensureObjectPath(document, ['elevation'], relativePath);
      validateElevationShape(document, relativePath);
    }
  }
}

// Returns the explicit bundle-to-source mapping for the current token architecture.
export function createBundleDefinitions(sourceConfig, generatedSources) {
  return [
    {
      name: 'color-light',
      source: [
        generatedSources.colorBase,
        generatedSources.colorLight
      ]
    },
    {
      name: 'color-dark',
      source: [
        generatedSources.colorBase,
        generatedSources.colorDark
      ]
    },
    {
      name: 'size',
      source: [
        generatedSources.size
      ]
    },
    {
      name: 'typography-mobile',
      source: [
        generatedSources.typographyMobile,
        generatedSources.typography
      ]
    },
    {
      name: 'typography-desktop',
      source: [
        generatedSources.typographyDesktop,
        generatedSources.typography
      ]
    },
    {
      name: 'elevation-light',
      source: [
        generatedSources.size,
        generatedSources.elevationLight
      ]
    },
    {
      name: 'elevation-dark',
      source: [
        generatedSources.size,
        generatedSources.elevationDark
      ]
    }
  ];
}

// Builds the Style Dictionary config for one named bundle across web, iOS, and Android.
export function createPlatformConfig({
  buildPath,
  platformBuildPaths = {},
  prefix,
  bundleName,
  webTransformGroup
}) {
  const baseDir = toPosixPath(buildPath);
  const resolvedPlatformBuildPaths = {
    ...defaultPlatformBuildPaths,
    ...platformBuildPaths
  };
  const isTypographyBundle = bundleName.startsWith('typography-');
  const isElevationBundle = bundleName.startsWith('elevation-');

  return {
    platforms: {
      web: {
        transformGroup: webTransformGroup,
        buildPath: `${baseDir}/${toPosixPath(resolvedPlatformBuildPaths.web)}/`,
        files: isTypographyBundle
          ? [
              {
                destination: `${bundleName}.css`,
                format: 'css/variables',
                options: {
                  outputReferences: true
                }
              },
              {
                destination: `${bundleName}-classes.css`,
                format: 'greenstand/css-typography-classes'
              }
            ]
          : isElevationBundle
            ? [
                {
                  destination: `${bundleName}.css`,
                  format: 'css/variables',
                  options: {
                    outputReferences: true
                  }
                },
                {
                  destination: `${bundleName}-classes.css`,
                  format: 'greenstand/css-elevation-classes'
                }
              ]
            : [
                {
                  destination: `${bundleName}.css`,
                  format: 'css/variables',
                  options: {
                    outputReferences: true
                  }
                }
              ],
        prefix
      },
      android: {
        prefix,
        transformGroup: 'android',
        buildPath: `${baseDir}/${toPosixPath(resolvedPlatformBuildPaths.android)}/`,
        files: [
          {
            destination: `${bundleName}.xml`,
            format: isTypographyBundle ? 'greenstand/android-typography-xml' : 'android/resources'
          }
        ]
      },
      ios: {
        prefix,
        transformGroup: 'ios-swift',
        buildPath: `${baseDir}/${toPosixPath(resolvedPlatformBuildPaths.ios)}/`,
        files: [
          {
            destination: `${bundleName}.swift`,
            format: isTypographyBundle ? 'greenstand/ios-typography-swift' : 'ios-swift/class.swift',
            options: {
              className: toPascalCase(bundleName)
            }
          }
        ]
      },
      reactNative: {
        prefix,
        transformGroup: 'react-native',
        buildPath: `${baseDir}/${toPosixPath(resolvedPlatformBuildPaths.reactNative)}/`,
        files: [
          {
            destination: `${bundleName}.ts`,
            format: isTypographyBundle
              ? 'greenstand/react-native-typography'
              : isElevationBundle
                ? 'greenstand/react-native-elevation'
                : 'greenstand/react-native-module',
            options: {
              moduleName: toCamelCase(bundleName)
            }
          }
        ]
      }
    }
  };
}

// Builds one named bundle from an explicit source list.
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
