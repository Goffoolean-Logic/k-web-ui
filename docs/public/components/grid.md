# Grid

**CSS component.** No JavaScript needed.

div.k-grid or ul.k-grid. CSS only.

A grid is a row of repeating tiles, such as an icon set, a swatch list, or a gallery. Rows of the same columns belong in a [table](/components/table/).

Use `<div class="k-grid">` or `<ul class="k-grid">`. Default columns auto-fill from `8rem`. Pin a count with `--2`, `--3`, `--4`, or `--6`. `--tight` shortens the gap.

Children can be anything. `k-grid__cell` is an optional tile: raised surface, border, centered stack. A `code` caption in the cell picks up muted type.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-grid` | component | The tile container. Columns auto-fill from 8rem by default. |
| `k-grid__cell` | part | One tile. Centers its contents. |
| `k-grid--2` | modifier | Pins the grid to two columns. |
| `k-grid--3` | modifier | Pins the grid to three columns. |
| `k-grid--4` | modifier | Pins the grid to four columns. |
| `k-grid--6` | modifier | Pins the grid to six columns. |
| `k-grid--tight` | modifier | Shortens the gap between tiles. |

## Examples

### Auto-fill catalog

The default. Columns wrap as the page widens. A list, because the cells are a set.

```html
<ul class="k-grid">
  <li class="k-grid__cell">
    <span class="k-icon k-icon--info k-icon--sm" aria-hidden="true"></span>
    <code>info</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--success k-icon--sm" aria-hidden="true"></span>
    <code>success</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--warning k-icon--sm" aria-hidden="true"></span>
    <code>warning</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--danger k-icon--sm" aria-hidden="true"></span>
    <code>danger</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--close k-icon--sm" aria-hidden="true"></span>
    <code>close</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--loading k-icon--sm" aria-hidden="true"></span>
    <code>loading</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--chevron-left k-icon--sm" aria-hidden="true"></span>
    <code>chevron-left</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--chevron-right k-icon--sm" aria-hidden="true"></span>
    <code>chevron-right</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--chevron-down k-icon--sm" aria-hidden="true"></span>
    <code>chevron-down</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--chevron-first k-icon--sm" aria-hidden="true"></span>
    <code>chevron-first</code>
  </li>
  <li class="k-grid__cell">
    <span class="k-icon k-icon--chevron-last k-icon--sm" aria-hidden="true"></span>
    <code>chevron-last</code>
  </li>
</ul>
```

### Fixed columns

`--3` pins three columns. Cards sit in the grid without a cell wrapper.

```html
<div class="k-grid k-grid--3">
  <div class="k-card">
    <div class="k-card__body">
      <p>Deploy</p>
    </div>
  </div>
  <div class="k-card">
    <div class="k-card__body">
      <p>Checks</p>
    </div>
  </div>
  <div class="k-card">
    <div class="k-card__body">
      <p>Preview</p>
    </div>
  </div>
  <div class="k-card">
    <div class="k-card__body">
      <p>Build</p>
    </div>
  </div>
  <div class="k-card">
    <div class="k-card__body">
      <p>Review</p>
    </div>
  </div>
  <div class="k-card">
    <div class="k-card__body">
      <p>Ship</p>
    </div>
  </div>
</div>
```

## Accessibility

This is layout, not an ARIA grid. Leave `role="grid"` off. Use a `<ul>` when the tiles are a set. Decorative marks stay `aria-hidden`. The name lives in text in the cell.

## Dos and don'ts

**Do**
- Use auto-fill for catalogs. Pin a count only when the row has to stay even.
- Use a `<ul>` when the cells are a set.
- Put the name in text. Icons stay `aria-hidden`.

**Don't**
- Put tabular data here. Use a [table](/components/table/).
- Put `role="grid"` on it.
- Expect a widget. This is a CSS grid.
