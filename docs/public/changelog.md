# Changelog

Release notes for [`k-web-ui`](https://www.npmjs.com/package/k-web-ui). Versions follow semver. The same history lives in the package as `CHANGELOG.md`.

Install a specific release with:

```bash
pnpm add k-web-ui@0.1.6
```

## 0.1.6 — 2026-09-25

**Added**

- Gradient tokens `--k-gradient-fade`, `--k-gradient-rise`, and `--k-gradient-sheen`. Use them as `bg-k-gradient-fade`, `bg-k-gradient-rise`, and `bg-k-gradient-sheen`.

**Changed**

- `--k-shadow-1` is a larger soft shadow. In `k-dark` it picks up the primary color.
- Dark `--k-surface-raised` is steel-700.

## 0.1.5 — 2026-09-21

**Changed**

- Text parts (card title/subtitle, modal title/body, banner title/description, label/hint/error, accordion panel) style from the class alone. Theme colors no longer require a specific tag like `h3` or `p`.

## 0.1.4 — 2026-09-21

**Changed**

- JavaScript components use one pattern: host `id`, content at `#id-0`, `#id-1`, …, and `.options` in script. Order in the tree does not matter.
- Gauge dial text follows `format` (`%`, `$`, …). Reach for `text` only when you need a one-off.
- Sidebar nav chrome: groups, nested lists, active link, and a docked rail.
- Pagination hover / current styles, and sidebar group chevrons that rotate open and closed.

**Added**

- `chevron-up` icon.
- Docs coverage for `setGauge` and `createGauge`.

## 0.1.3 — 2026-09-20

**Added**

- `k-web-ui/postcss` so apps compile against the kit without adding their own `tailwindcss` dependency.
- Tailwind IntelliSense through that PostCSS entry.

## 0.1.2 — 2026-09-20

**Fixed**

- Package metadata for the `0.1.x` publish line.

## 0.1.1 — 2026-09-20

**Added**

- `k-gauge` (square reading and caption), separate from progress.
- Kit icons used in docs and Storybook.
- PostCSS integration for consumers.

**Changed**

- Shadow tokens work as utilities / theme values.
- JavaScript components initialize on the light DOM.
- Progress stays the linear bar; gauge is the frame.

## 0.1.0 — 2026-09-15

**Added**

- First npm release as `k-web-ui`.
- Custom elements: tabs, pagination, dropdown, carousel, scrollbar.
- CSS components: accordion, badge, banner, button, card, grid, input, link, modal, progress, sidebar, spin, table, toast, tooltip.
- `k-light` / `k-dark`, Outfit, IBM Plex Mono, and the token set.

**Changed**

- Workspace, package, docs, and GitHub repo renamed to K-Web-UI.
