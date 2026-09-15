# Custom element init

Internal plan. Not a published docs page.

Pagination and gauge are the pattern. One empty tag. Inputs on the host. Import the JS once. The element writes everything inside.

Not this:

```html
<k-tabs class="k-tabs" label="Sections">
  <k-tab label="Overview">…</k-tab>
</k-tabs>
```

Not this:

```html
<k-carousel class="k-carousel">
  <img src="/scenery.jpg" alt="Scenery" />
</k-carousel>
```

This:

```html
<k-gauge class="k-gauge" value="64" max="100" label="Upload" text="64%"></k-gauge>
<k-pagination class="k-pagination" count="12" page="5"></k-pagination>
<k-tabs class="k-tabs" label="Sections" panels="…"></k-tabs>
```

Authors never write the inner tree. JS generates it. Same for every JS widget.

## Answers

1. **No `k-tab` in author HTML.** That was the wrong fork. A panel tag next to the host is more markup, not less. JS already writes `button.k-tabs__tab` and `div.k-tabs__panel`. Keep doing that.
2. **Drop `.items` now.** Package is `0.1.0`. The list still exists; it is an attribute plus a matching property, like `page` on pagination.
3. **MutationObserver.** That only matters if authors put children inside the host (`<img>` slides, `<k-tab>` panels) and might add another child later. The element would have to watch the DOM for those adds. We are not doing children, so we do not need it. Changing an input (`page="2"`, a new `panels` value) already notifies the element the same way pagination does.

## The rule

1. The host is empty. `class` plus inputs. Nothing between the tags.
2. Every input is an attribute. The JS property reflects it (`el.page = 3` writes `page="3"`).
3. JS generates the inner HTML on connect and whenever an observed attribute changes.
4. No shadow DOM. No author children. No `.items`.
5. `id` is optional.
6. Behavior we already have stays: icons, hrefs, node content from JS, keyboard, autoscroll, loop, `k-change`, ink, ARIA.

Gauge already matches. Leave the tag. Stop showing `createGauge()` as the way to make one.

## Inputs

Scalars are plain attributes. A list cannot be four small attributes, so it is one JSON attribute. Still one tag. JS parses it and builds the tree.

### Pagination (done)

```html
<k-pagination class="k-pagination" count="12" page="5"></k-pagination>
```

### Gauge (done)

```html
<k-gauge class="k-gauge" value="64" max="100" label="Upload" text="64%"></k-gauge>
```

### Dropdown

```html
<k-dropdown class="k-dropdown" label="Sort" options='[{"label":"Name"},{"label":"Date"},{"label":"Size"}]'></k-dropdown>
```

`href` stays on an option: `{"label":"Profile","href":"/profile"}`. JS writes a link instead of a button. Trigger, menu, ARIA, keyboard: unchanged.

### Carousel

```html
<k-carousel class="k-carousel" slides='[{"src":"/scenery.jpg","alt":"Scenery"},{"src":"/travel-promo.jpg","alt":"Travel promo"},{"src":"/logo.png","alt":"K-Web-UI"}]'></k-carousel>
```

`{ "src", "alt" }` is how a picture gets in without putting `<img>` in the author HTML. JS creates the image. `{ "content": "A quote." }` is still a text slide. `loop`, `autoscroll`, `index`, `keyboard` stay attributes.

### Tabs

```html
<k-tabs class="k-tabs" label="Sections" panels='[{"label":"Overview","icon":"info","content":"The first panel."},{"label":"Usage","content":"The second panel."},{"label":"API","content":"The third panel."}]'></k-tabs>
```

`icon`, `selected`, `keyboard`, ink, ARIA: unchanged. JS still writes the tablist and panels.

## JS that pagination already has

Attributes are the HTML path. Properties are the same inputs from script, not a second API.

```js
pager.page = 2;
dropdown.options = [{ label: 'Name' }, { label: 'Date' }];
carousel.slides = [{ src: '/scenery.jpg', alt: 'Scenery' }];
tabs.panels = [
  { label: 'Overview', icon: 'info', content: 'The first panel.' },
];
tabs.select(1);
```

Setting the property writes the attribute when the data can live in HTML (strings). That is `el.page = 2`.

Some call sites pass a live node as panel or slide content (docs `Example.astro`, the theme playground). An attribute cannot hold a node. Those keep working through the property: `content` may be a `Node`. We do not stringify that into the attribute. Everything else still generates the same inner DOM.

## What is not lost

| Widget | Must still do |
| --- | --- |
| Tabs | Labels, optional kit icons, string or node content, `selected`, `keyboard`, sliding ink, `k-change`, rebuild on input change |
| Dropdown | Trigger from `label`, button or link items, open/close, outside click, Escape, arrow keys |
| Carousel | Text slides, picture slides, node slides, loop, autoscroll, pause on hover/focus, dots, prev/next, keyboard |
| Gauge | Ring from the tag, bar from `<progress>`, `setGauge` for updates |
| Pagination | Window, first/last, keyboard, `k-change` |

Inner class names and CSS stay. We are changing how the host is configured, not how it looks.

## What goes away

- `.items`
- Author children as the list
- `k-tab` as something you write
- `data-tabs-demo` / `data-dropdown-demo` JSON bags on the host (the real attribute replaces them)
- `createGauge()` in docs and stories

## Call sites

| Place | After |
| --- | --- |
| Docs examples | Empty host + attributes. TS tab is `import 'k-web-ui/js'` unless the example is showing a property update |
| `TabsDemo` / `DropdownDemo` / `CarouselDemo` | Put the JSON on the tag. Delete the paint script |
| `Example.astro` | `el.panels = [{ label: 'HTML', content: node }, …]` so the live Code blocks still move into panels |
| `ThemePlayground.astro` | Same: property with node content for scene panels; dropdown `options` on the tag |
| Stories | `setAttribute` / property, then append the host. Same as pagination stories |
| Tests | Same |

## Order

1. Dropdown. Smallest list, no nodes in the main docs example.
2. Carousel. `src` / `alt` so the picture example stays one tag.
3. Tabs. Property must accept node `content` for Example and playground.
4. Gauge docs: no `createGauge()`.
5. Getting started / README: pagination or gauge as the JS story. Tabs shown as one tag with `panels`.

No shared base class. Copy pagination's lifecycle: `observedAttributes`, `connectedCallback`, `attributeChangedCallback`, reflecting properties.

## Risk

JSON in an attribute is uglier than `value="64"`. It is still one empty tag, which is the point. Do not invent a second mini-language (`Overview|Usage|API`) to hide it.
