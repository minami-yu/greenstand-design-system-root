## Using AI Agent for coding
- Run `npm run sync-skills` to sync the agent skills

## How to use FigmaMCP
- 


## What to do when Figma variables or styles are updated
Overall thre are 2 steps
1. Locate new token JSON files into design-tokens folders
2. Run style dictionary

### Step 1
For the step 1 there are 2 ways to do
#### Option1: use FigmaMCP (not recommended)
- run the prompt in "prompts/fetch-figma-design.md'
- make sure to check the JSON file to see it actually reflect the change as is.

#### Option2: manual upload (recommended)
- export variables files via Zeroheight and locate under design-tokens/styles folder
-- run Zeroheight plugin in Figma
-- sync variables
-- go to Zeroheight from the link icon
-- export JSON files
- manually edit styles, which are located under the variables folder.


### Step 2
- Install dependencies with `npm install`
- Build tokens with `npm run build:tokens`




## Style Dictionary
### About style dictionary
- Build entrypoint lives at `build/style-dictionary-build/style-dictionary-build-tokens.js`
- Build helpers, manifest, and entry script live under `build/style-dictionary-build/`
- Build manifest lives at `build/style-dictionary-build/style-dictionary.config.json`
- Outputs are written under `style-dictionary/` using `build/style-dictionary-build/style-dictionary.config.json > platformBuildPaths`
- Default generated outputs go to `style-dictionary/web` and `style-dictionary/react-native`
- Source mapping lives in `build/style-dictionary-build/style-dictionary.config.json` under `sources.variables` and `sources.styles` (merged at build time)
- Source globs in that manifest are informational for repo layout; the build uses the explicit paths under `sources`

### Build requirements
- Variable token files must live under `design-tokens/variables`
- Style token files must live under `design-tokens/styles`
- The files referenced under `sources.variables` and `sources.styles` in the build manifest must exist
- Each configured source file must be valid JSON

Required `sources.variables` keys in `build/style-dictionary-build/style-dictionary.config.json`:
- `colorBase`, `colorLight`, `colorDark`, `size`, `typographyMobile`, `typographyDesktop`

Required `sources.styles` keys:
- `typographyStyle`, `elevationStyle`

Required JSON structure by source type (after build-time normalization where noted):
- `colorBase`, `colorLight`, `colorDark`: may omit a `color` root; the build wraps the file under `color` and prefixes color aliases
- `size`: may omit a `size` root; the build wraps the file under `size` and prefixes size aliases
- `typographyMobile`, `typographyDesktop`: may omit a `font` root; the build wraps under `font` and prefixes font aliases
- `typographyStyle`: must expose `typography`, and each typography style must be a DTCG `typography` token with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing`
- `elevationStyle`: must expose `elevation` with `$type: "shadow"` and a layer array (`color`, `offsetX`, `offsetY`, `blur`, `spread`). Layers should alias **variable** tokens, e.g. `{color.shadow.sm}` and `{size.depth.025}` / `{size.blur.800}` (see `design-tokens/styles/elevation.json`)

Alias expectations:
- `colorLight` and `colorDark` can alias tokens from `colorBase`
- Typography style tokens are expected to alias typography variable tokens
- Elevation layers are expected to alias `color.shadow.*` from the light/dark variable files and `size.*` from `token_size_value.json`; the pipeline injects `color.shadow` into generated elevation sources per theme

Generated outputs:
- `color-light` and `color-dark` are generated separately per platform
- `size` is generated separately per platform
- `typography-mobile` and `typography-desktop` are generated separately per platform
- `elevation-light` and `elevation-dark` are generated separately per platform
- Web typography and elevation outputs merge variables and helper classes into a single CSS file
- React Native outputs are generated as `.ts` modules plus `style-dictionary/react-native/index.ts`

Notes:
- If a source file is renamed, update the path under `sources.variables` or `sources.styles` in `build/style-dictionary-build/style-dictionary.config.json`
- If a source file’s structure changes, update the validator and the generated source preparation in `build/style-dictionary-build/pipeline.js`
