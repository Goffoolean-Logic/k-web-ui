# Table

**CSS component.** No JavaScript needed.

table.k-table.

A table is for tabular data: rows that share the same columns. If the content isn't a grid of columns, use a card or a definition list. Use a real `<table class="k-table">` with `thead` and `tbody`. The kit styles the cells. It doesn't sort, filter, or paginate. Pair it with [pagination](/components/pagination/) when the list is long.

`--zebra` stripes even body rows. `--sm` tightens padding and type. They combine.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-table` | component | Goes on a real `table` with `thead` and `tbody`. Styles cells only. No sorting or filtering. |
| `k-table--zebra` | modifier | Stripes even body rows. |
| `k-table--sm` | modifier | Tightens padding and type. Combines with zebra. |

## Examples

### Default

A two-column table. Header cells are `th`, body cells are `td`.

```html
<table class="k-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Deploy</td>
      <td>Ready</td>
    </tr>
    <tr>
      <td>Checks</td>
      <td>Passed</td>
    </tr>
  </tbody>
</table>
```

### Zebra and compact

`--zebra` and `--sm` together. Use zebra when rows are dense enough that the eye needs a track.

```html
<table class="k-table k-table--zebra k-table--sm">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Deploy</td>
      <td>Ready</td>
    </tr>
    <tr>
      <td>Checks</td>
      <td>Passed</td>
    </tr>
    <tr>
      <td>Preview</td>
      <td>Queued</td>
    </tr>
  </tbody>
</table>
```

## Accessibility

Use a real `<table>` with `th` in the header and `td` in the body. The kit doesn't add `scope` or a caption. Add a `<caption>` or `aria-label` when the heading above isn't enough. Zebra is visual only. Don't rely on stripe color to mark a row.

## Dos and don'ts

**Do**
- Use a real `<table>` with `th` and `td`.
- Pair a long list with [pagination](/components/pagination/).
- Add a caption or `aria-label` when the heading above is not enough.

**Don't**
- Build this from stacked [cards](/components/card/). A catalog of tiles is a [grid](/components/grid/).
- Rely on zebra stripes to mark a row.
- Expect the kit to sort or filter. It only styles cells.
