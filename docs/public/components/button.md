# Button

**CSS component.** No JavaScript needed.

button.k-btn. Variants, sizes, block.

Use a button when the click stays on this page: save, cancel, delete, open a modal. If you are sending someone somewhere else, use a [link](/components/link/).

The element has to be a real `<button>` with `.k-btn` and one variant. Primary is the main action. Secondary sits next to it. Ghost recedes. Accent is dark type on a light fill. Danger is the one that deletes things. Add `--sm` or `--lg` when the surrounding UI is tight or large. `--block` is full width of the parent.

`disabled` (or `aria-disabled="true"`) dims it and blocks pointer events. Icons inside shrink to `1em` so they follow the button type size, not the large standalone icon scale.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-btn` | component | The control. Goes on a `button`, or an `a` when the click navigates. |
| `k-btn--primary` | variant | The main action. One per group. |
| `k-btn--secondary` | variant | Sits next to the primary action. |
| `k-btn--ghost` | variant | Recedes until hovered. |
| `k-btn--accent` | variant | Dark type on a light accent fill. |
| `k-btn--danger` | variant | Destructive action. |
| `k-btn--sm` | modifier | Smaller padding and type for tight UI. |
| `k-btn--lg` | modifier | Larger padding and type. |
| `k-btn--block` | modifier | Full width of the parent. |

## Examples

### Variants

Each variant once, plus a disabled primary. Pick one variant. Do not stack them (`k-btn--primary k-btn--danger`).

```html
<button type="button" class="k-btn k-btn--primary">Primary</button>
<button type="button" class="k-btn k-btn--secondary">Secondary</button>
<button type="button" class="k-btn k-btn--ghost">Ghost</button>
<button type="button" class="k-btn k-btn--accent">Accent</button>
<button type="button" class="k-btn k-btn--danger">Danger</button>
<button type="button" class="k-btn k-btn--primary" disabled>Disabled</button>
```

### Sizes

`--sm` and `--lg` change padding and type. The unnamed size is the one in the middle.

```html
<button type="button" class="k-btn k-btn--primary k-btn--sm">Small</button>
<button type="button" class="k-btn k-btn--primary">Default</button>
<button type="button" class="k-btn k-btn--primary k-btn--lg">Large</button>
```

### With an icon

Icon before the label. Inside the button it drops to `1em`.

```html
<button type="button" class="k-btn k-btn--primary">
  <span class="k-icon k-icon--success" aria-hidden="true"></span>
  Save
</button>
```

## Accessibility

Use a real `<button>`. A styled `div` will not get keyboard or the kit ring for free. The ring is global; leave it alone. Prefer `disabled` when the action cannot run. `aria-disabled="true"` looks the same if you still need it in the tab order. Hide decorative icons with `aria-hidden="true"` and put the name in the text, or `aria-label` on an icon-only button.

## Dos and don'ts

**Do**
- Give it a variant. Primary for the thing you actually want people to click.
- Put the name in the text. Icons stay `aria-hidden`.
- Use `disabled` when the action cannot run.

**Don't**
- Stack variants.
- Use a button to leave the page. Use a [link](/components/link/).
- Restyle the focus ring.
