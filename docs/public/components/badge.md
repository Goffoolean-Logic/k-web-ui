# Badge

**CSS component.** No JavaScript needed.

span.k-badge. Color, style, size.

A badge is a short label. Status, a count, a category. Stick one next to a heading or in a table cell. If something just happened on the page, that's a [banner](/components/banner/), not a badge.

Put `.k-badge` on a `span`. A `div` works too. A variant picks the color. A style picks the fill: solid if you skip one, then outline, dash, soft, or ghost. Mix them. `k-badge--info k-badge--soft` is a washed info chip.

Sizes go `--xs` to `--xl`. Skip the size and you get 1.5rem. An empty badge, no text and no icon, collapses to a dot. Drop a kit icon in when the color isn't enough on its own.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-badge` | component | The chip itself. Goes on a `span` or a `div`. Empty collapses to a dot. |
| `k-badge--primary` | variant | Orange kit chrome. |
| `k-badge--secondary` | variant | Muted field color. |
| `k-badge--accent` | variant | Accent color. |
| `k-badge--info` | variant | Neutral status. |
| `k-badge--success` | variant | Positive status. |
| `k-badge--warning` | variant | Status needing attention. |
| `k-badge--danger` | variant | Negative status. |
| `k-badge--outline` | style | Transparent with a solid border. |
| `k-badge--dash` | style | Transparent with a dashed border. |
| `k-badge--soft` | style | Variant color washed into the surface. |
| `k-badge--ghost` | style | No border, muted text. |
| `k-badge--xs` | modifier | 1rem tall. |
| `k-badge--sm` | modifier | 1.25rem tall. |
| `k-badge--lg` | modifier | 1.75rem tall. |
| `k-badge--xl` | modifier | 2rem tall. |

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

This isn't a live region. Leave `role="alert"` off. If the color means something, say it in the text, or hide the icon with `aria-hidden="true"` and keep the word. Empty dots are decorative. If the dot is the only status, give the badge an `aria-label`.

## Dos and don'ts

**Do**
- Mix a color with a style when you want a wash or an outline.
- Keep the text to a word or a count.

**Don't**
- Put `role="alert"` on it. Use a [banner](/components/banner/) if something just happened.
- Write a sentence in a badge.
- Trust color alone to carry the meaning.
