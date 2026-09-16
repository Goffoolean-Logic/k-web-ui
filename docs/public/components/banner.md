# Banner

**CSS component.** No JavaScript needed.

div.k-banner with role="alert".

A banner is an inline alert for something that just happened: a failed save, a confirmed purchase, an update in the page flow. Put `role="alert"` on the element. If the message should float over the page instead, wrap banners in a [toast](/components/toast/).

Start with `<div class="k-banner">`. A variant paints the fill. Soft, outline, or dash lightens that fill. Layout modifiers flip the grid: `--vertical` stacks, `--horizontal` is a row, `--sm-horizontal` becomes a row from the `sm` breakpoint up.

Children are optional. An icon, a plain span, or the body parts (`k-banner__title`, `k-banner__description`, `k-banner__actions`) all sit in the same grid.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-banner` | component | The alert box. Add `role="alert"` yourself. |
| `k-banner__body` | part | Groups the title, description, and actions in the grid. |
| `k-banner__title` | part | Short headline for the message. |
| `k-banner__description` | part | Supporting copy under the title. |
| `k-banner__actions` | part | Trailing buttons or links. |
| `k-banner--info` | variant | Neutral notice. Filled info color. |
| `k-banner--success` | variant | Something worked. |
| `k-banner--warning` | variant | Something needs attention. |
| `k-banner--danger` | variant | Something failed. |
| `k-banner--soft` | style | Variant color as a wash instead of a fill. |
| `k-banner--outline` | style | Transparent with a solid border. |
| `k-banner--dash` | style | Transparent with a dashed border. |
| `k-banner--vertical` | modifier | Stacks the grid into a column. |
| `k-banner--horizontal` | modifier | Lays the grid out as a row. |
| `k-banner--sm-horizontal` | modifier | Becomes a row from the `sm` breakpoint up. |

## Examples

### Info with an icon

The default filled info banner. The icon is decorative (`aria-hidden`); the text is the message.

```html
<div role="alert" class="k-banner k-banner--info">
  <span class="k-icon k-icon--info" aria-hidden="true"></span>
  <span>New software update available.</span>
</div>
```

### Soft success

`--soft` keeps the success color as a wash instead of a solid fill. Use it when the banner should recede.

```html
<div role="alert" class="k-banner k-banner--success k-banner--soft">
  <span>Your purchase has been confirmed.</span>
</div>
```

## Accessibility

Put `role="alert"` on the element so assistive tech announces it when it shows up. The message has to live in text, not only in color. Hide decorative icons with `aria-hidden="true"`. Actions inside are real buttons or links, so they get the kit focus ring.

## Dos and don'ts

**Do**
- Set `role="alert"` on the banner.
- Keep the banner in the page flow. Pin it with a [toast](/components/toast/) when it should float.

**Don't**
- Use this as a status chip. [Badges](/components/badge/) are for that.
- Announce with color only.
- Leave an icon visible to the accessibility tree.
