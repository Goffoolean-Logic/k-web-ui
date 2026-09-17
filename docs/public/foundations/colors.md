# Colors

Palette steps and the semantic colors that flip with the theme.

Color in the kit is two layers. The palette is a fixed set of hex values. Semantic tokens (`--k-surface`, `--k-primary`, `--k-danger`) point at those values and flip when you set `data-theme` on the document root.

Orange for buttons, fields, borders, and the focus ring is set once. It doesn't flip in dark mode, so a dark page doesn't turn the controls blue. Dark page backgrounds use the steel scale. Steel 950 is black.

```html
<html data-theme="k-light">
```

`k-light` or `k-dark`. Utilities like `bg-k-primary` and `text-k-fg` emit `var(--k-…)`, so a theme switch doesn't need a rebuild.

Components should use the semantic tokens, not the palette steps. The palette is the source. Semantic names are what you override if the defaults aren't what you want.

## Surfaces and type

The page background, raised panels, and text.

| Token | Role |
| --- | --- |
| `--k-surface` | Page background |
| `--k-surface-raised` | Cards, menus, raised panels |
| `--k-surface-hard` | A stronger fill on top of the page |
| `--k-surface-soft` | A wash, usually the same as the page |
| `--k-fg` | Body text |
| `--k-fg-muted` | Secondary text, captions |

## Brand and fields

Most of these stay orange in both themes. `--k-field` is the fill on inputs. `--k-primary` is the main action. `--k-ring` is the focus color. `--k-border-hard` is the exception: black in light, orange-500 in dark.

| Token | Role |
| --- | --- |
| `--k-field` / `--k-field-fg` | Input fill and type |
| `--k-border` | Borders. Orange in both themes. |
| `--k-border-hard` | High-contrast frames. Black in light, orange-500 in dark. |
| `--k-primary` / `--k-primary-fg` / `--k-primary-hover` | Primary actions |
| `--k-ring` | Focus ring color |
| `--k-accent` / `--k-accent-fg` / `--k-accent-hover` | Inverse fill (dark type on light, or the reverse in dark mode) |

## Status

Danger, info, success, and warning. Warning reuses the orange scale. Red, blue, and green exist only for these roles.

| Token | Role |
| --- | --- |
| `--k-danger` / `--k-danger-fg` | Danger |
| `--k-info` / `--k-info-fg` | Info |
| `--k-success` / `--k-success-fg` | Success |
| `--k-warning` / `--k-warning-fg` | Warning |

## Palette

Hex values. Semantic tokens point here. You usually don't use these in component CSS.

### Orange

Brand. Light page wash, fields, actions, borders, and focus.

`orange-50`, `orange-100`, `orange-200`, `orange-300`, `orange-400`, `orange-500`, `orange-600`, `orange-700`, `orange-800`, `orange-900`, `orange-950`

### Steel

Dark page backgrounds. 950 is black. Raised panels sit on 900. Stronger fills sit on 800.

`steel-50`, `steel-100`, `steel-200`, `steel-300`, `steel-400`, `steel-500`, `steel-600`, `steel-700`, `steel-800`, `steel-900`, `steel-950`

### Neutral

A cool gray scale. Nothing in the current themes points at it. It's there if you need a gray that isn't steel.

`neutral-50`, `neutral-100`, `neutral-200`, `neutral-300`, `neutral-400`, `neutral-500`, `neutral-600`, `neutral-700`, `neutral-800`, `neutral-900`, `neutral-950`

### Yellow

A true yellow. Nothing in the current themes points at it either. Warning stays on the orange scale, so a warning still reads as kit chrome. These docs use `yellow-300` for the JS badge next to a page title.

`yellow-50`, `yellow-100`, `yellow-200`, `yellow-300`, `yellow-400`, `yellow-500`, `yellow-600`, `yellow-700`, `yellow-800`, `yellow-900`, `yellow-950`

### Status ramps

Only the steps the themes actually use.

`red-400`, `red-600`, `red-950`, `green-400`, `green-700`, `green-950`, `blue-400`, `blue-600`, `blue-950`, `white`, `black`

## Utilities

Same names as the semantic tokens: `bg-k-primary`, `text-k-fg`, `border-k-border`, `bg-k-surface-raised`. They are available when you compile from source, and the published stylesheet safelists the set above.
