# k-web-components

Fast, lightweight, framework-agnostic UI components. A toolbox you can configure and build with.

You write HTML. The kit paints `k-` classes. JS mounts only when CSS cannot. Nothing restyles unless it carries a `k-` class.

## Use

```bash
pnpm add k-web-components
```

```js
import 'k-web-components';
```

```html
<button type="button" class="k-btn k-btn--primary">Save</button>
```

Theme is one attribute on the root: `data-theme="light"`, `dark`, or `auto`. Orange chrome does not change. The canvas does.

Widgets the platform cannot do in CSS take a `mount()` on a host you already marked up:

```html
<div id="pages" class="k-pagination"></div>
```

```js
import { KPagination } from 'k-web-components/js';

KPagination.mount('pages', { count: 12, page: 5 });
```

`KTabs`, `KDropdown`, `KCarousel` work the same way. Accordion, grid, modal, sidebar, spin, table, toast, and tooltip are CSS only.

The prebuilt import is the whole kit. Compile from `k-web-components/source` in your own Tailwind build if you want unused classes out of the file. Split layers with `k-web-components/base`, `/components`, and `/utilities`.

## Repo

pnpm workspace. Node 24.

| Folder | What it is |
| --- | --- |
| `package/` | The published kit (`k-web-components@0.1.0`) |
| `docs/` | Starlight docs. Consumes the package. |
| `dev-env/` | Storybook. Consumes the package. |

```bash
pnpm install
pnpm docs            # docs at http://localhost:4321
pnpm dev             # Storybook at http://localhost:6006
pnpm test
pnpm lint
pnpm typecheck
pnpm build           # kit CSS + JS
```

`pnpm docs` and `pnpm dev` build the kit first so `k-web-components/js` resolves to `dist`.
