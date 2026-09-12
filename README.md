# k-web-components

CSS classes for real HTML. Put `k-` classes on a button, a table, or a dialog and they pick up the kit look. Most of the kit is a stylesheet. A few widgets (tabs, pagination, dropdowns, and the carousel) need a `mount()` call because CSS cannot manage that behavior on its own.

The kit does not wrap elements in React, does not register custom elements, and does not restyle the rest of your page. If an element has no `k-` class, it is left alone.

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

Set `data-theme="light"`, `dark`, or `auto` on the document root. Light and dark change the page background and text. The orange on buttons, fields, and focus stays the same in both themes.

For pagination, tabs, dropdowns, and the carousel, leave an empty element on the page and call `mount`:

```html
<div id="pages" class="k-pagination"></div>
```

```js
import { KPagination } from 'k-web-components/js';

KPagination.mount('pages', { count: 12, page: 5 });
```

Accordion, grid, modal, sidebar, spin, table, toast, and tooltip are CSS only. You write the markup and skip `mount`.

`import 'k-web-components'` is the full prebuilt stylesheet. If you already run Tailwind, `k-web-components/source` lets the compiler omit classes you never used. You can also import `/base`, `/components`, and `/utilities` separately.

## Repo

This is a pnpm workspace. Node 24.

| Folder | What it is |
| --- | --- |
| `package/` | The kit on npm (`k-web-components@0.1.0`) |
| `docs/` | The docs site. It depends on the package like anyone else. |
| `dev-env/` | Storybook. Same deal. |

```bash
pnpm install
pnpm docs            # http://localhost:4321
pnpm dev             # Storybook, http://localhost:6006
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm docs` and `pnpm dev` build the kit first. The JavaScript export points at `dist`, so an unbuilt checkout will miss that file.
