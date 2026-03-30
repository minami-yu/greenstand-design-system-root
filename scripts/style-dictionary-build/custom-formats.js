import StyleDictionary from 'style-dictionary';
import {
  formatNumber,
  getTokenNameMap,
  getTypographyStyleMap,
  parsePercent,
  resolveTokenValue,
  toCamelCase,
  toPascalCase
} from './shared.js';

// Builds CSS utility classes that bind typography styles to generated CSS variables.
function formatTypographyCssClasses({ dictionary, file }) {
  const styleMap = getTypographyStyleMap(dictionary);
  const classes = [...styleMap.entries()].map(([styleName, properties]) => {
    const lineHeight = resolveTokenValue(dictionary.tokens, properties['line-height'].original.$value);
    const letterSpacing = `${formatNumber(parsePercent(resolveTokenValue(dictionary.tokens, properties['letter-spacing'].original.$value)))}em`;

    return [
      `.gs-typography-${styleName} {`,
      `  font-family: var(--${properties['font-family'].name});`,
      `  font-size: calc(var(--${properties['font-size'].name}) * 1px);`,
      `  font-weight: var(--${properties['font-weight'].name});`,
      `  line-height: ${lineHeight};`,
      `  letter-spacing: ${letterSpacing};`,
      '}'
    ].join('\n');
  });

  return [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    `/* ${file.destination} */`,
    '',
    ...classes
  ].join('\n');
}

// Builds CSS utility classes that bind elevation styles to generated CSS variables.
function formatElevationCssClasses({ dictionary, file }) {
  const tokenNames = getTokenNameMap(dictionary);
  const elevationStyles = dictionary.tokens.elevation || {};
  const classes = Object.keys(elevationStyles).map((elevationName) => {
    const shadowLayers = [1, 2, 3].map((layerIndex) => {
      const layerPath = `elevation.${elevationName}.layer-${layerIndex}`;

      return [
        `calc(var(--${tokenNames.get(`${layerPath}.offset-x`)}) * 1px)`,
        `calc(var(--${tokenNames.get(`${layerPath}.offset-y`)}) * 1px)`,
        `calc(var(--${tokenNames.get(`${layerPath}.blur`)}) * 1px)`,
        `calc(var(--${tokenNames.get(`${layerPath}.spread`)}) * 1px)`,
        `var(--${tokenNames.get(`${layerPath}.color`)})`
      ].join(' ');
    });

    return [
      `.gs-elevation-${elevationName} {`,
      `  box-shadow: ${shadowLayers.join(', ')};`,
      '}'
    ].join('\n');
  });

  return [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    `/* ${file.destination} */`,
    '',
    ...classes
  ].join('\n');
}

// Builds a typed Swift typography API from flattened text-style tokens.
function formatTypographySwift({ dictionary, file, options }) {
  const className = options.className;
  const textStyles = dictionary.tokens['text-style'] || {};
  const styleLines = Object.entries(textStyles).map(([styleName, properties]) => {
    const fontFamily = resolveTokenValue(dictionary.tokens, properties['font-family'].$value);
    const fontSize = Number(resolveTokenValue(dictionary.tokens, properties['font-size'].$value));
    const fontWeight = Number(resolveTokenValue(dictionary.tokens, properties['font-weight'].$value));
    const lineHeight = fontSize * parsePercent(resolveTokenValue(dictionary.tokens, properties['line-height'].$value));
    const letterSpacing = fontSize * parsePercent(resolveTokenValue(dictionary.tokens, properties['letter-spacing'].$value));

    return [
      `    public static let ${toCamelCase(styleName)} = TypographyStyle(`,
      `        fontFamily: "${fontFamily}",`,
      `        fontSize: ${formatNumber(fontSize)},`,
      `        fontWeight: ${formatNumber(fontWeight)},`,
      `        lineHeight: ${formatNumber(lineHeight)},`,
      `        letterSpacing: ${formatNumber(letterSpacing)}`,
      '    )'
    ].join('\n');
  });

  return [
    '//',
    `// ${file.destination}`,
    '//',
    '',
    '// Do not edit directly, this file was auto-generated.',
    '',
    '',
    'import UIKit',
    '',
    'public struct TypographyStyle {',
    '    public let fontFamily: String',
    '    public let fontSize: CGFloat',
    '    public let fontWeight: CGFloat',
    '    public let lineHeight: CGFloat',
    '    public let letterSpacing: CGFloat',
    '}',
    '',
    `public enum ${className} {`,
    ...styleLines,
    '}',
    ''
  ].join('\n');
}

// Builds Android text appearance styles from flattened text-style tokens.
function formatTypographyAndroidXml({ dictionary }) {
  const textStyles = dictionary.tokens['text-style'] || {};
  const styleBlocks = Object.entries(textStyles).map(([styleName, properties]) => {
    const fontFamily = resolveTokenValue(dictionary.tokens, properties['font-family'].$value);
    const fontSize = Number(resolveTokenValue(dictionary.tokens, properties['font-size'].$value));
    const fontWeight = Number(resolveTokenValue(dictionary.tokens, properties['font-weight'].$value));
    const lineHeight = fontSize * parsePercent(resolveTokenValue(dictionary.tokens, properties['line-height'].$value));
    const letterSpacing = parsePercent(resolveTokenValue(dictionary.tokens, properties['letter-spacing'].$value));

    return [
      `  <style name="GsTypography${toPascalCase(styleName)}">`,
      `    <item name="android:fontFamily">${fontFamily}</item>`,
      `    <item name="android:textSize">${formatNumber(fontSize)}sp</item>`,
      `    <item name="android:textFontWeight">${formatNumber(fontWeight)}</item>`,
      `    <item name="android:lineHeight">${formatNumber(lineHeight)}sp</item>`,
      `    <item name="android:letterSpacing">${formatNumber(letterSpacing)}</item>`,
      '  </style>'
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '',
    '<!--',
    '  Do not edit directly, this file was auto-generated.',
    '-->',
    '<resources>',
    ...styleBlocks,
    '</resources>',
    ''
  ].join('\n');
}

// Registers the custom Style Dictionary formats used by this repo.
export function registerCustomFormats() {
  StyleDictionary.registerFormat({
    name: 'greenstand/css-typography-classes',
    format: formatTypographyCssClasses
  });

  StyleDictionary.registerFormat({
    name: 'greenstand/css-elevation-classes',
    format: formatElevationCssClasses
  });

  StyleDictionary.registerFormat({
    name: 'greenstand/ios-typography-swift',
    format: formatTypographySwift
  });

  StyleDictionary.registerFormat({
    name: 'greenstand/android-typography-xml',
    format: formatTypographyAndroidXml
  });
}
