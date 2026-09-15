# Tabs

k-tabs. Tablist, panels, and ARIA from items.

Tabs switch related panels in place, such as overview / usage / API, or three views of the same object. Do not use them for wizard steps or for a sequence the reader has to walk in order.

Put `<k-tabs class="k-tabs">` on the page and set `items`. The element builds the tablist, tabs, panels, and ARIA. Each item is a `label` and `content` (a string or a node). `icon` is optional: a kit icon name or a node. `selected` is the starting index. `label` names the tablist. `keyboard` (default true) is arrow / Home / End.

The selected tab gets an orange background. Hidden panels use `[hidden]`. Setting `items` again rebuilds the tablist. `--lg` is a fixed 10rem tab, larger type and padding.

## Classes

| Class | Type |
| --- | --- |
| `k-tabs` | component |
| `k-tabs--lg` | modifier |
| `k-tabs__list` | part |
| `k-tabs__tab` | part |
| `k-tabs__panel` | part |

## Examples

### Three panels

Click a tab or move with the arrow keys once one is focused.

```html
<k-tabs id="docs-tabs" class="k-tabs"></k-tabs>
```

```js
import { KTabs } from 'k-web-ui/js';

const tabs = document.getElementById('docs-tabs');
tabs.items = [
  { label: 'Overview', content: 'The first panel.' },
  { label: 'Usage', content: 'The second panel.' },
  { label: 'API', content: 'The third panel.' },
];
```

### With icons

`icon` is a kit name such as `info`. The glyph sits before the label and shrinks to `1em`. You can also pass a node.

```html
<k-tabs id="docs-tabs-icons" class="k-tabs"></k-tabs>
```

```js
import { KTabs } from 'k-web-ui/js';

const tabs = document.getElementById('docs-tabs-icons');
tabs.items = [
  { label: 'Overview', icon: 'info', content: 'The first panel.' },
  { label: 'Usage', icon: 'success', content: 'The second panel.' },
  { label: 'API', icon: 'warning', content: 'The third panel.' },
];
```

### Large

`--lg` makes every tab a fixed 10rem wide, with larger padding and type.

```html
<k-tabs id="docs-tabs-lg" class="k-tabs k-tabs--lg"></k-tabs>
```

```js
import { KTabs } from 'k-web-ui/js';

const tabs = document.getElementById('docs-tabs-lg');
tabs.items = [
  { label: 'Overview', icon: 'info', content: 'The first panel.' },
  { label: 'Usage', icon: 'success', content: 'The second panel.' },
  { label: 'API', icon: 'warning', content: 'The third panel.' },
];
```

## Accessibility

`k-tabs` builds `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Tabs get `aria-selected`, `aria-controls`, and matching `aria-labelledby` on the panel. Hidden panels use `[hidden]`. Arrow keys, Home, and End move between tabs when `keyboard` is true (the default). Pass `label` to name the tablist. The kit focus ring applies to the tab buttons. Decorative icons are `aria-hidden`; keep the name in the tab text.

## Dos and don'ts

**Do**
- Use `<k-tabs class="k-tabs">` and set `items`.
- Pass `items` with a `label` and `content`. `icon` is optional.
- Use tabs for related views of the same object.

**Don't**
- Use tabs as wizard steps.
- Hand-write the tablist. The element builds it.
- Hide required content in a panel the reader may never open.
- Rely on the icon alone for the tab name.
