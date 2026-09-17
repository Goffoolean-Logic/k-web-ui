# Scrollbar

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-scrollbar. Overlay thumbs that hide native bars.

A scrollbar is the kit's own thumb, painted over a scrolling pane. Use it when you want the same chrome in Chrome, Firefox, and Safari. Native bars look different in each, and CSS can only recolor them. Don't use this for a progress reading. That's [progress](/components/progress.md) or [gauge](/components/gauge.md).

The kit sheet hides the document's native bar. Importing the JS paints a kit thumb over the page. For a pane you own, wrap the overflowing content.

Put `<k-scrollbar class="k-scrollbar">` around the content that overflows. Give the host a height for a vertical pane, and a width for a horizontal one. The element wraps the children in a viewport, hides the native bars, and paints overlay thumbs. Drag a thumb or click the track. The pane still takes wheel, touch, and keys.

Leave `target` off for a pane you own. `target="viewport"` paints over the page. A selector paints over someone else's scroller, which is how this docs site hides Starlight's bar. Changing `target` rebuilds. Changing `axis`, `autohide`, or `size` does not.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-scrollbar` | component | The one class you write. The element generates the viewport and thumbs inside it. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-scrollbar__viewport` | part | The scrolling pane. Native bars are hidden. |
| `k-scrollbar__track` | part | One overlay rail. Combined with `--y` or `--x`. |
| `k-scrollbar__thumb` | part | The draggable thumb. Combined with `--y` or `--x`. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `axis` | `"x"`, `"y"`, or `"both"` | `both` | Which thumbs to paint. Unused rails hide when that axis does not overflow. |
| `target` | `"viewport"` or a selector | — | Paint over another scroller instead of wrapping the host. `viewport` is the page. |
| `autohide` | boolean | — | Hide the rails until hover, focus, or scroll. |
| `size` | `"sm"` or `"lg"` | — | Thinner or thicker rails. Skip it for 0.5rem. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `axis` | `KScrollbarAxis` | Read/write. `x`, `y`, or `both`. |
| `target` | `string` | Read/write. `viewport`, a selector, or empty for wrap mode. |
| `autohide` | `boolean` | Read/write. Reflects the `autohide` attribute. |
| `size` | `KScrollbarSize \| undefined` | Read/write. `sm` or `lg`. Undefined is the default thickness. |
| `hasOverflowY` | `boolean` | Read-only. True when the pane is taller than its host. |
| `hasOverflowX` | `boolean` | Read-only. True when the pane is wider than its host. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `goTo(top?, left?)` | `void` | Moves the pane and fires `k-change`. |
| `getScroll()` | `KScrollbarMetrics` | The live `scrollTop` and `scrollLeft`. Both are 0 while disconnected. |
| `getViewport()` | `HTMLElement \| null` | The scrolling node. In wrap mode that is the generated viewport. With a target, it is that element. Null while disconnected. |
| `getThumbY()` | `HTMLElement \| null` | The vertical thumb, or null while disconnected. |
| `getThumbX()` | `HTMLElement \| null` | The horizontal thumb, or null while disconnected. |
| `refresh()` | `void` | Rebuilds from the current attributes. |
| `disconnect()` | `void` | Removes listeners. |

`attachScrollbar(target)` mounts one of these over the page (`"viewport"`) or over an existing element, and reuses one already attached to that node.

Scroll changes dispatch `k-change` with `{ scrollTop, scrollLeft }`, and the event bubbles. Setting `axis`, `autohide`, or `size` does not fire it.

## Examples

### Overflow pane

A 12rem host with more lines than fit. The native bar is gone. The kit thumb sits on the right.

```html
<k-scrollbar id="docs-scrollbar" class="k-scrollbar" axis="y" style="height: 12rem">
  <ul>
    <li>Overview</li>
    <li>Install the kit</li>
    <li>Put a class on a button</li>
    <li>Import the JS once</li>
    <li>Tabs write their own panels</li>
    <li>Pagination windows a long list</li>
    <li>Dropdown builds the menu</li>
    <li>Carousel keeps a track</li>
    <li>Gauge paints a square reading</li>
    <li>This pane is taller than its host</li>
    <li>Wheel, drag the thumb, or click the track</li>
    <li>Native bars stay hidden</li>
  </ul>
</k-scrollbar>
```

### Autohide

Rails stay out of the way until you hover or scroll.

```html
<k-scrollbar id="docs-scrollbar-autohide" class="k-scrollbar" axis="y" autohide style="height: 12rem">
  <ul>
    <li>Overview</li>
    <li>Install the kit</li>
    <li>Put a class on a button</li>
    <li>Import the JS once</li>
    <li>Tabs write their own panels</li>
    <li>Pagination windows a long list</li>
    <li>Dropdown builds the menu</li>
    <li>Carousel keeps a track</li>
    <li>Gauge paints a square reading</li>
    <li>This pane is taller than its host</li>
    <li>Wheel, drag the thumb, or click the track</li>
    <li>Native bars stay hidden</li>
  </ul>
</k-scrollbar>
```

### Horizontal

A wide strip in a short host. The native bar is gone. The kit thumb sits on the bottom.

```html
<k-scrollbar id="docs-scrollbar-x" class="k-scrollbar" axis="x" style="height: 4.5rem">
  <ul>
    <li>Overview</li>
    <li>Install the kit</li>
    <li>Put a class on a button</li>
    <li>Import the JS once</li>
    <li>Tabs write their own panels</li>
    <li>Pagination windows a long list</li>
    <li>Dropdown builds the menu</li>
    <li>Carousel keeps a track</li>
    <li>Gauge paints a square reading</li>
    <li>This pane is taller than its host</li>
    <li>Wheel, drag the thumb, or click the track</li>
    <li>Native bars stay hidden</li>
  </ul>
</k-scrollbar>
```

## Accessibility

The viewport is in the tab order in wrap mode, so keys still scroll it. Each thumb has `role="scrollbar"`, `aria-orientation`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`. `aria-controls` points at the viewport when that node has an id. Give the host an `id` when more than one scrollbar is on the page. Generated ids derive from it.

Reduced motion drops the autohide fade. The thumbs still work.

## Dos and don'ts

**Do**
- Give a wrapping host a height for `axis="y"`, and a width for `axis="x"`. Otherwise the pane grows and never overflows.
- Use `target="viewport"` for the page, and `attachScrollbar` for a scroller you don't own.
- Listen for `k-change` when the scroll position matters to the rest of the UI.

**Don't**
- Restyle native `::-webkit-scrollbar` on the same pane. The kit hides those.
- Use a scrollbar to show task progress.
- Leave `target` pointing at a node that isn't there. The element throws.
