# Typography plan

The kit currently has no typefaces of its own. Components inherit the consumer’s (or the browser’s) `font-family`, and size/weight come from Tailwind defaults (`text-xs` / `text-sm` / `text-base`, `font-medium` / `font-semibold`). This document is what it takes to make a font family a first-class part of the kit, the same way color tokens already are.

Brand context for choosing faces: orange chrome, black/white canvas, warm orange wash in light mode. Industrial, not costume. Readable at UI sizes (labels, buttons, inputs), not just posters.

---

## Shortlist

All of these are SIL Open Font License (or equivalent) and can be self-hosted as `.woff2` in the package. Proprietary / CDN-only faces are out: a published CSS kit cannot depend on Google Fonts at runtime.

### Recommended pairing

**IBM Plex Sans + IBM Plex Mono**

One foundry, matching metrics, OFL, variable files available. Grotesk enough for orange/black/white without looking like a construction-site mock. Plex Mono covers Storybook specimens and any future `code` / tabular UI. Weights we already use (400 / 500 / 600) are first-class.

### Alternatives

| Role | Family | Why it fits | Caveat |
| --- | --- | --- | --- |
| Sans (UI) | IBM Plex Sans | Industrial, complete family, variable | Slightly “IBM” if you know it |
| Sans (UI) | Archivo | Grotesque, poster-adjacent, has condensed | Condensed is tempting and easy to overuse |
| Sans (UI) | Space Grotesk | Geometric, a bit technical | Weaker at small caption sizes |
| Sans (UI) | Outfit | Geometric, warm, matches the orange wash | Less industrial than Plex/Archivo |
| Sans (UI) | Figtree | Large x-height, very readable | Softer than the chrome |
| Sans (UI) | Geist | Modern product UI, has a mono | Reads as “startup default” |
| Sans (UI) | Atkinson Hyperlegible Next | Built for low vision | Personality is the a11y brief, not the brand |
| Sans (UI) | Public Sans | Neutral, USWDS-grade | Easy to forget |
| Mono | IBM Plex Mono | Pairs with Plex Sans | — |
| Mono | Geist Mono | Clean UI mono | Ligatures off for a design system |
| Mono | Source Code 3 | Workhorse | Unrelated to the sans unless Source Sans is chosen |
| Mono | JetBrains Mono | Distinctive | Coding-editor vibe in a UI kit |
| Display (optional) | Archivo Black / Space Grotesk at 600+ | Titles only | Do not use as the UI sans |

Skip: Inter (already everyone’s fallback), Bebas/Oswald/Anton (costume), anything not redistributable.

**Decision:** Outfit + IBM Plex Mono.

---

## What “operational” means in this repo

A family is operational when a consumer can `import 'k-web-components'` (or `./base`) and every `k-` component renders in that face, with no extra font CSS of their own, and without the kit restyling the rest of the page.

That maps onto this kit’s existing rules:

- Primitives live in `package/src/base/tokens.css`. Nothing outside `themes.css` should name a raw palette color; same idea for fonts: components never name `"IBM Plex Sans"` directly.
- Semantic tokens are CSS variables so a consumer can retheme without a rebuild.
- `@theme inline` in `theme-bridge.css` is how Tailwind utilities (`font-k-sans`) emit `var(--k-font-sans)` instead of baking the family name at build time.
- The published utility surface is whatever `safelist.css` pins. A font utility that is not safelisted will not exist for no-build consumers.
- The kit **ships no reset**. Fonts must attach to `k-` markup only (same scoping pattern as `focus.css`), not `body` / `html`.
- Visual CSS is element-qualified (`button.k-btn`, `input.k-input`). Font family should still apply on those elements; do not re-open class-only selectors.
- Dist is four CSS builds (`full`, `base`, `components`, `utilities`) plus JS. `@font-face` belongs in **base only**. Components and utilities reference the tokens; they must not embed font files.

### Minimum file set for one family

For a variable sans (preferred over three static weights):

```
package/src/base/fonts/
  LICENSE                    # OFL (or the face’s license)
  sans.woff2                 # latin (+ latin-ext if we need it)
  mono.woff2                 # same
package/src/base/fonts.css   # @font-face only
```

Static alternative if a variable cut is missing: `sans-400.woff2`, `sans-500.woff2`, `sans-600.woff2` (and italic only if we add italic UI). Current components do not use italic.

### Tokens

Add to `tokens.css` (or a sibling `typography.css` imported from base — keep color primitives and type primitives in separate files if the file is getting long):

```css
--k-font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
--k-font-mono: "IBM Plex Mono", ui-monospace, monospace;
```

Family names in the stack **must match** the `font-family` in `@font-face`. Fallbacks stay generic; do not list Inter/Arial as if they were the brand.

Optional later, not required for v1:

```css
--k-font-display: var(--k-font-sans);
```

Type scale can stay on Tailwind’s `text-xs` / `text-sm` / `text-base` for v1. Tokenizing size/leading is a second pass (see below). Weights in use today, so the files must provide them:

| Tailwind class | Weight | Where |
| --- | --- | --- |
| (default) | 400 | inputs, links, card body, tab panels |
| `font-medium` | 500 | buttons, labels, tabs |
| `font-semibold` | 600 | card titles |

No `font-bold`, no italic. Do not ship a 900 display cut until something uses it.

### `@font-face` (base)

`package/src/base/fonts.css`, imported from `base/index.css` and `src/index.css` next to `tokens.css`:

- `font-family` matching the token
- `src: url('./fonts/sans.woff2') format('woff2')` (variable: add `font-weight: 100 900`)
- `font-style: normal`
- `font-display: swap` (UI text must appear; `optional` will drop the face on slow networks)
- `unicode-range` for Latin so CJK consumers do not download a latin file as if it covered everything — it still will not cover CJK; that is accepted for v1
- `font-synthesis: none` on `k-` text if we do not ship italic/bold files, so the browser does not fake them

### Theme bridge + safelist

```css
/* theme-bridge.css */
--font-k-sans: var(--k-font-sans);
--font-k-mono: var(--k-font-mono);
```

```css
/* safelist.css */
@source inline("font-k-{sans,mono}");
```

That is what makes `font-k-sans` exist in `dist/full.css` and `dist/utilities/index.css`.

### Applying the face without a reset

Mirror `focus.css`: one base-layer rule scoped to kit classes, not a global `body` rule.

```css
:is([class^='k-'], [class*=' k-']) {
  font-family: var(--k-font-sans);
}
```

Exceptions: `code` / `kbd` inside kit markup, and any future `k-code`, get `var(--k-font-mono)`. Storybook `preview.css` may set `body { font-family: var(--k-font-sans); }` so the workbench matches; that file is not published.

Do **not** add `font-k-sans` to every component by hand unless we drop the catch-all. One rule, like the focus ring.

### Dist and package exports

Tailwind CLI inlines CSS; it does not automatically copy `.woff2` next to every output. Plan for this explicitly:

1. Keep font files under `package/src/base/fonts/`.
2. Copy them to `package/dist/fonts/` as part of `build:css` (a small `node`/`cpy` step, or document that `full.css` urls point at `../src/...` — pointing dist CSS at `src` is fragile for consumers who only install `dist`).
3. `@font-face` urls in the **published** CSS must resolve relative to that CSS file. `dist/full.css` → `url('./fonts/sans.woff2')` with files at `dist/fonts/`. `dist/base/index.css` is nested one extra directory (`dist/base/`) so it needs `url('../fonts/sans.woff2')` **or** a single canonical `@font-face` only in `full.css` / `base` with a shared fonts folder. Verify all four CSS targets; components/utilities should not emit `@font-face` at all (`@reference` must not duplicate it).
4. `package.json` `files` already includes `dist` and `src`. Add an export if consumers need the files directly:

```json
"./fonts/*": "./dist/fonts/*"
```

5. Source consumers (`k-web-components/source`) compile `src/index.css` themselves; their bundler must resolve `url('./fonts/sans.woff2')` from `fonts.css`. That works if the files sit next to that CSS.

Build check: open `dist/full.css`, confirm `@font-face` exists once, urls 200, and `dist/components/index.css` does not contain `@font-face`.

### Storybook

New `dev-env/stories/typography.stories.ts` under Foundations:

- Pangram at 400 / 500 / 600
- `text-xs` / `text-sm` / `text-base` (the sizes components actually use)
- Mono specimen
- Light and dark (toolbar already switches `data-theme`)
- A `button.k-btn`, `input.k-input`, `h3.k-card__title` so we see the face on real chrome, not only a `<p>`

### License in the published package

Ship the OFL (or face license) next to the woff2 files. Mention the faces in the package description or a short `NOTICE`. Do not subset in a way the license forbids; OFL allows subsetting.

---

## Type scale (v1 vs v2)

**v1 (ship with the fonts):** do not invent a new scale. Keep `text-xs` (0.75rem), `text-sm` (0.875rem), `text-base` (1rem), `leading-tight` where it already is. The win is the family, not new sizes.

**v2 (optional, after the face is in):** semantic size tokens, bridged like color:

| Token | Value | Maps from |
| --- | --- | --- |
| `--k-text-xs` | 0.75rem | hints, errors, `k-btn--sm` |
| `--k-text-sm` | 0.875rem | buttons, inputs, labels, tabs, card body |
| `--k-text-md` | 1rem | card title, `k-btn--lg` |
| `--k-leading-tight` | 1.25 | buttons, titles |
| `--k-leading-normal` | 1.5 | body |

Bridge as `--text-k-xs` etc. only if we want `text-k-sm` utilities. Otherwise components keep `@apply text-sm` and we only own `font-family`.

Tabular figures (`font-variant-numeric: tabular-nums`) on `input.k-input` are a cheap v2 and help aligned numbers. Not required for the first font drop.

---

## Implementation order

1. Pick sans + mono from the shortlist.
2. Add latin `.woff2` + license under `package/src/base/fonts/`.
3. Add `fonts.css` (`@font-face`) and font tokens.
4. Import `fonts.css` from both base entrypoints (`base/index.css`, `src/index.css`).
5. Bridge `--font-k-sans` / `--font-k-mono`; safelist `font-k-{sans,mono}`.
6. Apply `font-family: var(--k-font-sans)` on the existing `k-` catch-all (new rule next to `focus.css`, or inside it if we want one “kit text” file).
7. Copy fonts into `dist/fonts/` during `build:css`; fix `url()` so `full` and `base` both resolve.
8. Export `./fonts/*`. Set Storybook `body` font in `preview.css`.
9. Add Foundations/Typography stories. Check light + dark, button, input, card title, tabs.
10. Confirm `dist/components` and `dist/utilities` have no `@font-face`, and that a page with only kit classes (no consumer `body` font) still shows Plex (or whichever face) on `button.k-btn`.

Do not add heading components (`h3.k-heading`) in the same drop unless we need them; card titles already cover a heading-sized style.

---

## Open decisions

- **Sans / mono pair** — default IBM Plex Sans + IBM Plex Mono.
- **Variable vs static** — variable unless the chosen family has no variable cut.
- **Latin-ext** — include if we care about Polish/Czech/etc. in v1; otherwise latin only.
- **Catch-all vs per-component `font-k-sans`** — catch-all, matching focus.
- **Tokenized type scale** — not in the font drop.
