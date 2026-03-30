import StyleDictionary from 'style-dictionary';
import { transforms } from 'style-dictionary/enums';
import { registerCustomFormats } from './style-dictionary-build/custom-formats.js';
import { repoRoot, manifestPath, webKebabTransformGroup } from './style-dictionary-build/shared.js';
import {
  buildBundle,
  createBundleDefinitions,
  mergeWebCssFile,
  prepareBuildDirectory,
  prepareGeneratedSources,
  validateConfiguredSources
} from './style-dictionary-build/pipeline.js';
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

// Validates that the manifest contains the source mapping required by the build pipeline.
function validateManifest(manifest) {
  const requiredSourceKeys = [
    'colorBase',
    'colorLight',
    'colorDark',
    'size',
    'typographyMobile',
    'typographyDesktop',
    'typographyStyle',
    'elevationStyle'
  ];

  if (!manifest.sources) {
    throw new Error('style-dictionary.config.json must define a top-level "sources" object for the token build.');
  }

  for (const sourceKey of requiredSourceKeys) {
    if (!manifest.sources[sourceKey]) {
      throw new Error(`style-dictionary.config.json is missing sources.${sourceKey}`);
    }
  }
}

// Coordinates source validation, generated source preparation, and bundle builds.
async function main() {
  const manifest = await loadManifest();
  const buildPath = path.join(repoRoot, manifest.buildPath);
  const prefix = manifest.prefix || 'token';

  validateManifest(manifest);
  await validateConfiguredSources(manifest.sources);
  await prepareBuildDirectory(buildPath);

  const generatedSources = await prepareGeneratedSources(buildPath, manifest.sources);
  const bundles = createBundleDefinitions(manifest.sources, generatedSources);

  for (const bundle of bundles) {
    await buildBundle({
      buildPath,
      prefix,
      source: bundle.source,
      bundleName: bundle.name,
      webTransformGroup: webKebabTransformGroup
    });

    if (bundle.name.startsWith('typography-') || bundle.name.startsWith('elevation-')) {
      await mergeWebCssFile(buildPath, `${bundle.name}.css`, `${bundle.name}-classes.css`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
