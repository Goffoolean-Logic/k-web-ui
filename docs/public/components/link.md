# Link

a.k-link.

A link goes somewhere: another page, a hash, or an external URL. If the click stays on this page, use a [button](/components/button/).

The element is an `<a>` with `.k-link`. It is orange and underlined. Hover darkens it. Keep the underline. Color alone is not enough to mark a link.

There is no disabled class. `aria-disabled="true"` when the destination is gone; the kit kills pointer events and the underline.

## Classes

| Class | Type |
| --- | --- |
| `k-link` | component |

## Examples

### Default

A text link. The `href` is yours.

```html
<a class="k-link" href="#">Read the guide</a>
```

## Accessibility

Use a real `<a>` with an `href`. Color is not the only cue; the underline stays. `aria-disabled="true"` removes pointer events and the underline. Take it out of the tab order too, or explain nearby why it is still sitting there.

## Dos and don'ts

**Do**
- Use a real `<a>` with an `href`.
- Keep the underline.
- Use a [button](/components/button/) for an action on this page.

**Don't**
- Style a `span` or `div` as a link.
- Drop the underline.
- Use a link as a button.
