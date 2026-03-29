import fs from 'node:fs/promises';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';
import { transforms } from 'style-dictionary/enums';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'style-dictionary.config.json');
const webKebabTransformGroup = 'greenstand/web-kebab';

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

function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function createPlatformConfig({ buildPath, prefix, androidCompose }) {
  const baseDir = toPosixPath(buildPath);

  return {
    platforms: {
      web: {
        transformGroup: webKebabTransformGroup,
        buildPath: `${baseDir}/web/`,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/nested'
          },
          {
            destination: 'variables.css',
            format: 'css/variables',
            options: {
              outputReferences: true
            }
          },
          {
            destination: '_variables.scss',
            format: 'scss/variables',
            options: {
              outputReferences: true
            }
          },
          {
            destination: 'tokens.js',
            format: 'javascript/esm'
          }
        ],
        prefix
      },
      android: {
        prefix,
        transformGroup: 'android',
        buildPath: `${baseDir}/android/resources/`,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/nested'
          },
          {
            destination: 'resources.xml',
            format: 'android/resources'
          }
        ]
      },
      androidCompose: {
        transformGroup: 'compose',
        buildPath: `${baseDir}/android/compose/`,
        files: [
          {
            destination: 'Tokens.kt',
            format: 'compose/object',
            options: {
              packageName: androidCompose.packageName,
              className: androidCompose.className,
              outputReferences: true
            }
          },
          {
            destination: 'tokens.json',
            format: 'json/nested'
          }
        ]
      },
      ios: {
        prefix,
        transformGroup: 'ios-swift',
        buildPath: `${baseDir}/ios/`,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/nested'
          },
          {
            destination: 'StyleDictionary.swift',
            format: 'ios-swift/class.swift'
          }
        ]
      }
    }
  };
}

async function loadManifest() {
  const raw = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(raw);
}

async function buildTokens({ buildPath, prefix, source, androidCompose }) {
  const dictionary = new StyleDictionary({
    source,
    ...createPlatformConfig({
      buildPath,
      androidCompose,
      prefix
    })
  });

  await dictionary.buildAllPlatforms();
}

async function main() {
  const manifest = await loadManifest();
  const buildPath = path.join(repoRoot, manifest.buildPath);
  const prefix = manifest.prefix || 'token';
  const source = manifest.source || [];
  const androidCompose = {
    packageName: manifest.androidCompose?.packageName || 'org.greenstand.tokens',
    className: manifest.androidCompose?.className || 'Tokens'
  };

  if (source.length === 0) {
    throw new Error('No Style Dictionary source globs were defined in style-dictionary.config.json');
  }

  await buildTokens({ buildPath, prefix, source, androidCompose });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
