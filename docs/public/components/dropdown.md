# Dropdown

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-dropdown. Trigger, menu, and keyboard from options.

A dropdown is a short list of choices attached to a trigger, such as sort order or a row menu. It is not a form `<select>`. Use the native control when you need a form value.

Put `<k-dropdown class="k-dropdown">` on the page with `label` and `options`. The element builds the trigger, menu, items, and ARIA. Each option is a `label`. `href` on an option makes a link instead of a button.

The trigger is a secondary button. Importing the JS registers the tag. It toggles open, closes on outside click, and moves through items with the keyboard. Escape closes.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-dropdown` | component | The one class you write. The element generates the trigger, menu, and items inside it. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-dropdown__trigger` | part | The button that opens the menu. Also carries `k-btn k-btn--secondary`. |
| `k-dropdown__menu` | part | The list of items. Hidden until open. |
| `k-dropdown__item` | part | One choice. A button, or an anchor when the option has `href`. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | JSON array | — | One object per item. `label` is required; `href` makes it a link instead of a button. |
| `label` | string | — | Visible text on the generated trigger. |
| `align` | `"end"` | — | Aligns the menu to the inline end of the host. Omit to align to the start. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `options` | `KDropdownItem[]` | Read/write, reflects to the attribute. |
| `count` | number | Read-only. Number of options. Reads the attribute, so it works before the element connects. |
| `labels` | `string[]` | Read-only. Option labels in order. |
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
| `addOption(option, at)` | void | Inserts an option, appending when `at` is left out. |
| `removeOption(index)` | void | Drops an option. |
| `updateOption(index, patch)` | void | Merges a partial option into the one at that index. |
| `refresh()` | void | Rebuilds the trigger and menu from the current options. |
| `disconnect()` | void | Removes listeners, including the document-level outside-click handler. |

Picking an item dispatches `k-change` with `{ index, label, href }`, and the event bubbles. `href` is `null` for an option without one. The event fires on a click, on a keyboard activation, and on `select()`, so a single listener covers every path. An option with an `href` still navigates as a normal link.

## Examples

### Sort menu

Open it, then pick an item or click away.

```html
<k-dropdown
  class="k-dropdown"
  label="Sort"
  options='[{"label":"Name"},{"label":"Date"},{"label":"Size"}]'
></k-dropdown>
```

### Aligned to the end

`align="end"` pins the menu to the inline end, for a trigger sitting on the right.

```html
<k-dropdown
  class="k-dropdown"
  align="end"
  label="Sort"
  options='[{"label":"Name"},{"label":"Date"},{"label":"Size"}]'
></k-dropdown>
```

## Accessibility

The element sets `aria-haspopup="menu"` and `aria-expanded` on the trigger, `role="menu"` on the menu, and `role="menuitem"` on items. The menu id comes from the host id so the trigger gets `aria-controls`. Arrow keys open and move. Home / End jump. Escape closes and returns focus to the trigger.

## Dos and don'ts

**Do**
- Use `<k-dropdown class="k-dropdown">` with `label` and `options`.
- Pass `options` with a `label`. `href` is optional.
- Listen for `k-change` to react to a pick.
- Give the host an `id` when the menu and trigger need a stable pair.

**Don't**
- Hand-write the trigger and menu. The element builds them.
- Use this as a form `<select>`.
- Open a [modal](/components/modal/) for three actions.
