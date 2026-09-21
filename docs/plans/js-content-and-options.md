# Plan: JS components as id + options + HTML content

Status: implemented in `package/` (0.2.0). Docs site and Storybook are out of this cut.

Framework-agnostic. The kit is custom elements + CSS. Any app imports `k-web-ui/js` once at startup, puts tags in the page, sets properties in that environment’s usual way (plain JS, a template property binding, etc.). Do not special-case Angular, React, or Vue in the API or the docs that ship with the package.

## One way

1. Unique `id` on every JS host.
2. Paged HTML (tabs, pagination, carousel) lives in **`${hostId}-0`**, **`${hostId}-1`**, … consecutive from zero. First missing number ends the list.
3. **`.options` only for data that is not in the DOM.** Pagination and carousel have no `.options`. Scrollbar has no `.options` unless it is targeting another scroller (see below).

The element reads `this.id`. `getElementById` does not care whether the host sits before or after the pages.

`connectedCallback` adds the component class if missing.

## Content linker

One helper: `contentNodes(host)`. Lookup `${host.id}-0`, `${host.id}-1`, …  
If the host has no `id`, throw.  
If `${id}-0` is missing, **wait** (MutationObserver). Disconnect/abort on `disconnectedCallback`. Do not throw on first paint. If pages never appear, the host stays empty.

On each linked node the kit **adds** the part class (`k-tabs__panel`, `k-pagination__page-panel`, `k-carousel__slide`) and ARIA. It does not move or clone nodes.

Show/hide and **animation** both run on those nodes (and carousel on their shared parent). Existing kit motion (tab ink, panel fade, reduced-motion cuts, carousel slide) is reimplemented against this DOM, not dropped.

### Tabs

```html
<k-tabs id="education"></k-tabs>
<div id="education-0">…</div>
<div id="education-1">…</div>
```

```js
document.getElementById('education').options = [
  { label: 'KSU', icon: 'info' },
  { label: 'Courses' },
];
```

`.options` is `{ label: string, icon?: KIconName }[]`. `label` is required. `icon` is a kit icon name, same as today. Generated tablist + ink stay inside the host. Ink animation unchanged. Panel change: existing fade/slide on the linked nodes via current/hidden classes, `prefers-reduced-motion` respected.

`size`: host class `k-tabs--lg` (replaces `size="lg"`). Keyboard stays **on** (a11y). No flag to disable it in this model unless we keep a class `k-tabs--no-keyboard` for the old `keyboard="false"` escape — include that class so nothing is dropped.

Label count must match node count once nodes exist.

### Pagination

No `.options`. Count = number of `${id}-n` nodes. Starts at `0`. Window, first/last, keyboard: same behavior as today.

```html
<div id="story-0">…</div>
<div id="story-1">…</div>
<k-pagination id="story"></k-pagination>
```

Bar centered in the host CSS. Host after the pages is the usual layout. Page change can keep a short fade on the linked nodes (same reduced-motion rule).

### Carousel (keep the slide animation)

No `.options`. Same ids. Chrome (arrows, dots) generated in the host.

**Track:** the `${id}-n` nodes must be **adjacent siblings** whose parent contains only those slides. The kit does not wrap or move them. It puts `k-carousel__track` on that parent and applies the same transform/transition the track uses today (`translateX`, loop, reduced motion). Dots/arrows stay in `<k-carousel>`.

```html
<div>
  <div id="deals-0">…</div>
  <div id="deals-1">…</div>
</div>
<k-carousel id="deals"></k-carousel>
```

If the parent has extra children, throw: slides must sit alone in their track parent.

**Autoscroll:** host class `k-carousel--autoscroll` (replaces the attribute). Hover/focus pause: same as today. Loop: still the default.

## Layout

Document order is position. No `placement` input. Tabs host usually above pages; pagination host usually below, centered; carousel chrome above or below the track as authored.

## Features (old attributes → new setup)

Nothing from the current JS widgets is intentionally removed. Attributes go away; classes and `.options` cover the same inputs.

| Old | New |
| --- | --- |
| `panels` / `slides` JSON or Node clones | `${id}-n` nodes + tab `.options` labels |
| `count` / `page` | inferred from nodes; `select(index)` |
| `label` on tablist | `aria-label` on the host (real ARIA, not a kit attr) |
| `selected` / `index` | `select(index)` |
| `keyboard="false"` | class `k-tabs--no-keyboard` / `k-carousel--no-keyboard` |
| `size="lg"` | `k-tabs--lg`, `k-gauge--lg`, `k-scrollbar--lg` |
| tab `icon` | `options[].icon` |
| `loop` | default on for carousel (current default) |
| `autoscroll` | `k-carousel--autoscroll` |
| dropdown `label` + `options` | `.options = { trigger, items }` |
| item `href` | `items: { label, href? }[]` (`href` makes an anchor, same as today) |
| `align="end"` | `k-dropdown--end` |
| gauge `value` `max` `text` `label` | `.options = { value, max, text?, label? }` |
| gauge `variant` | `k-gauge--info` / `--success` / `--warning` / `--danger` |
| `indeterminate` | `k-gauge--indeterminate` |
| scrollbar `axis` | `k-scrollbar--x` / `--y` / `--both` (default both) |
| `target` | `.options = { target: 'viewport' \| string }` when not wrapping children |
| `autohide` | default on; class `k-scrollbar--no-autohide` to match old `autohide="false"` |

`.options` equality: if the setter gets the same data (deep compare labels/items/value), no-op so template bindings that allocate a new object each pass do not rebuild.

`select(index)` on tabs, pagination, carousel. `k-change` detail `{ index }` for those three. Dropdown `{ index, label, href }`. Gauge does not emit.

## Accessibility

Keep current semantics; point them at generated chrome + linked nodes.

- **Tabs:** `role="tablist"` on the generated list; `aria-label` from the host’s `aria-label` if set, else the host `id`. Tabs: `role="tab"`, `aria-selected`, `aria-controls` → `${id}-n`. Panels: `role="tabpanel"`, `aria-labelledby`, `hidden` + `inert` when not selected. Arrow / Home / End unless `--no-keyboard`. Focus ring on tabs. Decorative icons `aria-hidden`.
- **Pagination:** `aria-label="Pagination"` (or host `aria-label`). Buttons labelled as today (`Page 2 of 12`, First, …). `aria-current="page"` on the current control. Disabled ends. Keyboard same as today.
- **Carousel:** `aria-roledescription="carousel"` on the host; slides `aria-hidden` when offscreen; dots named; arrows labelled; keyboard unless `--no-keyboard`. Autoscroll pauses on hover/focus (`aria-live` polite if we already announce — keep existing behavior).
- **Dropdown:** `aria-haspopup`, `aria-expanded`, `aria-controls`, `role="menu"` / `menuitem`. Keyboard, Escape, focus return. Trigger name is `options.trigger`.
- **Gauge:** hidden native `progress` (or equivalent) with `value`/`max`; visible text is `text` or `value`; `label` is the caption. Indeterminate: `aria-valuetext` / no value as today.
- **Scrollbar:** thumbs not in tab order; axis announced only if we already do — do not make thumbs a keyboard trap.

Do not rely on `[hidden]` alone for inert panels (focusable controls inside). Always `inert` on inactive tab/page/slide nodes.

Popover dialogs still must not live inside an inert/hidden page. Authors keep those dialogs as siblings of the pager. Document in package README; no extra API.

## Kit internals

- No `observedAttributes` for kit config. `id` and `class` (including modifiers) are HTML.
- Observe `class` only if needed to toggle autoscroll / lg after connect (`MutationObserver` on `class` of the host) so adding `k-carousel--autoscroll` later still works.
- Stash `.options` if set before connect; run init from the setter whenever it changes (and is not equal).
- `contentNodes` shared. Reduced-motion: existing media queries, retargeted to linked nodes / track parent.

## Package surface

Export the same custom elements from `k-web-ui/js`. Types: `KTabs`, `KTabItem`, etc. updated. Version **0.2.0**. README in `package/` describes id linking, `.options`, and modifier classes. Do not block the release on the docs app or Storybook.

## Tests (`package/`)

- Two paginations, two tab hosts; ids do not leak.
- Host after content nodes.
- Tabs: options length vs node count.
- Carousel: transform on slide parent; throw if parent has extra children; autoscroll class; reduced-motion.
- Dropdown href item is an `<a>`.
- Gauge variant class + options value/max.
- Scrollbar `target: 'viewport'`.
- Options setter no-op on equal data.
- Observer: connect before `${id}-0` exists, then add the node.
- Keyboard and ARIA assertions from today’s tests, adapted to linked nodes.

## Implementation order

1. `contentNodes` + observer + tests  
2. Tabs (labels, icons, ink animation, a11y, `--lg`, `--no-keyboard`)  
3. Pagination (infer count, centered CSS, a11y)  
4. Carousel (track parent, animation, loop, `--autoscroll`)  
5. Dropdown, gauge, scrollbar (full feature map, no attributes)  
6. Strip old attribute/clone paths from `package/`  
7. `package/README` + changelog 0.2.0  

## Success

```html
<k-tabs id="education" class="k-tabs--lg" aria-label="Education"></k-tabs>
<div id="education-0">…</div>
<div id="education-1">…</div>

<div>
  <div id="deals-0">…</div>
  <div id="deals-1">…</div>
</div>
<k-carousel id="deals" class="k-carousel--autoscroll"></k-carousel>

<div id="story-0">…</div>
<div id="story-1">…</div>
<k-pagination id="story"></k-pagination>
```

```js
document.getElementById('education').options = [
  { label: 'KSU', icon: 'info' },
  { label: 'Courses' },
];
```
