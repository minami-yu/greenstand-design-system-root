import fs from 'node:fs/promises';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';
import { transforms } from 'style-dictionary/enums';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'style-dictionary.config.json');
const webKebabTransformGroup = 'greenstand/web-kebab';
const supportedModes = ['light', 'dark'];

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

// Converts platform-specific paths to POSIX paths for Style Dictionary config values.
function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

// Reads the Style Dictionary manifest that defines source globs and platform settings.
async function loadManifest() {
  const raw = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(raw);
}

// Extracts the non-glob directory prefix so we can walk only the necessary paths.
function getGlobBaseDirectory(globPattern) {
  const normalizedPattern = toPosixPath(globPattern);
  const wildcardIndex = normalizedPattern.search(/[*[]/);
  const basePattern = wildcardIndex === -1
    ? normalizedPattern
    : normalizedPattern.slice(0, wildcardIndex);
  const trimmedBase = basePattern.replace(/\/$/, '');

  return trimmedBase || '.';
}

// Recursively collects files under a directory so source globs can be resolved without extra dependencies.
async function walkDirectory(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return walkDirectory(entryPath);
    }

    if (entry.isFile()) {
      return [entryPath];
    }

    return [];
  }));

  return files.flat();
}

// Resolves manifest source globs to the JSON token files that should participate in the build.
async function collectSourceFiles(sourceGlobs) {
  const baseDirectories = [...new Set(sourceGlobs.map(getGlobBaseDirectory))];
  const discoveredFiles = new Set();

  for (const baseDirectory of baseDirectories) {
    const absoluteBaseDirectory = path.resolve(repoRoot, baseDirectory);

    try {
      const files = await walkDirectory(absoluteBaseDirectory);

      for (const filePath of files) {
        discoveredFiles.add(path.resolve(filePath));
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return [...discoveredFiles]
    .filter((filePath) => path.extname(filePath).toLowerCase() === '.json')
    .sort();
}

// Classifies token files into global, light, and dark groups based on filename keywords.
function classifyTokenFiles(sourceFiles) {
  const groupedFiles = {
    global: [],
    light: [],
    dark: []
  };

  for (const sourceFile of sourceFiles) {
    const normalizedName = path.basename(sourceFile).toLowerCase();

    if (normalizedName.includes('light')) {
      groupedFiles.light.push(sourceFile);
      continue;
    }

    if (normalizedName.includes('dark')) {
      groupedFiles.dark.push(sourceFile);
      continue;
    }

    groupedFiles.global.push(sourceFile);
  }

  return groupedFiles;
}

// Removes previous generated artifacts so obsolete files do not survive mode build changes.
async function prepareBuildDirectory(buildPath) {
  await fs.rm(buildPath, { recursive: true, force: true });
  await fs.mkdir(buildPath, { recursive: true });
}

// Creates the Style Dictionary platform config for a specific color mode output.
function createPlatformConfig({ buildPath, prefix, androidCompose, mode }) {
  const baseDir = toPosixPath(buildPath);

  return {
    platforms: {
      web: {
        transformGroup: webKebabTransformGroup,
        buildPath: `${baseDir}/web/${mode}/`,
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
        buildPath: `${baseDir}/android/resources/${mode}/`,
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
        buildPath: `${baseDir}/android/compose/${mode}/`,
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
        buildPath: `${baseDir}/ios/${mode}/`,
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

// Builds one mode by combining shared global tokens with the selected mode token files.
async function buildModeTokens({ buildPath, prefix, source, androidCompose, mode }) {
  const dictionary = new StyleDictionary({
    source,
    ...createPlatformConfig({
      buildPath,
      androidCompose,
      prefix,
      mode
    })
  });

  await dictionary.buildAllPlatforms();
}

// Validates that both themed token groups exist before the build runs.
function validateModeSources({ global, light, dark }) {
  if (global.length === 0) {
    throw new Error('No global token files were found. Files without "light" or "dark" in the filename are treated as global.');
  }

  for (const mode of supportedModes) {
    if (mode === 'light' && light.length === 0) {
      throw new Error('No light mode token files were found. Files containing "Light" or "light" in the filename are treated as light mode.');
    }

    if (mode === 'dark' && dark.length === 0) {
      throw new Error('No dark mode token files were found. Files containing "Dark" or "dark" in the filename are treated as dark mode.');
    }
  }
}

// Coordinates source discovery, token classification, and per-mode builds.
async function main() {
  const manifest = await loadManifest();
  const buildPath = path.join(repoRoot, manifest.buildPath);
  const prefix = manifest.prefix || 'token';
  const sourceGlobs = manifest.source || [];
  const androidCompose = {
    packageName: manifest.androidCompose?.packageName || 'org.greenstand.tokens',
    className: manifest.androidCompose?.className || 'Tokens'
  };

  if (sourceGlobs.length === 0) {
    throw new Error('No Style Dictionary source globs were defined in style-dictionary.config.json');
  }

  const sourceFiles = await collectSourceFiles(sourceGlobs);
  const classifiedSourceFiles = classifyTokenFiles(sourceFiles);

  validateModeSources(classifiedSourceFiles);
  await prepareBuildDirectory(buildPath);

  await buildModeTokens({
    buildPath,
    prefix,
    source: [...classifiedSourceFiles.global, ...classifiedSourceFiles.light],
    androidCompose,
    mode: 'light'
  });

  await buildModeTokens({
    buildPath,
    prefix,
    source: [...classifiedSourceFiles.global, ...classifiedSourceFiles.dark],
    androidCompose,
    mode: 'dark'
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
