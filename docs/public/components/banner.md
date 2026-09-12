# Banner

div.k-banner with role="alert".

A banner is an inline alert for something that just happened: a failed save, a confirmed purchase, an update in the page flow. Put `role="alert"` on the element. If the message should float over the page instead, wrap banners in a [toast](/components/toast/).

Start with `<div class="k-banner">`. A variant paints the fill. Soft, outline, or dash lightens that fill. Layout modifiers flip the grid: `--vertical` stacks, `--horizontal` is a row, `--sm-horizontal` becomes a row from the `sm` breakpoint up.

Children are optional. An icon, a plain span, or the body parts (`k-banner__title`, `k-banner__description`, `k-banner__actions`) all sit in the same grid.

## Classes

| Class | Type |
| --- | --- |
| `k-banner` | component |
| `k-banner__body` | part |
| `k-banner__title` | part |
| `k-banner__description` | part |
| `k-banner__actions` | part |
| `k-banner--info` | variant |
| `k-banner--success` | variant |
| `k-banner--warning` | variant |
| `k-banner--danger` | variant |
| `k-banner--soft` | style |
| `k-banner--outline` | style |
| `k-banner--dash` | style |
| `k-banner--vertical` | modifier |
| `k-banner--horizontal` | modifier |
| `k-banner--sm-horizontal` | modifier |

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
