# Gauge

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-gauge. Square frame with a reading and a caption.

A gauge shows how far a task has gone as a square frame with a number in the middle and a caption in the open bottom. Use a [spin](/components/spin/) when you do not know the percent yet and the mark sits next to a label. Use [progress](/components/progress/) for a linear bar.

Put `<k-gauge class="k-gauge">` on the page and give the host an `id`. Import the JS once. The tag writes a hidden `<progress>`, the frame, the reading, and the caption, and every repaint reuses the nodes it already made. The fill eases when the value changes. Reduced motion drops the motion.

The reading is yours to write: 8, 64%, 1,024, 12.4k. The type shrinks to fit the dial. Overflow wraps.

No `value` is an empty gauge, not a loading state. Add `indeterminate` when you want the motion.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-gauge` | component | The one class you write. The element generates the progress, frame, reading, and caption inside it. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | number | — | How far along. Clamped to 0…`max`. Omit it for an empty gauge. |
| `max` | number | `1` | The top of the range. |
| `label` | string | — | Caption in the open bottom. Also labels the hidden progress. |
| `text` | string | — | Visible reading. Defaults to the formatted value when omitted. |
| `variant` | info \| success \| warning \| danger | — | Fill color. Omit for the primary orange chrome. |
| `size` | sm \| lg | — | Dial size. Omit for the default. |
| `indeterminate` | boolean attribute | — | Busy sweep. Ignores `value` while set. |

## Methods

The element has no methods. Two imported helpers cover the common cases, and every attribute above is also a property that reflects back to the tag, so `el.value = 80` works on its own.

| Method | Returns | Description |
| --- | --- | --- |
| `setGauge(el, value, max, text)` | void | Sets value, max, and the visible reading in one call. `max` defaults to the current max; omit `value` to empty the gauge. |
| `createGauge(options)` | KGauge | Builds a `k-gauge` element from an options object, ready to append. |

```js
import { createGauge, setGauge } from 'k-web-ui/js';

const gauge = createGauge({ value: 64, max: 100, label: 'Upload' });
document.body.append(gauge);
setGauge(gauge, 80, 100, '80 MB');
```

## Examples

### Frame

The tag writes the number and the caption. `--k-gauge` is how far the fill has gone along the three sides.

```html
<k-gauge id="docs-gauge" class="k-gauge" value="64" max="100" label="Upload" text="64%"></k-gauge>
```

### Numbers

You write the text; the fill still comes from `value` / `max`. `variant` is the color.

```html
<k-gauge id="docs-gauge-open" class="k-gauge" value="8" max="100" label="Open" text="8"></k-gauge>
<k-gauge id="docs-gauge-requests" class="k-gauge" variant="success" value="1024" max="5000" label="Requests" text="1,024"></k-gauge>
<k-gauge id="docs-gauge-bandwidth" class="k-gauge" variant="info" value="12400" max="20000" label="Bandwidth" text="12.4k"></k-gauge>
<k-gauge id="docs-gauge-uptime" class="k-gauge" variant="warning" value="99.99" max="100" label="Uptime" text="99.99%"></k-gauge>
```

### Empty and indeterminate

No `value` is an empty track. `indeterminate` is the busy sweep. `prefers-reduced-motion: reduce` stops the motion.

```html
<k-gauge id="docs-gauge-waiting" class="k-gauge" label="Waiting"></k-gauge>
<k-gauge id="docs-gauge-syncing" class="k-gauge" indeterminate label="Syncing"></k-gauge>
```

## Accessibility

The tag points `aria-labelledby` at the caption it writes. The reading is `aria-hidden` so the number is not read twice. The hidden `<progress>` is already a progressbar. Do not add `role="progressbar"`. `prefers-reduced-motion: reduce` stops `indeterminate`.

## Dos and don'ts

**Do**
- Use `<k-gauge id="upload" class="k-gauge">` so the JS can write the reading and the caption.
- Pass `variant`, `size`, and `indeterminate` on the tag.
- Use `setGauge()` when the value changes often.

**Don't**
- Use this when you only have a busy icon. That is [spin](/components/spin/).
- Use this for a linear bar. That is [progress](/components/progress/).
- Style a `div` to look like a gauge.
- Write the reading or the caption by hand.
- Put `k-gauge--success` on the host. That is `variant="success"`.
