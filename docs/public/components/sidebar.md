# Sidebar

**CSS component.** No JavaScript needed.

Checkbox-hack drawer. No JS.

A sidebar is a drawer for navigation or filters. The open state is a checkbox, so there is no kit JavaScript. Use it when the panel should overlay the main column instead of sitting in the document flow.

The wrapper is `.k-sidebar`. Order matters: hidden checkbox, then the dimmed-page label (the scrim), then the panel, then main. Labels with `for` matching the checkbox id toggle it. One in main opens the drawer. One in the panel closes it. Clicking the dimmed page closes it too.

`--end` docks the panel on the inline end. Reduced motion drops the slide.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-sidebar` | component | The wrapper. Child order matters. |
| `k-sidebar__toggle` | part | Hidden checkbox holding the open state. Comes first. |
| `k-sidebar__scrim` | part | Label over the dimmed page. Clicking it closes the drawer. |
| `k-sidebar__panel` | part | The drawer that slides over the main column. |
| `k-sidebar__trigger` | part | Label that toggles the checkbox. One to open, one to close. |
| `k-sidebar__main` | part | The page content the drawer covers. |
| `k-sidebar--end` | modifier | Docks the panel on the inline end. |

## Examples

### From the start edge

Default dock. Open Menu, then Close or the scrim.

```html
<div class="k-sidebar">
  <input id="docs-nav" type="checkbox" class="k-sidebar__toggle" />
  <label for="docs-nav" class="k-sidebar__scrim"></label>
  <aside class="k-sidebar__panel">
    <label for="docs-nav" class="k-sidebar__trigger">Close</label>
    <a class="k-link" href="#overview">Overview</a>
    <a class="k-link" href="#projects">Projects</a>
  </aside>
  <div class="k-sidebar__main">
    <label for="docs-nav" class="k-sidebar__trigger">Menu</label>
  </div>
</div>
```

## Accessibility

The checkbox is the state. Hide it with `.k-sidebar__toggle`. Do not `display: none` it or the labels stop working. Triggers are `<label for="…">` so a click or the associated input both work. Put a visible Close in the panel. The scrim is the same toggle. Give the panel a heading or labelled links so the drawer has a name.

## Dos and don'ts

**Do**
- Keep the order: checkbox, scrim, panel, main.
- Match every `for` to the checkbox `id`.
- Put a visible Close in the panel.

**Don't**
- Hide the checkbox with `display: none`. The labels stop working.
- Use a sidebar for content that should stay in the document flow.
