# Pagination

KPagination.mount. Page window and first/last jumps.

Pagination walks a numbered list of pages. Use it under a table or a result set when you already know the page count. Put an id and `.k-pagination` on an empty element. `KPagination.mount` builds the buttons.

Five or fewer pages list every number and drop first/last. More than five keep first and last and a sliding three-page window. The window clamps at the ends: page 1 shows 1 2 3, the last page shows n-2 n-1 n. The current page (`aria-current="page"`) does not pick up the hover fill.

Arrow keys step. Home and End jump to the ends even when first/last are omitted. Pass `count`, optional `page`, and optional `onChange`.

## Classes

| Class | Type |
| --- | --- |
| `k-pagination` | component |
| `k-pagination__btn` | part |
| `k-pagination__current` | part |

## Examples

### Long list

Twelve pages, starting on 5. First and last stay; the window is 4 5 6.

```html
<div id="docs-pagination" class="k-pagination"></div>
```

```js
import { KPagination } from 'k-web-ui/js';

KPagination.mount('docs-pagination', { count: 12, page: 5 });
```

### Few pages

Four pages. Every number is listed. First and last are omitted; Home and End still jump.

```html
<div id="docs-pagination-few" class="k-pagination"></div>
```

```js
KPagination.mount('docs-pagination-few', { count: 4, page: 1 });
```

## Accessibility

`mount` sets `aria-label="Pagination"` on the element. Each control is a `<button>` with an `aria-label` (`Page 5 of 12`, First, Previous, and so on). The current page is `aria-current="page"`. Arrow keys step. Home and End jump. First/last may be omitted from the DOM on short lists. The keys still work. Disabled ends use the `disabled` attribute.

## Dos and don'ts

**Do**
- Mount on an empty element with an id and `.k-pagination`.
- Pass `count` and handle `onChange`.
- Pair it with a [table](/components/table/) or a result list.

**Don't**
- Hand-write the page buttons. `mount` builds them.
- Paginate a list that already fits on one screen.
- Style the current page as a hover fill. The kit already marks it.
