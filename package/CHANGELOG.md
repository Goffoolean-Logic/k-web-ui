# Changelog

All notable changes to the `k-web-ui` npm package.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [0.1.5] - 2026-09-21

### Changed

- Text parts (card title/subtitle, modal title/body, banner title/description, label/hint/error, accordion panel) style from the class alone. Theme colors no longer require a specific tag like `h3` or `p`.

## [0.1.4] - 2026-09-21

### Changed

- Simplified JavaScript components: give the host an `id`, link panels/slides as `#id-0`, `#id-1`, …, and set `.options` in script. Host order in the tree no longer matters.
- Gauge dial text follows `format` (`%`, `$`, …). Use `text` only for one-offs.
- Sidebar nav chrome: groups, nested lists, active link, docked rail.
- Pagination and selected sidebar styles; smaller group chevrons with open/close motion.

### Added

- `chevron-up` icon.
- `setGauge` / `createGauge` helpers (unchanged API surface, documented).

## [0.1.3] - 2026-09-20

### Added

- `k-web-ui/postcss` entry so apps can compile against the kit without installing `tailwindcss` themselves.
- Tailwind IntelliSense wiring through that PostCSS entry.

## [0.1.2] - 2026-09-20

### Fixed

- Package metadata and publish path for the `0.1.x` line.

## [0.1.1] - 2026-09-20

### Added

- `k-gauge` custom element (square reading + caption), split from progress.
- Kit icons and footer marks used by docs and Storybook.
- PostCSS integration for consuming apps.

### Changed

- Shadow tokens made usable as utilities / theme values.
- Light-DOM initialization for JavaScript components.
- Progress remains the linear bar; gauge is the square frame.

## [0.1.0] - 2026-09-15

### Added

- First published kit as `k-web-ui`.
- Custom elements for tabs, pagination, dropdown, carousel, and scrollbar.
- CSS components: accordion, badge, banner, button, card, grid, input, link, modal, progress, sidebar, spin, table, toast, tooltip.
- `k-light` / `k-dark` themes, Outfit + IBM Plex Mono, design tokens.

### Changed

- Rebranded the workspace, package, docs, and GitHub repo to K-Web-UI.
