# Dropdown

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-dropdown. Trigger, menu, and keyboard from options.

A dropdown is a short list of choices attached to a trigger: sort order, a row menu. It's not a form `<select>`. Use the native control when you need a form value.

Give the host an `id` and hand it a trigger and its items:

```html
<k-dropdown id="sort" class="k-dropdown"></k-dropdown>
```

```js
document.getElementById('sort').options = {
  trigger: 'Sort',
  items: [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }],
  select: true,
};
```

The element builds the trigger, the menu, the items, and the ARIA. There is no linked content here, since a menu is a list of labels rather than markup you wrote. An item with an `href` becomes an anchor instead of a button. Pass `select: true` when the pick should replace the trigger text, which is the usual case for a sort menu. Leave it off for a row of actions.

The trigger is a secondary button. The open menu sits below it, outside any overflow on a parent. It toggles open, closes on an outside click or Escape, and moves through items with the keyboard. Setting `options` rebuilds the menu, except when only `trigger` changed, which relabels the button in place.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-dropdown` | component | The one class you write. The element generates the trigger, menu, and items inside it. |
| `k-dropdown--end` | modifier | Aligns the menu to the inline end of the host, for a trigger sitting on the right. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-dropdown__trigger` | part | The button that opens the menu. Also carries `k-btn k-btn--secondary` and a chevron-down icon. |
| `k-dropdown__menu` | part | The list of items. Hidden until open. |
| `k-dropdown__item` | part | One choice. A button, or an anchor when the item has an `href`. |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | string | — | Visible text on the generated button. Required. |
| `items` | `KDropdownItem[]` | — | One entry per choice, in menu order. |
| `items[].label` | string | — | Item text. Required. |
| `items[].href` | string | — | Makes the item an anchor. It still fires `k-change` before it navigates. |
| `select` | boolean | — | Writes the picked item onto the trigger. For sort menus and the like. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `options` | `KDropdownOptions \| null` | Read/write. Writing rebuilds the menu, or relabels the trigger when that is the only change. |
| `count` | number | Read-only. Number of items. |
| `labels` | `string[]` | Read-only. Item labels in order. |
| `open` | boolean | Read-only. True while the menu is showing. |
| `trigger` | `HTMLElement \| null` | Read-only. The generated trigger. |
| `menu` | `HTMLElement \| null` | Read-only. The generated menu. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `toggle(open)` | void | Opens or closes the menu. Omit the argument to flip the current state. |
| `openMenu()` | void | Opens the menu. |
| `closeMenu()` | void | Closes the menu. |
| `getItems()` | `HTMLElement[]` | Copy of the item nodes. |
| `getItem(index)` | `HTMLElement \| null` | The item at an index. |
| `focusItem(index)` | boolean | Opens the menu if needed and focuses an item. Returns false on a miss. |
| `select(index)` | void | Picks an item the way a click does: closes the menu and fires `k-change`. |
| `selectByLabel(label)` | boolean | Picks the first item whose label matches. Returns false on a miss. |
| `addOption(item, at)` | void | Inserts an item, appending when `at` is left out. |
| `removeOption(index)` | void | Drops an item. |
| `updateOption(index, patch)` | void | Merges a partial item into the one at that index. |
| `refresh()` | void | Rebuilds the trigger and menu from the current options. |
| `disconnect()` | void | Removes listeners, including the document-level outside-click handler. |

Picking an item dispatches `k-change` with `{ index, label, href }`, and the event bubbles. `href` is `null` for an item without one. The event fires on a click, on a keyboard activation, and on `select()`, so a single listener covers every path.

## Examples

### Sort menu

Open it, then pick an item or click away.

```html
<k-dropdown id="sort" class="k-dropdown"></k-dropdown>
```

```ts
import 'k-web-ui/js';

document.getElementById('sort').options = {
  trigger: 'Sort',
  items: [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }],
  select: true,
};
```

### Aligned to the end

`k-dropdown--end` pins the menu to the inline end.

```html
<k-dropdown id="sort-end" class="k-dropdown k-dropdown--end"></k-dropdown>
```

```ts
import 'k-web-ui/js';

document.getElementById('sort-end').options = {
  trigger: 'Sort',
  items: [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }],
  select: true,
};
```

## Accessibility

The element sets `aria-haspopup="menu"` and `aria-expanded` on the trigger, `role="menu"` on the menu, and `role="menuitem"` on items. The menu id comes from the host id, so the trigger gets `aria-controls`. Arrow keys open and move. Home and End jump. Escape closes and returns focus to the trigger.

## Dos and don'ts

**Do**
- Give the host a unique `id`. The generated ids derive from it.
- Set `options` with a `trigger` and its `items`.
- Listen for `k-change` to react to a pick.

**Don't**
- Hand-write the trigger and menu. The element builds them.
- Use this as a form `<select>`.
- Open a [modal](/components/modal/) for three actions.
