# Carousel

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-carousel. Track, slides, and controls from slides.

A carousel steps through slides in one viewport, such as screenshots, quotes, or a short tour. Put `<k-carousel class="k-carousel">` on the page with `slides`. The element builds the track, slides, prev/next, and dots. A slide is `content` (a string) or `src` and `alt` for a picture.

It loops and autoscrolls by default. Hover or focus pauses the autoscroll. Changing `slides` rebuilds the track; changing `index`, `loop`, `autoscroll`, or `keyboard` does not.

If the user prefers reduced motion, the track does not animate and autoscroll stays off.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-carousel` | component | The one class you write. The element generates the viewport, track, slides, arrows, and dots inside it. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-carousel__viewport` | part | Clips the track to one slide. |
| `k-carousel__track` | part | The row of slides. Translates as the index changes. |
| `k-carousel__slide` | part | One slide. A picture or text. |
| `k-carousel__prev` | part | Previous control. Disabled at the start when loop is off. |
| `k-carousel__next` | part | Next control. Disabled at the end when loop is off. |
| `k-carousel__dots` | part | The row of dots under the track. |
| `k-carousel__dot` | part | One slide marker. The current one is `aria-current`. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `slides` | JSON array | — | One object per slide: `src` and `alt` for a picture, or `content` for text. |
| `index` | number | `0` | Zero-based slide to open on. |
| `loop` | `"false"` to disable | enabled | Wraps past the ends. When off, the end arrows become `disabled`. |
| `autoscroll` | `"false"` to disable | enabled | Advances every five seconds. Pauses on hover and focus. |
| `keyboard` | `"false"` to disable | enabled | Arrows, Home, and End move once the carousel has focus. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `slides` | `KCarouselSlide[]` | Read/write. Accepts a `Node` as `content`, which is how a slide gets real markup. Node values are not written back to the attribute. |
| `count` | number | Read-only. Number of slides. Reads the attribute, so it works before the element connects. |
| `index` | number | Read-only. Index of the current slide. |
| `isPlaying` | boolean | Read-only. True while autoscroll is on and nothing is hovering or focusing the host. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `goTo(index)` | void | Moves and fires `k-change`. Wraps when `loop` is on, clamps when it is off. |
| `next()` | void | Advances one slide, following the same wrap rule as `goTo`. |
| `previous()` | void | Goes back one slide, wrapping the same way. |
| `first()` | void | Jumps to the first slide. |
| `last()` | void | Jumps to the last slide. |
| `getSlide(index)` | `HTMLElement \| null` | The slide at an index. |
| `getCurrentSlide()` | `HTMLElement \| null` | The slide at `index`. |
| `play()` | void | Turns autoscroll on. |
| `pause()` | void | Turns autoscroll off. |
| `addSlide(slide, at)` | void | Inserts a slide, appending when `at` is left out. |
| `removeSlide(index)` | void | Drops a slide and its dot. |
| `updateSlide(index, patch)` | void | Merges a partial slide into the one at that index. |
| `refresh()` | void | Rebuilds the subtree from the current slides. |
| `disconnect()` | void | Stops autoscroll and removes listeners. |

`pause()` turns autoscroll off rather than pausing it briefly, so `play()` is what resumes it. Hover and focus handle the temporary pause on their own, which is what `isPlaying` reports.

Moving a slide dispatches `k-change` with `{ index }`, and the event bubbles. Setting the `index` attribute moves without firing it.

## Examples

### Pictures

Three pictures. Autoscroll and loop are on. Hover or focus to pause.

```html
<k-carousel
  class="k-carousel"
  slides='[{"src":"/scenery.jpg","alt":"Scenery"},{"src":"/travel-promo.jpg","alt":"Travel promo"},{"src":"/logo.png","alt":"K-Web-UI"}]'
></k-carousel>
```

## Accessibility

The element gets `aria-roledescription="carousel"` and `tabindex="0"` so it can take keyboard focus. Slides are labelled `1 of n`. Prev / next and dots have `aria-label`. The current dot is `aria-current="true"`. Arrow keys, Home, and End move when `keyboard` is true (the default). With `loop="false"`, end arrows are `disabled`. Autoscroll pauses on hover and focus. Reduced motion drops the slide animation and the autoscroll.

## Dos and don'ts

**Do**
- Use `<k-carousel class="k-carousel">` with `slides`.
- Pass a picture as `src` and `alt`, or text as `content`.
- Use `loop="false"` when the ends should stop.
- Use `autoscroll="false"` when the slides should stay.

**Don't**
- Hand-write the track, arrows, and dots. The element builds them.
- Put required page content only in a carousel.
- Nest carousels.
