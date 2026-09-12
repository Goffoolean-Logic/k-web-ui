# Typography

Outfit for UI. IBM Plex Mono for code. Sizes and weights.

Outfit is the font on kit UI. IBM Plex Mono is the font on code. Both ship as self-hosted Latin `.woff2` files.

Every `k-` class gets Outfit. `code`, `kbd`, `samp`, and `pre` inside kit markup get Plex. The rest of your page keeps whatever font you already set. Importing the kit does not rewrite a blog's type.

Outfit is a variable face from 100 to 900. Plex ships three static weights: 400, 500, and 600. Utilities if you need the faces outside a component: `font-k-sans` and `font-k-mono`.

```html
<p class="font-k-sans">Outfit</p>
<code class="font-k-mono">IBM Plex Mono</code>
```

| Token | Family | Utility |
| --- | --- | --- |
| `--k-font-sans` | Outfit | `font-k-sans` |
| `--k-font-mono` | IBM Plex Mono | `font-k-mono` |

## Outfit

| Utility | Size |
| --- | --- |
| `text-xs` | 0.75rem / 12px |
| `text-sm` | 0.875rem / 14px |
| `text-base` | 1rem / 16px |
| `text-lg` | 1.125rem / 18px |
| `text-xl` | 1.25rem / 20px |
| `text-2xl` | 1.5rem / 24px |
| `text-3xl` | 1.875rem / 30px |
| `text-4xl` | 2.25rem / 36px |

### Weights

Outfit is variable from 100 to 900: Thin, Extra light, Light, Regular, Medium, Semibold, Bold, Extra bold, Black.

### Size and weight together

How UI type usually lands:

- Caption · `text-xs` / 500
- Body · `text-sm` / 400. Most kit UI sits around this size.
- Emphasis · `text-base` / 500
- Title · `text-xl` / 600
- Display · `text-3xl` / 700

## IBM Plex Mono

Used for code inside kit markup, and for anything you mark `font-k-mono`. Only 400, 500, and 600 ship.

## On kit chrome

The same faces on a field, buttons, a link, and a card.

```html
<div class="k-field">
  <label class="k-label" for="type-email">Email</label>
  <input class="k-input" id="type-email" type="text" placeholder="you@example.com" />
  <p class="k-hint">We'll never share it.</p>
</div>
<button type="button" class="k-btn k-btn--primary">Primary</button>
<button type="button" class="k-btn k-btn--secondary">Secondary</button>
<a class="k-link" href="#">Read the guide</a>
<div class="k-card">
  <div class="k-card__header">
    <h3 class="k-card__title">Deployment</h3>
    <p class="k-card__subtitle">Last run 4 minutes ago</p>
  </div>
  <div class="k-card__body">
    <p>Every check passed on the latest commit. The log is in <code>dist/out</code>.</p>
  </div>
</div>
```
