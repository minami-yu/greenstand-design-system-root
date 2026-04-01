# Agent guide — Greenstand design system

Design tokens are built with **Style Dictionary**; a small **Expo / React Native** app in `react-native-app/` consumes them. Use this file for orientation. Token formats, Figma export steps, and Style Dictionary details are in [README.md](README.md).

## Layout

| Path | Purpose |
|------|---------|
| `design-tokens/variables/` | Variable token JSON |
| `design-tokens/styles/` | Style token JSON |
| `build/style-dictionary-build-tokens.js` | Token build entrypoint |
| `build/style-dictionary-build/` | Build helpers and pipeline |
| `build/style-dictionary.config.json` | `sources`, outputs, platform paths |
| `style-dictionary/` | **Generated** outputs (`web`, `android`, `ios`, `react-native`); not the edit surface for token values |
| `react-native-app/` | Expo workspace; app theme in `src/theme/`, UI in `src/components/` and `src/screens/` |
| `prompts/fetch-figma-design.md` | Optional Figma MCP workflow (see README) |
| `.cursor/rules/*.mdc` | Cursor project rules |

## Commands (repository root)

| Command | Use |
|---------|-----|
| `npm install` | Install root and workspace dependencies |
| `npm run build:tokens` | Regenerate `style-dictionary/` from sources |
| `npm run mobile` | Expo dev server (`react-native-app`) |
| `npm run mobile:android` | Android |
| `npm run mobile:ios` | iOS |
| `npm run mobile:web` | Web |
| `npm run sync-skills` | Sync agent skills (see README) |

After changing `design-tokens/` or the Style Dictionary build, run `npm run build:tokens` before relying on generated files.

## Workflow reminders

1. **Figma / token updates:** Place updated JSON under `design-tokens/` (README: Zeroheight export is preferred over raw Figma MCP for accuracy).
2. **Build:** `npm install` if needed, then `npm run build:tokens`.
3. **Config changes:** If you rename sources or change JSON shape, update `build/style-dictionary.config.json` and, when required, validators / `build/style-dictionary-build/pipeline.js` (README lists required `sources` keys and structures).

## Conventions for code changes

- Edit **token sources** and rebuild; avoid hand-editing generated files under `style-dictionary/` unless the task is explicitly about output formats or the generator.
- In the RN app, follow existing patterns in `react-native-app/src/theme/` and reuse theme hooks (`useTheme`) and token-backed colors.
- Keep pull requests focused: avoid unrelated cross-workspace refactors in the same change.

## Cursor

- **AGENTS.md** (this file): repo map, commands, workflows.
- **`.cursor/rules/*.mdc`**: short, enforceable rules (`alwaysApply` or `globs`).
