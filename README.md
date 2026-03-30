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
#### Option1: use FigmaMCP
- run the prompt in "prompts/fetch-figma-design.md'
- make sure to check the JSON file to see it actually reflect the change as is.

#### Option2: manual upload
- export variables files via Zeroheight and locate under design-tokens/styles folder
- manually edit styles, which are located under the variables folder.


### Step 2
- Install dependencies with `npm install`
- Build tokens with `npm run build:tokens`




## Style Dictionary
### About style dictionary
- Build entrypoint lives at `scripts/style-dictionary-build-tokens.js`
- Build helpers live under `scripts/style-dictionary-build/`
- Outputs are written to `style-dictionary/web`, `style-dictionary/android`, and `style-dictionary/ios`
- Source mapping lives in `style-dictionary.config.json` under `sources`
- Source globs in `style-dictionary.config.json` are informational for repo layout, but the actual build uses `sources` for explicit file mapping

### Build requirements
- Variable token files must live under `design-tokens/variables`
- Style token files must live under `design-tokens/styles`
- The files referenced in `style-dictionary.config.json > sources` must exist
- Each configured source file must be valid JSON

Required `sources` keys in `style-dictionary.config.json`:
- `colorBase`
- `colorLight`
- `colorDark`
- `size`
- `typographyMobile`
- `typographyDesktop`
- `typographyStyle`
- `elevationStyle`

Required JSON structure by source type:
- `colorBase`, `colorLight`, `colorDark`: must expose a top-level `color` object
- `size`: must expose a top-level `size` object
- `typographyMobile`, `typographyDesktop`: must expose `font.family`, `font.size`, and `font.weight`
- `typographyStyle`: must expose `text-style`, and each text style must be a DTCG `typography` token with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing`
- `elevationStyle`: must expose `variables.color.light`, `variables.color.dark`, and `elevation`

Alias expectations:
- `colorLight` and `colorDark` can alias tokens from `colorBase`
- Typography style tokens are expected to alias typography variable tokens
- Elevation tokens are expected to alias `size` tokens for blur and depth values

Generated outputs:
- `color-light` and `color-dark` are generated separately per platform
- `size` is generated separately per platform
- `typography-mobile` and `typography-desktop` are generated separately per platform
- `elevation-light` and `elevation-dark` are generated separately per platform
- Web typography and elevation outputs merge variables and helper classes into a single CSS file

Notes:
- If a source file is renamed, update `style-dictionary.config.json > sources`
- If a source file’s structure changes, update the validator and the generated source preparation in `scripts/style-dictionary-build/pipeline.js`
