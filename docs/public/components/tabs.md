# Tabs

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-tabs. Tablist, panels, and ARIA from panels.

Tabs switch related panels in place, such as overview / usage / API, or three views of the same object. Do not use them for wizard steps or for a sequence the reader has to walk in order.

Put `<k-tabs class="k-tabs">` on the page with `panels`. The element builds the tablist, tabs, panels, and ARIA. Each panel is a `label` and `content`. `icon` is optional: a kit icon name.

Tabs sit flush. The selected chrome is primary. Switching a tab slides that fill through the tabs in between, then fades the panel. Hidden panels use `[hidden]`. Changing `panels` rebuilds the tablist; changing `selected`, `size`, `label`, or `keyboard` does not. Reduced motion drops the motion.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-tabs` | component | The one class you write. The element generates the list, tabs, panels, and ink inside it. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `panels` | JSON array | — | One object per panel: label, optional icon, and content. Content from an attribute is plain text. |
| `label` | string | — | Accessible name for the generated tablist. |
| `selected` | number | `0` | Zero-based index of the open panel. |
| `keyboard` | `"false"` to disable | enabled | Arrow keys, Home, and End move between tabs. |
| `size` | `"lg"` | — | Fixed 10rem tabs with larger padding and type. Omit for the default width. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `select(index, { focus })` | void | Opens a panel and fires `k-change`. Pass `focus: true` to move focus to the tab. |
| `disconnect()` | void | Removes listeners without removing the element from the page. |

Three properties round out the API. `panels` is read/write and accepts a `Node` as `content` or `icon`, which is how you get links, headings, or images into a panel — node values are not written back to the attribute. `tabs` returns the tab buttons and `selectedIndex` the open index, both read-only.

Selecting a tab dispatches `k-change` with `{ selected }`, and the event bubbles. Setting the `selected` attribute moves the panel without firing the event, so you can drive the element from your own state without a loop.

## Examples

### Three panels

Click a tab or move with the arrow keys once one is focused.

```html
<k-tabs
  class="k-tabs"
  label="Sections"
  panels='[{"label":"Overview","content":"The first panel."},{"label":"Usage","content":"The second panel."},{"label":"API","content":"The third panel."}]'
></k-tabs>
```

### With icons

`icon` is a kit name such as `info`. The glyph sits before the label and shrinks to `1em`.

```html
<k-tabs
  class="k-tabs"
  panels='[{"label":"Overview","icon":"info","content":"The first panel."},{"label":"Usage","icon":"success","content":"The second panel."},{"label":"API","icon":"warning","content":"The third panel."}]'
></k-tabs>
```

### Large

`size="lg"` makes every tab a fixed 10rem wide, with larger padding and type.

```html
<k-tabs
  class="k-tabs"
  size="lg"
  panels='[{"label":"Overview","icon":"info","content":"The first panel."},{"label":"Usage","icon":"success","content":"The second panel."},{"label":"API","icon":"warning","content":"The third panel."}]'
></k-tabs>
```

## Accessibility

`k-tabs` builds `role="tablist"`, `role="tab"`, and `role="tabpanel"` on the `k-tabs__list`, `k-tabs__tab`, and `k-tabs__panel` parts it generates. Tabs get `aria-selected`, `aria-controls`, and matching `aria-labelledby` on the panel. Hidden panels use `[hidden]`. Arrow keys, Home, and End move between tabs when `keyboard` is true (the default). Pass `label` to name the tablist. The kit focus ring applies to the tab buttons. Decorative icons are `aria-hidden`; keep the name in the tab text.

Give the host an `id` when more than one `k-tabs` is on the page. Generated ids derive from it, so two id-less hosts collide.

## Dos and don'ts

**Do**
- Use `<k-tabs class="k-tabs">` with `panels`.
- Pass `panels` with a `label` and `content`. `icon` is optional.
- Use tabs for related views of the same object.
- Reach for the `panels` property when a panel needs real markup.

**Don't**
- Use tabs as wizard steps.
- Hand-write the tablist. The element builds it.
- Hide required content in a panel the reader may never open.
- Rely on the icon alone for the tab name.
