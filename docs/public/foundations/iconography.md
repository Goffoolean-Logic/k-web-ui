# Iconography

Eleven UI icons. CSS masks. Recolor with bg-k-*.

The kit ships a small set of UI icons: chevrons, status, close, and loading. It is not a general icon library. If you need a product illustration, drop in your own SVG.

Put `.k-icon` and a name on a `span`. The glyph is a CSS mask. The painted part is `background-color`, which defaults to `currentColor`, so you do not have to inline a path.

```html
<span class="k-icon k-icon--info" aria-hidden="true"></span>
```

Inline `<svg class="k-icon">` still works if you bring your own path.

`k-icon--loading` is orange on a light background and white in dark mode. It sits still until you wrap it in [Spin](/components/spin/). The icon is the mark. Spin is the motion.

## Color

Add a `bg-k-*` class to change the fill. The mask keeps the shape. Only the background color shows through.

```html
<span class="k-icon k-icon--info" aria-hidden="true"></span>
<span class="k-icon k-icon--info bg-k-primary" aria-hidden="true"></span>
<span class="k-icon k-icon--success bg-k-success" aria-hidden="true"></span>
<span class="k-icon k-icon--warning bg-k-warning" aria-hidden="true"></span>
<span class="k-icon k-icon--danger bg-k-danger" aria-hidden="true"></span>
<span class="k-icon k-icon--info bg-k-info" aria-hidden="true"></span>
```

The first icon has no `bg-k-*` class, so it follows the surrounding text color. `text-k-*` on the icon or a parent does the same thing, because the default fill is `currentColor`.

## Set

| Name |
| --- |
| `chevron-left` |
| `chevron-right` |
| `chevron-down` |
| `chevron-first` |
| `chevron-last` |
| `info` |
| `success` |
| `warning` |
| `danger` |
| `close` |
| `loading` |

```html
<span class="k-icon k-icon--info" aria-hidden="true"></span>
```

## Sizes

| Class | Size |
| --- | --- |
| — | 4rem |
| `k-icon--xs` | 1.5rem |
| `k-icon--sm` | 2.5rem |
| `k-icon--lg` | 7rem |

Inside a button, a pagination control, or a carousel arrow they shrink to `1em` so they follow the type.

```html
<span class="k-icon k-icon--info k-icon--xs" aria-hidden="true"></span>
<span class="k-icon k-icon--info k-icon--sm" aria-hidden="true"></span>
<span class="k-icon k-icon--info" aria-hidden="true"></span>
<span class="k-icon k-icon--info k-icon--lg" aria-hidden="true"></span>
```
