# Dropdown

KDropdown.mount on a .k-dropdown element.

A dropdown is a short list of choices attached to a trigger, such as sort order or a row menu. It is not a form `<select>`. Use the native control when you need a form value.

You write the markup: a `.k-dropdown` wrapper, a trigger button, and a hidden `.k-dropdown__menu` of `.k-dropdown__item` buttons or links. `KDropdown.mount` toggles open, closes on outside click, and moves through items with the keyboard. Escape closes. `--end` aligns the menu to the inline end.

The trigger should already look like a button. The kit adds `aria-haspopup` and `aria-expanded`.

## Classes

| Class | Type |
| --- | --- |
| `k-dropdown` | component |
| `k-dropdown__trigger` | part |
| `k-dropdown__menu` | part |
| `k-dropdown__item` | part |
| `k-dropdown--end` | modifier |

## Examples

### Sort menu

A secondary button as the trigger. Open it, then pick an item or click away.

```html
<div id="docs-dropdown" class="k-dropdown">
  <button type="button" class="k-btn k-btn--secondary k-dropdown__trigger">Sort</button>
  <div id="docs-dropdown-menu" class="k-dropdown__menu" hidden>
    <button type="button" class="k-dropdown__item">Name</button>
    <button type="button" class="k-dropdown__item">Date</button>
    <button type="button" class="k-dropdown__item">Size</button>
  </div>
</div>
```

```js
import { KDropdown } from 'k-web-components/js';

KDropdown.mount('docs-dropdown');
```

## Accessibility

`KDropdown.mount` sets `aria-haspopup="menu"` and `aria-expanded` on the trigger, `role="menu"` on the menu, and `role="menuitem"` on items. Give the menu an `id` so the trigger gets `aria-controls`. Arrow keys open and move. Home / End jump. Escape closes and returns focus to the trigger. The trigger has to be a real button.

## Dos and don'ts

**Do**
- Write the wrapper, trigger, and menu yourself, then `mount`.
- Use a real button as the trigger.
- Give the menu an `id` so the trigger gets `aria-controls`.

**Don't**
- Use this as a form `<select>`.
- Open a [modal](/components/modal/) for three actions.
- Leave the trigger as a `div`.
