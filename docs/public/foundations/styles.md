# Styles

Radius, shadows, and the focus ring.

Everything that is not a [color](/foundations/colors/) or a [typeface](/foundations/typography/) lives here: corner radius, elevation, and the focus ring. These tokens sit on `:root`. Shadows pick up a stronger treatment in dark mode so they still read on a black page.

## Radius

`--k-radius` is the default corner on buttons, inputs, badges, and most controls. `--k-radius-lg` is the larger corner on cards, dialogs, and preview frames.

```html
<div class="rounded-k">Default</div>
<div class="rounded-k-lg">Large</div>
```

| Token | Value | Utility |
| --- | --- | --- |
| `--k-radius` | 0.375rem | `rounded-k` |
| `--k-radius-lg` | 0.625rem | `rounded-k-lg` |

## Shadows

Three elevations. Use `--k-shadow-1` for a light lift (a resting card). `--k-shadow-2` is a menu or popover. `--k-shadow-3` is something that should sit clearly above the page, such as a dialog.

```html
<div class="shadow-k-1">Resting</div>
<div class="shadow-k-2">Raised</div>
<div class="shadow-k-3">Overlay</div>
```

| Token | Use | Utility |
| --- | --- | --- |
| `--k-shadow-1` | Resting lift | `shadow-k-1` |
| `--k-shadow-2` | Menus, dropdowns | `shadow-k-2` |
| `--k-shadow-3` | Dialogs, overlays | `shadow-k-3` |

Light mode uses a soft slate shadow. Dark mode adds a faint light edge so the lift still shows on black.

## Focus ring

The ring is defined once for every `k-` class. Width, offset, and color are tokens. The color follows `--k-ring`, which stays orange in both themes.

```html
<button type="button" class="k-btn k-btn--primary">Button</button>
<a class="k-link" href="#focus">Link</a>
<input class="k-input" placeholder="Input" />
```

| Token | Value |
| --- | --- |
| `--k-focus-ring-width` | 2px |
| `--k-focus-ring-offset` | 2px |
| `--k-focus-ring-color` | `var(--k-ring)` |

`k-focus-ring` applies the same outline to something that is not focusable on its own. Do not restyle the ring per component. Anyone tabbing through the page will see the mismatch.
