# Carousel

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-carousel. Arrows and dots for a track of your own slides.

A carousel steps through slides in one viewport: screenshots, quotes, a short tour. Give the host an `id`, put the slides in a wrapper of their own, and number them from zero:

```html
<div>
  <div id="deals-0"><img src="/scenery.jpg" alt="Scenery" /></div>
  <div id="deals-1"><img src="/travel-promo.jpg" alt="Travel promo" /></div>
</div>
<k-carousel id="deals" class="k-carousel"></k-carousel>
```

```js
import 'k-web-ui/js';
```

There are no options. The element counts the slides, takes over their parent as the track, and builds the arrows and dots on the host. The slides never move in the DOM; each one translates by a `--k-carousel-index` the element sets on the track, which is why your markup survives a rebuild intact.

That wrapper has to hold the slides and nothing else, or the element throws rather than clipping something you meant to keep. The host itself is the control bar, so place it under the track.

It loops at both ends. Add `k-carousel--autoscroll` to advance every five seconds; hover or focus pauses it. Reduced motion drops the slide animation and keeps autoscroll off.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-carousel` | component | The one class you write. The element generates the arrows and dots inside it. |
| `k-carousel--autoscroll` | modifier | Advance every five seconds. `play()` and `pause()` toggle this class. |
| `k-carousel--no-keyboard` | modifier | Turns off arrows, Home, and End. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-carousel__track` | part | Put on the slides' parent. Clips the row and carries `--k-carousel-index`. |
| `k-carousel__slide` | part | Put on each linked slide. Off-screen ones carry `inert`. |
| `k-carousel__prev` | part | Previous control. |
| `k-carousel__next` | part | Next control. |
| `k-carousel__dots` | part | The row of dots between the arrows. |
| `k-carousel__dot` | part | One slide marker. The current one is `aria-current`. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `count` | number | Read-only. Slides the element found. |
| `index` | number | Read-only. Index of the current slide. |
| `isPlaying` | boolean | Read-only. True while autoscroll is on and nothing is hovering or focusing the host. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `select(index)` | void | Moves to a slide and fires `k-change`. |
| `goTo(index)` | void | The same move, under the name the other elements use. |
| `next()` | void | Advances one slide, wrapping past the last. |
| `previous()` | void | Goes back one slide, wrapping the same way. |
| `getSlide(index)` | `HTMLElement \| null` | The linked slide at an index. |
| `getCurrentSlide()` | `HTMLElement \| null` | The slide at `index`. |
| `play()` | void | Turns autoscroll on by adding `k-carousel--autoscroll`. |
| `pause()` | void | Turns it off by dropping that class. |
| `refresh()` | void | Relinks the slides and rebuilds the controls. |
| `disconnect()` | void | Stops autoscroll and removes listeners. |

`pause()` turns autoscroll off rather than pausing it briefly, so `play()` is what resumes it. Hover and focus handle the temporary pause on their own, which is what `isPlaying` reports.

Moving a slide dispatches `k-change` with `{ index }`, and the event bubbles.

## Examples

### Pictures

Three pictures on autoscroll. Hover or focus to pause, or use the arrows and dots.

```html
<div>
  <div id="gallery-0"><img src="/scenery.jpg" alt="Scenery" /></div>
  <div id="gallery-1"><img src="/travel-promo.jpg" alt="Travel promo" /></div>
  <div id="gallery-2"><img src="/logo.png" alt="K-Web-UI" /></div>
</div>
<k-carousel id="gallery" class="k-carousel k-carousel--autoscroll"></k-carousel>
```

## Accessibility

The host gets `aria-roledescription="carousel"` and `tabindex="0"` so it can take keyboard focus. Slides are labelled `1 of n`, and the ones off screen carry `inert`, so nothing inside them takes focus. Arrows and dots have an `aria-label`, and the current dot is `aria-current="true"`. Arrow keys, Home, and End move once the host has focus, unless you add `k-carousel--no-keyboard`. Reduced motion drops the slide animation and the autoscroll.

## Dos and don'ts

**Do**
- Give the host a unique `id` and number the slides from `-0`.
- Give the slides a wrapper of their own. That wrapper becomes the track.
- Put the host under the track. It's the control bar.
- Add `k-carousel--autoscroll` when the slides should move on their own.

**Don't**
- Hand-write the arrows and dots. The element builds them.
- Put anything but slides in the track.
- Put required page content only in a carousel.
- Nest carousels.
