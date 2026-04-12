import StyleDictionary from 'style-dictionary';
import { transforms } from 'style-dictionary/enums';
import { registerCustomFormats } from './custom-formats.js';
import { repoRoot, manifestPath, manifestRelativePath, webKebabTransformGroup } from './shared.js';
import {
  assertManifestSourcesShape,
  flattenSourcesForPipeline
} from './source-manifest.js';
import {
  buildBundle,
  createBundleDefinitions,
  mergeWebCssFile,
  prepareBuildDirectory,
  prepareGeneratedSources,
  validateConfiguredSources,
  writeReactNativeIndex
} from './pipeline.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const {
  attributeCti,
  nameKebab,
  sizeRem,
  colorHex
} = transforms;

StyleDictionary.registerTransformGroup({
  name: webKebabTransformGroup,
  transforms: [attributeCti, nameKebab, sizeRem, colorHex]
});

registerCustomFormats();

// Reads the Style Dictionary manifest that defines platform settings and source mapping.
async function loadManifest() {
  const raw = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(raw);
}

// Validates manifest shape (paths, platform overrides).
function validateManifest(manifest) {
  assertManifestSourcesShape(manifest.sources);

  if (manifest.platformBuildPaths !== undefined) {
    if (typeof manifest.platformBuildPaths !== 'object' || Array.isArray(manifest.platformBuildPaths)) {
      throw new Error(`${manifestRelativePath} "platformBuildPaths" must be an object when provided.`);
    }

    for (const [platformName, platformPath] of Object.entries(manifest.platformBuildPaths)) {
      if (typeof platformPath !== 'string' || platformPath.trim() === '') {
        throw new Error(`${manifestRelativePath} platformBuildPaths.${platformName} must be a non-empty string.`);
      }
    }
  }
}

// Coordinates source validation, generated source preparation, and bundle builds.
async function main() {
  const manifest = await loadManifest();
  const buildPath = path.join(repoRoot, manifest.buildPath);
  const platformBuildPaths = manifest.platformBuildPaths || {};
  const prefix = typeof manifest.prefix === 'string' && manifest.prefix.trim() !== ''
    ? manifest.prefix
    : undefined;

  validateManifest(manifest);

  const sourceConfig = flattenSourcesForPipeline(manifest.sources);
  await validateConfiguredSources(sourceConfig);
  await prepareBuildDirectory(buildPath, platformBuildPaths);

  const generatedSources = await prepareGeneratedSources(buildPath, sourceConfig);
  const bundles = createBundleDefinitions(generatedSources);

  for (const bundle of bundles) {
    await buildBundle({
      buildPath,
      platformBuildPaths,
      prefix,
      source: bundle.source,
      bundleName: bundle.name,
      webTransformGroup: webKebabTransformGroup
    });

    if (bundle.name.startsWith('typography-') || bundle.name.startsWith('elevation-')) {
      await mergeWebCssFile(buildPath, platformBuildPaths, `${bundle.name}.css`, `${bundle.name}-classes.css`);
    }
  }

  await writeReactNativeIndex(buildPath, platformBuildPaths, bundles.map((bundle) => bundle.name));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
