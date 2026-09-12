# Input

k-field, k-label, k-input, k-hint.

These classes style one form field: a label, a text input, and optional helper text. Use them for short values such as email, a name, or a search box. They do not wrap `<select>` or `<textarea>`.

`.k-field` is the stack. Point `.k-label` at the input with `for` / `id`. `.k-input` is the control. `.k-hint` is the quiet line under it. When the value is wrong, set `aria-invalid="true"` on the input and swap the hint for `.k-error` so the red border and the message agree.

`disabled` on the input is enough. The caret and focus ring use the kit ring token.

## Classes

| Class | Type |
| --- | --- |
| `k-field` | component |
| `k-label` | component |
| `k-input` | component |
| `k-hint` | component |
| `k-error` | component |

## Examples

### With a hint

A complete field. The hint is extra context, not an error.

```html
<div class="k-field">
  <label class="k-label" for="docs-email">Email</label>
  <input class="k-input" id="docs-email" type="text" placeholder="you@example.com" />
  <p class="k-hint">We'll never share it.</p>
</div>
```

### Invalid

`aria-invalid="true"` paints the danger border. `.k-error` is the message.

```html
<div class="k-field">
  <label class="k-label" for="docs-email-invalid">Email</label>
  <input class="k-input" id="docs-email-invalid" type="text" value="not-an-email" aria-invalid="true" />
  <p class="k-error">Enter a valid email.</p>
</div>
```

## Accessibility

The label has to point at the input with `for` and `id`. Placeholder is not a name. Invalid means `aria-invalid="true"` on the input plus `.k-error` for the message. The red border alone is not enough. `disabled` is the attribute. Focus uses the kit ring.

## Dos and don'ts

**Do**
- Pair `for` and `id`.
- Use `.k-error` and `aria-invalid="true"` together. One without the other looks broken.
- Keep `.k-hint` for help, not for errors.

**Don't**
- Use placeholder as the only label.
- Put these classes on `<select>` or `<textarea>`.
- Show a red border with no message.
