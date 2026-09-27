# K-Web-UI

CSS classes for real HTML. Put `k-` classes on a button, a table, or a dialog and they pick up the kit look. Most of the kit is a stylesheet. Six widgets (tabs, pagination, dropdowns, carousel, gauge, and scrollbar) are custom elements because CSS cannot manage that behavior on its own.

The kit does not wrap elements in React and does not restyle the rest of your page. If an element has no `k-` class, it is left alone.

## Use

```bash
pnpm add k-web-ui
```

```js
import 'k-web-ui';
import 'k-web-ui/js';
```

```html
<button type="button" class="k-btn k-btn--primary">Save</button>
```

Set `data-theme="k-light"` or `k-dark` on the document root. They change the page background and text. The orange on buttons, fields, and focus stays the same in both themes.

CSS-only pieces (button, card, accordion, badge, banner, grid, input, link, modal, progress, sidebar, spin, table, toast, tooltip) need the stylesheet only. You write the markup and skip the JS import.

For the six custom elements, import `k-web-ui/js` once, give the host a unique `id`, and hand it options (or linked `#id-0`, `#id-1`, … nodes where the element expects them):

```html
<k-tabs id="sections" class="k-tabs" aria-label="Sections"></k-tabs>
<div id="sections-0">The first panel.</div>
<div id="sections-1">The second panel.</div>
```

```js
document.getElementById('sections').options = [
  { label: 'Overview' },
  { label: 'Usage' },
];
```

`import 'k-web-ui'` is the full prebuilt stylesheet. `@font-face` sits at the top of that file so the faces can start while the rest parses. `k-web-ui/fonts` is the faces alone if you want that sheet even earlier.

Tailwind ships as a dependency of this package. Apps that want the compiler (so their own `w-*` / `flex` classes exist) import `k-web-ui/source` and point PostCSS at `k-web-ui/postcss`. They should not install `tailwindcss` themselves. That PostCSS entry also exposes the kit's Tailwind package to the Tailwind IntelliSense extension. You can also import `/base`, `/components`, and `/utilities` separately.

## Repo

This is a pnpm workspace. Node 24.

| Folder | What it is |
| --- | --- |
| `package/` | The kit on npm (`k-web-ui@0.1.6`). See `package/CHANGELOG.md` for releases. |
| `docs/` | The docs site. It depends on the package like anyone else. |
| `dev-env/` | Storybook. Same deal. |
| `infra/` | Docs hosting / pipeline. |

```bash
pnpm install
pnpm docs            # http://localhost:4321
pnpm dev             # Storybook, http://localhost:6006
pnpm test
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm build
```

`pnpm docs` and `pnpm dev` build the kit first. The JavaScript export points at `dist`, so an unbuilt checkout will miss that file.
