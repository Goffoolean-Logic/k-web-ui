# Sidebar

**CSS component.** Class-only. No kit JavaScript.

Checkbox-hack drawer with styled nav. No JS.

A sidebar is a drawer for navigation or filters. The open state is a checkbox, so there's no kit JavaScript. Use it when the panel should overlay the main column instead of sitting in the document flow.

The wrapper is `.k-sidebar`. Order matters: hidden checkbox, then the dimmed-page label (the scrim), then the panel, then main. Labels with `for` matching the checkbox id toggle it. One in main opens the drawer. One in the panel closes it. Clicking the dimmed page closes it too.

Inside the panel, use the nav parts for a real menu: brand, eyebrow, list, group headings, and links. Mark the active page with `aria-current="page"`. `--docked` keeps the panel in the document flow from 50em up. `--end` docks the panel on the inline end. Reduced motion drops the slide.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-sidebar` | component | The wrapper. Child order matters. |
| `k-sidebar__toggle` | part | Hidden checkbox holding the open state. Comes first. |
| `k-sidebar__scrim` | part | Label over the dimmed page. Clicking it closes the drawer. |
| `k-sidebar__panel` | part | The drawer that slides over the main column. |
| `k-sidebar__trigger` | part | Label that toggles the checkbox. One to open, one to close. |
| `k-sidebar__trigger--open` | modifier | Open control. Hidden when `--docked` is in the wide layout. |
| `k-sidebar__trigger--close` | modifier | Close control in the panel. Hidden when `--docked` is in the wide layout. |
| `k-sidebar__brand` | part | Top row for a mark and the close trigger. |
| `k-sidebar__brand-mark` | part | Title or logo in the brand row. |
| `k-sidebar__eyebrow` | part | Small uppercase label above the nav. |
| `k-sidebar__nav` | part | Wraps the link list. |
| `k-sidebar__list` | part | Unordered list of links or groups. |
| `k-sidebar__list--nested` | modifier | Indented list under a group. |
| `k-sidebar__group` | part | `details` wrapping a nested list. |
| `k-sidebar__heading` | part | `summary` for a collapsible group. |
| `k-sidebar__link` | part | Nav link. Use `aria-current="page"` for the active item. |
| `k-sidebar__footer` | part | Optional strip under the nav. |
| `k-sidebar__main` | part | The page content the drawer covers. |
| `k-sidebar--end` | modifier | Docks the panel on the inline end. |
| `k-sidebar--docked` | modifier | Keeps the panel in flow from 50em up. Drawer below that. |

## Examples

### From the start edge

Default dock. Open Menu, then Close or the scrim.

```html
<div class="k-sidebar">
  <input id="nav" type="checkbox" class="k-sidebar__toggle" />
  <label for="nav" class="k-sidebar__scrim"></label>
  <aside class="k-sidebar__panel">
    <div class="k-sidebar__brand">
      <span class="k-sidebar__brand-mark">Workspace</span>
      <label for="nav" class="k-sidebar__trigger k-sidebar__trigger--close">Close</label>
    </div>
    <p class="k-sidebar__eyebrow">Browse</p>
    <nav class="k-sidebar__nav" aria-label="Sidebar">
      <ul class="k-sidebar__list">
        <li><a class="k-sidebar__link" href="#overview" aria-current="page">Overview</a></li>
        <li>
          <details class="k-sidebar__group" open>
            <summary class="k-sidebar__heading">
              <span>Library</span>
              <span class="k-icon k-icon--chevron-down k-icon--sm" aria-hidden="true"></span>
            </summary>
            <ul class="k-sidebar__list k-sidebar__list--nested">
              <li><a class="k-sidebar__link" href="#projects">Projects</a></li>
              <li><a class="k-sidebar__link" href="#settings">Settings</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </nav>
  </aside>
  <div class="k-sidebar__main">
    <label for="nav" class="k-sidebar__trigger k-sidebar__trigger--open">Menu</label>
  </div>
</div>
```

## Accessibility

The checkbox is the state. Hide it with `.k-sidebar__toggle`. Don't `display: none` it or the labels stop working. Triggers are `<label for="…">` so a click or the associated input both work. Put a visible Close in the panel. The scrim is the same toggle. Give the panel a heading or labelled links so the drawer has a name. Mark the current page with `aria-current="page"`.

## Dos and don'ts

**Do**
- Keep the order: checkbox, scrim, panel, main.
- Match every `for` to the checkbox `id`.
- Put a visible Close in the panel.
- Use `.k-sidebar__link` and groups for navigation chrome.

**Don't**
- Hide the checkbox with `display: none`. The labels stop working.
- Use a plain drawer for content that should stay in the document flow — use `--docked` when the rail should stay open on large screens.
