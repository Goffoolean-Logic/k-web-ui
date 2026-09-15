# Accordion

details.k-accordion__item. CSS only.

An accordion is a list of sections the reader can open, such as an FAQ or a settings group. Each item is a `<details>` element. The browser owns open state, so there is nothing to `mount`.

Wrap them in `<div class="k-accordion">`. Each item is `<details class="k-accordion__item">`. The summary is `.k-accordion__trigger`. The open content is `.k-accordion__panel`. Put the same `name` on every details in the group if opening one should close the others. Leave `name` off if several can stay open. `open` on a details starts that one expanded.

The chevron is a CSS `::after` on the trigger. It flips when the item is open. The panel height eases open. Reduced motion drops the motion.

## Classes

| Class | Type |
| --- | --- |
| `k-accordion` | component |
| `k-accordion__item` | part |
| `k-accordion__trigger` | part |
| `k-accordion__panel` | part |

## Examples

### Exclusive group

Same `name` on both items. Opening the second closes the first. The first starts open.

```html
<div class="k-accordion">
  <details class="k-accordion__item" name="docs-acc" open>
    <summary class="k-accordion__trigger">What is the kit?</summary>
    <div class="k-accordion__panel">CSS chrome plus a small JS behavior layer.</div>
  </details>
  <details class="k-accordion__item" name="docs-acc">
    <summary class="k-accordion__trigger">Does it need a framework?</summary>
    <div class="k-accordion__panel">No. Write HTML.</div>
  </details>
</div>
```

## Accessibility

Each item is a native `<details>` / `<summary>`. The browser exposes open state and keyboard (Enter / Space on the summary). Do not replace the summary with a `div`. The chevron is CSS on the trigger, so it is not in the accessibility tree. Give each trigger a clear name. The panel is whatever comes after.

## Dos and don'ts

**Do**
- Use `<details>` and `<summary>`. The browser already did this job.
- Share one `name` when only one item should be open.
- Put the answer in `.k-accordion__panel`.

**Don't**
- Import JS for this. There is nothing to mount.
- Replace the summary with a styled `div`.
- Hide something the reader has to see inside a closed item.
