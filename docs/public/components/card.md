# Card

**CSS component.** No JavaScript needed.

div.k-card with optional header, body, footer.

A card is a box around one unit of content: a deployment, a setting, a summary. It's a layout shell, not an interactive widget. Put buttons and links inside it. Don't hang a click handler on the box itself.

The element is `<div class="k-card">`. Header, body, and footer are optional. Title and subtitle go in the header. Copy goes in the body. The footer is a row of actions, aligned to the end. A card with only a body is fine.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-card` | component | The box. A layout shell, not a control. |
| `k-card__header` | part | Holds the title and subtitle. Optional. |
| `k-card__title` | part | Name of the thing. Any element; a heading is fine when the outline needs one. |
| `k-card__subtitle` | part | Secondary line under the title. |
| `k-card__body` | part | The copy. A card with only a body is fine. |
| `k-card__footer` | part | Row of actions, aligned to the end. |

## Examples

### Header, body, and footer

The full stack: identity in the header, copy in the body, an action in the footer.

```html
<div class="k-card">
  <div class="k-card__header">
    <h3 class="k-card__title">Deployment</h3>
    <p class="k-card__subtitle">Last run 4 minutes ago</p>
  </div>
  <div class="k-card__body">
    <p>Every check passed on the latest commit.</p>
  </div>
  <div class="k-card__footer">
    <button type="button" class="k-btn k-btn--secondary k-btn--sm">Logs</button>
  </div>
</div>
```

## Accessibility

This is a grouping, not a button. Leave `onclick` off `.k-card`. Put the name in `.k-card__title` (an `h3` is fine when it fits the page outline). Actions belong in the footer as real buttons or links so they stay in the tab order and pick up the kit ring.

## Dos and don'ts

**Do**
- Skip the parts you don't need. A body-only card is valid.
- Put actions in the footer as real buttons or links.

**Don't**
- Make the whole card clickable.
- Nest cards inside cards.
- Stuff tabular data in here. Use a [table](/components/table/).
