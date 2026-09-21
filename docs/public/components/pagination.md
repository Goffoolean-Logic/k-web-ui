# Pagination

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-pagination. Page window and first/last jumps, counted from your pages.

Pagination walks a numbered list of pages. Use it under a table or a result set. Give the host an `id`, number your pages from zero, and that's the whole setup:

```html
<div id="story-0">The first page.</div>
<div id="story-1">The second page.</div>
<k-pagination id="story" class="k-pagination"></k-pagination>
```

```js
import 'k-web-ui/js';
```

There are no options. The element counts the `#story-0`, `#story-1`, … nodes it finds and builds that many pages, showing the first one and hiding the rest. Add a page to the HTML and the count follows.

The host is a row of buttons, so it sits wherever you put it in the tree. Below the pages and centered is the usual spot, and that's CSS, not a setting. `getElementById` doesn't care about order, so the host can come before or after the pages it drives.

Five or fewer pages list every number and drop first/last. More than five keep first and last and a sliding three-page window. The window clamps at the ends: page 1 shows 1 2 3, the last page shows n-2 n-1 n. The current page (`aria-current="page"`) doesn't pick up the hover fill. Arrow keys step. Home and End jump to the ends even when first/last are omitted.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-pagination` | component | The one class you write. The element generates every control inside it. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-pagination__btn` | part | Shared chrome on every control. |
| `k-pagination__page` | part | A numbered page button. |
| `k-pagination__current` | part | The current page. Set with `aria-current="page"`. |
| `k-pagination__prev` | part | Previous page. |
| `k-pagination__next` | part | Next page. |
| `k-pagination__first` | part | Jump to page 1. Omitted when the count is five or fewer. |
| `k-pagination__last` | part | Jump to the last page. Omitted the same way. |
| `k-pagination__page-panel` | part | Put on each linked page. Hidden ones carry `hidden` and `inert`. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `count` | number | Read-only. Pages the element found. |
| `page` | number | Read-only. Current page, one-based. |
| `hasPrevious` | boolean | Read-only. False on page 1. |
| `hasNext` | boolean | Read-only. False on the last page. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `select(index)` | void | Opens a page by zero-based index, matching the id you wrote and the event detail. |
| `goTo(page)` | void | Same move, one-based, to match the number on the button. |
| `next()` | void | Advances one page, stopping at the count. |
| `previous()` | void | Goes back one page, stopping at the first. |
| `first()` | void | Jumps to page 1. |
| `last()` | void | Jumps to the last page. |
| `getVisiblePages()` | `number[]` | The page numbers the bar is currently showing. |
| `getButtons()` | `HTMLButtonElement[]` | Every rendered button, controls and page numbers alike. |
| `refresh()` | void | Recounts the pages and re-renders the bar. |
| `disconnect()` | void | Removes listeners. |

Moving dispatches `k-change` with `{ index }`, zero-based like the ids, and the event bubbles. Both `select()` and `goTo()` fire it, so one listener covers clicks, keys, and your own calls.

## Examples

### Long list

Twelve pages. First and last stay, and the window slides as you move.

```html
<div id="story-0">Page 1 of 12</div>
<div id="story-1">Page 2 of 12</div>
<div id="story-2">Page 3 of 12</div>
<k-pagination id="story" class="k-pagination"></k-pagination>
```

### Few pages

Four pages. Every number is listed. First and last are omitted; Home and End still jump.

```html
<div id="notes-0">Page 1 of 4</div>
<div id="notes-1">Page 2 of 4</div>
<div id="notes-2">Page 3 of 4</div>
<div id="notes-3">Page 4 of 4</div>
<k-pagination id="notes" class="k-pagination"></k-pagination>
```

## Accessibility

The element sets `aria-label="Pagination"`. Each control is a `<button>` with an `aria-label` (`Page 5 of 12`, First, Previous, and so on). The current page is `aria-current="page"`. Pages that aren't showing get `hidden` and `inert`, so nothing inside them takes focus. Arrow keys step, Home and End jump, and those keys work even when first/last are left out of the DOM. Disabled ends use the `disabled` attribute.

## Dos and don'ts

**Do**
- Give the host a unique `id` and number the pages from `-0`.
- Listen for `k-change` when the page matters to the rest of the UI.
- Pair it with a [table](/components/table/) or a result list.

**Don't**
- Hand-write the page buttons. The element builds them.
- Skip a number. The element stops counting at the first gap.
- Paginate a list that already fits on one screen.
- Style the current page as a hover fill. The kit already marks it.
