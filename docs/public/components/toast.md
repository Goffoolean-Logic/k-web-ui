# Toast

**CSS component.** No JavaScript needed.

div.k-toast wrapping banners. CSS only.

A toast is a stack of [banners](/components/banner/) pinned to a corner of the page. Use it for short outcomes that shouldn't push the rest of the layout: saved, sent, failed. It doesn't auto-dismiss. You add and remove the banners yourself.

Wrap the banners in `<div class="k-toast">`. The default position is the bottom-right corner. Combine a block modifier (`--top` or `--bottom`) with an inline one (`--start`, `--center`, `--end`) to move it. The stack is `position: fixed`. Children take pointer events. The wrapper does not.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-toast` | component | Fixed stack wrapping the banners. Bottom-right by default. |
| `k-toast--top` | modifier | Pins the stack to the top edge. |
| `k-toast--bottom` | modifier | Pins the stack to the bottom edge. |
| `k-toast--start` | modifier | Pins the stack to the inline start. |
| `k-toast--center` | modifier | Centers the stack on the inline axis. |
| `k-toast--end` | modifier | Pins the stack to the inline end. |

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

Each child should be a banner with `role="alert"` so new toasts are announced. The wrapper isn't a live region of its own. There's no auto-dismiss, so the reader can actually reach the message. Don't yank it before they can. Keep the copy short.

## Dos and don'ts

**Do**
- Put [banners](/components/banner/) inside, each with `role="alert"`.
- Pin the stack with a block and an inline modifier when the default corner is wrong.
- Add and remove the banners yourself.

**Don't**
- Wait for a timeout. There isn't one.
- Put a toast in the page flow. Use a [banner](/components/banner/) there.
- Put `role="alert"` on the wrapper.
