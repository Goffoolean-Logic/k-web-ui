# Badge

span.k-badge. Color, style, size.

A badge is a short label for a status, a count, or a category. Put one next to a heading or in a table cell. If something just happened on the page, that belongs on a [banner](/components/banner/), not here.

Put `.k-badge` on a `span`. A `div` works too. A variant picks the color. A style picks the fill: solid if you omit one, then outline, dash, soft, or ghost. Mix them. `k-badge--info k-badge--soft` is a washed info chip.

Sizes go `--xs` to `--xl`. Leave the size off and you get 1.5rem. An empty badge, no text and no icon, collapses to a dot. Drop a kit icon in when the color is not enough on its own.

## Classes

| Class | Type |
| --- | --- |
| `k-badge` | component |
| `k-badge--primary` | variant |
| `k-badge--secondary` | variant |
| `k-badge--accent` | variant |
| `k-badge--info` | variant |
| `k-badge--success` | variant |
| `k-badge--warning` | variant |
| `k-badge--danger` | variant |
| `k-badge--outline` | style |
| `k-badge--dash` | style |
| `k-badge--soft` | style |
| `k-badge--ghost` | style |
| `k-badge--xs` | modifier |
| `k-badge--sm` | modifier |
| `k-badge--lg` | modifier |
| `k-badge--xl` | modifier |

## Examples

### Colors

Variants without a style class. Filled is the default. Danger here also carries an icon.

```html
<span class="k-badge">Default</span>
<span class="k-badge k-badge--primary">Primary</span>
<span class="k-badge k-badge--info">Info</span>
<span class="k-badge k-badge--success">Success</span>
<span class="k-badge k-badge--warning">Warning</span>
<span class="k-badge k-badge--danger">
  <span class="k-icon k-icon--danger" aria-hidden="true"></span>
  Danger
</span>
```

### Styles

The same info color through every fill treatment.

```html
<span class="k-badge k-badge--info">Filled</span>
<span class="k-badge k-badge--info k-badge--soft">Soft</span>
<span class="k-badge k-badge--info k-badge--outline">Outline</span>
<span class="k-badge k-badge--info k-badge--dash">Dash</span>
<span class="k-badge k-badge--info k-badge--ghost">Ghost</span>
```

## Accessibility

This is not a live region. Leave `role="alert"` off. If the color means something, say it in the text, or hide the icon with `aria-hidden="true"` and keep the word. Empty dots are decorative. If the dot is the only status, give the badge an `aria-label`.

## Dos and don'ts

**Do**
- Mix a color with a style when you want a wash or an outline.
- Keep the text to a word or a count.

**Don't**
- Put `role="alert"` on it. Use a [banner](/components/banner/) if something just happened.
- Write a sentence in a badge.
- Trust color alone to carry the meaning.
