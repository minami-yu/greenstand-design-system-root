import path from 'node:path';

export const repoRoot = process.cwd();
export const manifestPath = path.join(repoRoot, 'style-dictionary.config.json');
export const webKebabTransformGroup = 'greenstand/web-kebab';

// Converts a kebab-case value into PascalCase for generated type names.
export function toPascalCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Converts a kebab-case value into camelCase for generated property names.
export function toCamelCase(value) {
  const pascalCase = toPascalCase(value);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

// Converts platform-specific paths to POSIX paths for Style Dictionary config values.
export function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

// Formats numbers for generated code while preserving integers when possible.
export function formatNumber(value) {
  return Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(3))}`;
}

// Converts a percentage string like 140% into a decimal multiplier.
export function parsePercent(value) {
  if (typeof value === 'string' && value.endsWith('%')) {
    return Number(value.slice(0, -1)) / 100;
  }

  return Number(value);
}

// Returns the raw token node at a given alias path.
export function getTokenNode(tokens, tokenPath) {
  return tokenPath.reduce((node, segment) => node?.[segment], tokens);
}

// Resolves DTCG alias strings against the current token dictionary.
export function resolveTokenValue(tokens, value) {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const tokenPath = value.slice(1, -1).split('.');
    const referencedToken = getTokenNode(tokens, tokenPath);

    return resolveTokenValue(tokens, referencedToken?.$value);
  }

  return value;
}

// Groups flattened text-style tokens by style name for custom typography outputs.
export function getTypographyStyleMap(dictionary) {
  return dictionary.allTokens
    .filter((token) => token.path[0] === 'text-style')
    .reduce((styles, token) => {
      const [, styleName, propertyName] = token.path;
      const style = styles.get(styleName) || {};

      style[propertyName] = token;
      styles.set(styleName, style);

      return styles;
    }, new Map());
}

// Generates a lookup of transformed token names by token path.
export function getTokenNameMap(dictionary) {
  return dictionary.allTokens.reduce((tokenNames, token) => {
    tokenNames.set(token.path.join('.'), token.name);
    return tokenNames;
  }, new Map());
}
