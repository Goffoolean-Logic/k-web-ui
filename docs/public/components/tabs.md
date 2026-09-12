# Tabs

KTabs.mount on an empty .k-tabs element.

Tabs switch related panels in place, such as overview / usage / API, or three views of the same object. Do not use them for wizard steps or for a sequence the reader has to walk in order.

Put an id and `.k-tabs` on an empty element. `KTabs.mount` builds the tablist, tabs, panels, and ARIA from `items`. Each item is a `label` and `content` (a string or a node). `selected` is the starting index. `label` names the tablist. `keyboard` (default true) is arrow / Home / End.

The selected tab gets the orange underline. Hidden panels use `[hidden]`. If the element is wiped and you call `mount` again, it rebuilds.

## Classes

| Class | Type |
| --- | --- |
| `k-tabs` | component |
| `k-tabs__list` | part |
| `k-tabs__tab` | part |
| `k-tabs__panel` | part |

## Examples

### Three panels

A mounted example. Click a tab or move with the arrow keys once one is focused.

```html
<div id="docs-tabs" class="k-tabs"></div>
```

```js
import { KTabs } from 'k-web-components/js';

KTabs.mount('docs-tabs', {
  items: [
    { label: 'Overview', content: 'The first panel.' },
    { label: 'Usage', content: 'The second panel.' },
    { label: 'API', content: 'The third panel.' },
  ],
});
```

## Accessibility

`KTabs.mount` builds `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Tabs get `aria-selected`, `aria-controls`, and matching `aria-labelledby` on the panel. Hidden panels use `[hidden]`. Arrow keys, Home, and End move between tabs when `keyboard` is true (the default). Pass `label` to name the tablist. The kit focus ring applies to the tab buttons.

## Dos and don'ts

**Do**
- Mount on an empty element with an id and `.k-tabs`.
- Pass `items` with a `label` and `content`.
- Use tabs for related views of the same object.

**Don't**
- Use tabs as wizard steps.
- Hand-write the tablist. `mount` builds it.
- Hide required content in a panel the reader may never open.
