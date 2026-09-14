# Tabs

k-tabs. Tablist, panels, and ARIA from items.

Tabs switch related panels in place, such as overview / usage / API, or three views of the same object. Do not use them for wizard steps or for a sequence the reader has to walk in order.

Put `<k-tabs class="k-tabs">` on the page and set `items`. The element builds the tablist, tabs, panels, and ARIA. Each item is a `label` and `content` (a string or a node). `selected` is the starting index. `label` names the tablist. `keyboard` (default true) is arrow / Home / End.

The selected tab gets the orange underline. Hidden panels use `[hidden]`. Setting `items` again rebuilds the tablist.

## Classes

| Class | Type |
| --- | --- |
| `k-tabs` | component |
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

## Accessibility

`k-tabs` builds `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Tabs get `aria-selected`, `aria-controls`, and matching `aria-labelledby` on the panel. Hidden panels use `[hidden]`. Arrow keys, Home, and End move between tabs when `keyboard` is true (the default). Pass `label` to name the tablist. The kit focus ring applies to the tab buttons.

## Dos and don'ts

**Do**
- Use `<k-tabs class="k-tabs">` and set `items`.
- Pass `items` with a `label` and `content`.
- Use tabs for related views of the same object.

**Don't**
- Use tabs as wizard steps.
- Hand-write the tablist. The element builds it.
- Hide required content in a panel the reader may never open.
