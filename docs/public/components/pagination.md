# Pagination

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-pagination. Page window and first/last jumps.

Pagination walks a numbered list of pages. Use it under a table or a result set when you already know the page count. Put `<k-pagination class="k-pagination">` on the page with `count` and optional `page`. The element builds the buttons.

Five or fewer pages list every number and drop first/last. More than five keep first and last and a sliding three-page window. The window clamps at the ends: page 1 shows 1 2 3, the last page shows n-2 n-1 n. The current page (`aria-current="page"`) does not pick up the hover fill.

Arrow keys step. Home and End jump to the ends even when first/last are omitted.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-pagination` | component | The one class you write. The element generates every control inside it. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | number | — | Total pages. Required, and must be at least 1 or the element throws. |
| `page` | number | `1` | Current page, one-based. Clamped to `count` when it changes. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `goTo(page)` | void | Moves, focuses the new current page, and fires `k-change`. |
| `disconnect()` | void | Removes listeners. |

Both `count` and `page` are read/write properties. Writing `page` while the element is connected moves the window and fires the event, the same as calling `goTo`.

Page changes dispatch `k-change` with `{ page }`, and the event bubbles. Setting the `page` attribute moves the window without firing the event and without taking focus, so it is the one to use when your app owns the state.

## Examples

### Long list

Twelve pages, starting on 5. First and last stay; the window is 4 5 6.

```html
<k-pagination id="docs-pagination" class="k-pagination" count="12" page="5"></k-pagination>
```

### Few pages

Four pages. Every number is listed. First and last are omitted; Home and End still jump.

```html
<k-pagination id="docs-pagination-few" class="k-pagination" count="4" page="1"></k-pagination>
```

## Accessibility

The element sets `aria-label="Pagination"`. Each control is a `<button>` with an `aria-label` (`Page 5 of 12`, First, Previous, and so on). The current page is `aria-current="page"`. Arrow keys step. Home and End jump. First/last may be omitted from the DOM on short lists. The keys still work. Disabled ends use the `disabled` attribute.

## Dos and don'ts

**Do**
- Use `<k-pagination class="k-pagination">` with `count`.
- Listen for `k-change` when the page matters to the rest of the UI.
- Pair it with a [table](/components/table/) or a result list.

**Don't**
- Hand-write the page buttons. The element builds them.
- Paginate a list that already fits on one screen.
- Style the current page as a hover fill. The kit already marks it.
