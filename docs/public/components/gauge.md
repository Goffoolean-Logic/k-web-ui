# Gauge

progress.k-gauge, or k-gauge for the square frame.

A gauge shows how far a task has gone. Use a [spin](/components/spin/) when you do not know the percent yet and the mark sits next to a label. Use this when you have a value, such as an upload or a remaining quota.

A bar is `<progress class="k-gauge">`. `value` and `max` are the native attributes. The ring is `<k-gauge class="k-gauge">`. Put an `id` on the host. `value`, `max`, `label`, and `text` are attributes. Import the JS once and the tag writes `--ring`, the reading in the middle, and the caption in the open bottom. `label` is the caption. `text` is the visible number if you do not want the raw value. `setGauge()` keeps `--k-gauge` in step when the value changes. The fill eases when the value changes. Reduced motion drops the motion.

The reading is yours to write: 8, 64%, 1,024, 12.4k. The type shrinks to fit the dial. Overflow wraps.

`--block` stretches a bar to the width of its parent. Sizes are `--sm` and `--lg`. Color variants are info, success, warning, and danger. Primary (the orange chrome) is the default.

No `value` is an empty gauge, not a loading state. Add `--indeterminate` when you want the motion.

## Classes

| Class | Type |
| --- | --- |
| `k-gauge` | component |
| `k-gauge-group` | component |
| `k-gauge__value` | part |
| `k-gauge__label` | part |
| `k-gauge--info` | variant |
| `k-gauge--success` | variant |
| `k-gauge--warning` | variant |
| `k-gauge--danger` | variant |
| `k-gauge--ring` | modifier |
| `k-gauge--indeterminate` | modifier |
| `k-gauge--block` | modifier |
| `k-gauge--sm` | modifier |
| `k-gauge--lg` | modifier |

## Examples

### Bar

`value` and `max` drive the fill. Name the task with `aria-label` if there is no visible label.

```html
<progress class="k-gauge" value="64" max="100" style="--k-gauge: 64%" aria-label="Upload">64%</progress>
```

### Ring

The tag writes the number and the caption. `--k-gauge` is how far the fill has gone along the three sides.

```html
<k-gauge id="docs-gauge" class="k-gauge" value="64" max="100" label="Upload" text="64%"></k-gauge>
```

### Numbers

You write the text; the fill still comes from `value` / `max`.

```html
<k-gauge id="docs-gauge-open" class="k-gauge" value="8" max="100" label="Open" text="8"></k-gauge>
<k-gauge id="docs-gauge-requests" class="k-gauge k-gauge--success" value="1024" max="5000" label="Requests" text="1,024"></k-gauge>
<k-gauge id="docs-gauge-bandwidth" class="k-gauge k-gauge--info" value="12400" max="20000" label="Bandwidth" text="12.4k"></k-gauge>
<k-gauge id="docs-gauge-uptime" class="k-gauge k-gauge--warning" value="99.99" max="100" label="Uptime" text="99.99%"></k-gauge>
```

### Empty and indeterminate

No `value` is an empty track. `--indeterminate` is the busy sweep. `prefers-reduced-motion: reduce` stops the motion.

```html
<k-gauge id="docs-gauge-waiting" class="k-gauge" label="Waiting"></k-gauge>
<k-gauge id="docs-gauge-syncing" class="k-gauge k-gauge--indeterminate" label="Syncing"></k-gauge>
<progress class="k-gauge" aria-label="Waiting"></progress>
<progress class="k-gauge k-gauge--indeterminate" aria-label="Loading"></progress>
```

## Accessibility

`<progress>` is already a progressbar. Do not add `role="progressbar"`. The tag points `aria-labelledby` at the caption it writes. Hide `.k-gauge__value` with `aria-hidden="true"` so the number is not read twice. The text inside the progress tag is a fallback, not a visible label. `prefers-reduced-motion: reduce` stops `--indeterminate`.

## Dos and don'ts

**Do**
- Put `.k-gauge` on a `<progress>` for a bar.
- Use `<k-gauge id="upload" class="k-gauge">` so the JS can write the reading and the caption.
- Add `--indeterminate` only when you want the empty-state motion.

**Don't**
- Use this when you only have a busy icon. That is [spin](/components/spin/).
- Style a `div` to look like a gauge.
- Write `.k-gauge__value` and `.k-gauge__label` by hand.
