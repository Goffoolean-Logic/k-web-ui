# Toast

div.k-toast wrapping banners. CSS only.

A toast is a stack of [banners](/components/banner/) pinned to a corner of the page. Use it for short outcomes that should not push the rest of the layout: saved, sent, failed. It does not auto-dismiss. You add and remove the banners yourself.

Wrap the banners in `<div class="k-toast">`. The default position is the bottom-right corner. Combine a block modifier (`--top` or `--bottom`) with an inline one (`--start`, `--center`, `--end`) to move it. The stack is `position: fixed`. Children take pointer events. The wrapper does not.

## Classes

| Class | Type |
| --- | --- |
| `k-toast` | component |
| `k-toast--top` | modifier |
| `k-toast--bottom` | modifier |
| `k-toast--start` | modifier |
| `k-toast--center` | modifier |
| `k-toast--end` | modifier |

## Examples

### Default pin

Bottom-end, the default. Two banners would stack upward from this corner.

```html
<div class="k-toast">
  <div role="alert" class="k-banner k-banner--success k-banner--soft">
    <span>Changes saved.</span>
  </div>
</div>
```

## Accessibility

Each child should be a banner with `role="alert"` so new toasts are announced. The wrapper is not a live region of its own. Because there is no auto-dismiss, the reader can actually reach the message. Do not yank it before they can. Keep the copy short.

## Dos and don'ts

**Do**
- Put [banners](/components/banner/) inside, each with `role="alert"`.
- Pin the stack with a block and an inline modifier when the default corner is wrong.
- Add and remove the banners yourself.

**Don't**
- Wait for a timeout. There is not one.
- Put a toast in the page flow. Use a [banner](/components/banner/) there.
- Put `role="alert"` on the wrapper.
