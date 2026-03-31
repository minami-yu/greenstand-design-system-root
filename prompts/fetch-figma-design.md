/figma-use /sync-figma-token
Using the Figma file below, fetch only style definitions and generate style design token JSON files under `design-tokens`.

Figma file:
https://www.figma.com/design/hyfPWEHHgiH3YE3WWc6Cvn/Yuri-New-Roots-Design-System-1.0?node-id=12004-6&t=RsSap6FyfBgMBsz2-1


Create DTCG JSON token source files for this repo.

Output folders:
- design-tokens/variables
- design-tokens/styles

Use valid JSON only.
Use DTCG fields like `$type`, `$value`, and optional `$description`.
Do not add markdown fences.
Do not add explanation text outside the JSON.

Create these exact variable files:
- design-tokens/variables/token_color-base_value.json
- design-tokens/variables/token_color_light.json
- design-tokens/variables/token_color_dark.json
- design-tokens/variables/token_size_value.json
- design-tokens/variables/token_typography-base_mobile.json
- design-tokens/variables/token_typography-base_desktop.json

Create these exact style files:
- design-tokens/styles/typography.json
- design-tokens/styles/elevation.json

Requirements:
- `token_color-base_value.json` must contain base palette tokens under top-level `color`
- `token_color_light.json` and `token_color_dark.json` must contain semantic color tokens under top-level `color`
- Light and dark color files should alias base color tokens, for example `{color.green.600}`
- `token_size_value.json` must contain top-level `size` and may contain `responsive`
- `token_typography-base_mobile.json` and `token_typography-base_desktop.json` must contain top-level `font.family`, `font.size`, and `font.weight`
- `typography.json` must contain top-level `text-style`
- Each `text-style` token must use `$type: "typography"` and `$value` with:
  - `fontFamily`
  - `fontSize`
  - `fontWeight`
  - `lineHeight`
  - `letterSpacing`
- Typography style aliases must reference the typography variable files, for example `{font.size.md}`
- `elevation.json` must contain top-level `elevation`
- `elevation.json` must also contain `variables.color.light`, `variables.color.dark`
- Each elevation token must use `$type: "shadow"` with an array `$value`
- Each shadow layer must define:
  - `color`
  - `offsetX`
  - `offsetY`
  - `blur`
  - `spread`
- Elevation blur and depth values should alias size tokens, for example `{size.depth.025}` and `{size.blur.800}`

Formatting rules:
- Keep aliases in DTCG curly-brace syntax
- Keep top-level keys exactly as specified
- Do not rename files
- Do not merge multiple outputs into one file
- Do not create extra files unless explicitly requested
