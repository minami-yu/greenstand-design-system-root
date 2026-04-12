/**
 * Canonical shape of `sources` in `build/style-dictionary-build/style-dictionary.config.json`.
 * Variable files are merged/normalized first; style files reference them via DTCG aliases.
 */

import { manifestRelativePath } from './shared.js';

export const VARIABLE_SOURCE_KEYS = [
  'colorBase',
  'colorLight',
  'colorDark',
  'size',
  'typographyMobile',
  'typographyDesktop'
];

export const STYLE_SOURCE_KEYS = ['typographyStyle', 'elevationStyle'];

/**
 * @param {{ variables: Record<string, string>, styles: Record<string, string> }} sources
 * @returns {Record<string, string>} Flat map passed to validators and `prepareGeneratedSources`.
 */
export function flattenSourcesForPipeline(sources) {
  return {
    ...sources.variables,
    ...sources.styles
  };
}

/**
 * @param {unknown} sources
 */
export function assertManifestSourcesShape(sources) {
  if (!sources || typeof sources !== 'object' || Array.isArray(sources)) {
    throw new Error(
      `${manifestRelativePath} must define a top-level "sources" object with "variables" and "styles".`
    );
  }

  const { variables, styles } = sources;

  if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
    throw new Error(`${manifestRelativePath} "sources.variables" must be an object of path strings.`);
  }

  if (!styles || typeof styles !== 'object' || Array.isArray(styles)) {
    throw new Error(`${manifestRelativePath} "sources.styles" must be an object of path strings.`);
  }

  for (const key of VARIABLE_SOURCE_KEYS) {
    if (typeof variables[key] !== 'string' || variables[key].trim() === '') {
      throw new Error(`${manifestRelativePath} is missing or invalid sources.variables.${key}`);
    }
  }

  for (const key of STYLE_SOURCE_KEYS) {
    if (typeof styles[key] !== 'string' || styles[key].trim() === '') {
      throw new Error(`${manifestRelativePath} is missing or invalid sources.styles.${key}`);
    }
  }
}
