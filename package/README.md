# k-web-ui

CSS classes for real HTML, plus a little JS when the browser cannot do the job.

```bash
pnpm add k-web-ui
```

```css
@import 'k-web-ui';
```

```js
import 'k-web-ui/js';
```

Set `data-theme="k-light"` or `k-dark` on the document root.

## JS components (0.2)

Six custom elements: `k-tabs`, `k-pagination`, `k-carousel`, `k-dropdown`, `k-gauge`, `k-scrollbar`.

**One pattern:** give the host a unique `id`. For tabs, pagination, and carousel, put page/slide HTML in `#${id}-0`, `#${id}-1`, … consecutive from zero. The element finds those nodes with `getElementById` — host order in the tree does not matter.

| Element | Setup |
| --- | --- |
| `k-tabs` | `.options = [{ label, icon? }, …]` — labels must match node count |
| `k-pagination` | no options — count is the linked nodes |
| `k-carousel` | no options — slides must be the only children of their parent (that parent becomes the track) |
| `k-dropdown` | `.options = { trigger, items: [{ label, href? }], select? }` |
| `k-gauge` | `.options = { value, max, format?, label?, text? }` plus modifier classes |
| `k-scrollbar` | wraps children, or `.options = { target: 'viewport' \| selector }` |

Modifier classes (not attributes): `k-tabs--lg`, `k-tabs--no-keyboard`, `k-carousel--autoscroll`, `k-carousel--no-keyboard`, `k-dropdown--end`, `k-gauge--sm` / `--lg` / `--info` / `--success` / `--warning` / `--danger` / `--indeterminate`, `k-scrollbar--x` / `--y` / `--sm` / `--lg` / `--no-autohide`.

`select(index)` moves tabs, pagination, and carousel. They emit `k-change` with `{ index }`. Dropdown emits `{ index, label, href }`.

### Examples

```html
<k-tabs id="education" aria-label="Education"></k-tabs>
<div id="education-0">…</div>
<div id="education-1">…</div>

<div>
  <div id="deals-0">…</div>
  <div id="deals-1">…</div>
</div>
<k-carousel id="deals" class="k-carousel--autoscroll"></k-carousel>

<div id="story-0">…</div>
<div id="story-1">…</div>
<k-pagination id="story"></k-pagination>
```

```js
document.getElementById('education').options = [
  { label: 'KSU', icon: 'info' },
  { label: 'Courses' },
];
```

Do not put `dialog[popover]` inside a hidden tab/page/slide. Keep those dialogs as siblings of the host.

## CSS-only

Button, card, modal, accordion, badge, banner, grid, input, link, progress, sidebar, spin, table, toast, tooltip — write the markup with `k-` classes. No JS import required for those.
