# Progress

**CSS component.** No JavaScript needed.

progress.k-progress. Linear bar.

A progress bar shows how far a task has gone along a line. Use it for an upload, a quota, or a long save. Use a [spin](/components/spin/) when you do not know the percent yet. Use a [gauge](/components/gauge/) when you want a square reading with a caption.

Put `.k-progress` on a `<progress>`. `value` and `max` are the native attributes. `--k-progress` is the fill. Name the task with `aria-label` if there is no visible label.

`--block` stretches the bar to the width of its parent. Sizes are `--sm` and `--lg`. Color variants are info, success, warning, and danger. Primary (the orange chrome) is the default.

No `value` is an empty track. Add `--indeterminate` when you want the motion. Reduced motion stops it.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-progress` | component | Goes on a native `progress` element. `value` and `max` drive the fill. |
| `k-progress--info` | variant | Neutral fill color. |
| `k-progress--success` | variant | Positive fill color. |
| `k-progress--warning` | variant | Fill color needing attention. |
| `k-progress--danger` | variant | Negative fill color. |
| `k-progress--indeterminate` | modifier | Busy sweep for when the percent is unknown. |
| `k-progress--block` | modifier | Stretches the bar to the parent width. |
| `k-progress--sm` | modifier | Thinner bar. |
| `k-progress--lg` | modifier | Thicker bar. |

## Examples

### Fill

`value` and `max` drive the native value. `--k-progress` is the painted fill.

```html
<progress class="k-progress" value="64" max="100" style="--k-progress: 64%" aria-label="Upload">64%</progress>
```

### Colors

```html
<progress class="k-progress" value="64" max="100" style="--k-progress: 64%" aria-label="Primary">64%</progress>
<progress class="k-progress k-progress--info" value="64" max="100" style="--k-progress: 64%" aria-label="Info">64%</progress>
<progress class="k-progress k-progress--success" value="64" max="100" style="--k-progress: 64%" aria-label="Success">64%</progress>
<progress class="k-progress k-progress--warning" value="64" max="100" style="--k-progress: 64%" aria-label="Warning">64%</progress>
<progress class="k-progress k-progress--danger" value="64" max="100" style="--k-progress: 64%" aria-label="Danger">64%</progress>
```

### Sizes

```html
<progress class="k-progress k-progress--sm" value="64" max="100" style="--k-progress: 64%" aria-label="Small">64%</progress>
<progress class="k-progress" value="64" max="100" style="--k-progress: 64%" aria-label="Default">64%</progress>
<progress class="k-progress k-progress--lg" value="64" max="100" style="--k-progress: 64%" aria-label="Large">64%</progress>
```

### Block

`--block` fills the parent width.

```html
<progress class="k-progress k-progress--block" value="64" max="100" style="--k-progress: 64%" aria-label="Upload">64%</progress>
```

### Empty and indeterminate

No `value` is an empty track. `--indeterminate` is the busy sweep.

```html
<progress class="k-progress" aria-label="Waiting"></progress>
<progress class="k-progress k-progress--indeterminate" aria-label="Loading"></progress>
```

## Accessibility

`<progress>` is already a progressbar. Do not add `role="progressbar"`. The text inside the tag is a fallback, not a visible label. Put the name in `aria-label` or a visible caption next to the bar. `prefers-reduced-motion: reduce` stops `--indeterminate`.

## Dos and don'ts

**Do**
- Put `.k-progress` on a `<progress>`.
- Set `--k-progress` to the same percent as `value` / `max`.
- Add `--indeterminate` only when you want the empty-state motion.

**Don't**
- Use this when you only have a busy icon. That is [spin](/components/spin/).
- Style a `div` to look like a bar.
- Use this for a square reading with a caption. That is [gauge](/components/gauge/).
