## Using AI Agent for coding
- Run `npm run sync-skills` to sync the agent skills

## How to use FigmaMCP
- 

## Style Dictionary
### What to do after token json files are updated
- Install dependencies with `npm install`
- Build tokens with `npm run build:tokens`

### About style dictionary
- Build script lives at `scripts/build-tokens.js`
- Outputs are written to `style-dictionary/<platform>/`
- Source globs live in `style-dictionary.config.json`
- Configure Android Compose output in `style-dictionary.config.json` under `androidCompose`
- The build reads token JSON from `design-tokens/**/*.json`
- Generated platform folders are `web`, `android/resources`, `android/compose`, and `ios`
- If you reorganize files later, update the `source` globs in `style-dictionary.config.json` instead of changing the build script
