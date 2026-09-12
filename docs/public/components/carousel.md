# Carousel

KCarousel.mount on an empty .k-carousel element.

A carousel steps through slides in one viewport, such as screenshots, quotes, or a short tour. Put an id and `.k-carousel` on an empty element. `KCarousel.mount` builds the track, slides, prev/next, and dots from `items`. Each item is `content` (a string or a node).

It loops by default. Pass `loop: false` to stop at the ends. The arrows disable there. `index` sets the starting slide. `keyboard` (default true) lets arrow keys move once the carousel is focused.

If the user prefers reduced motion, the track does not animate.

## Classes

| Class | Type |
| --- | --- |
| `k-carousel` | component |
| `k-carousel__viewport` | part |
| `k-carousel__track` | part |
| `k-carousel__slide` | part |
| `k-carousel__prev` | part |
| `k-carousel__next` | part |
| `k-carousel__dots` | part |
| `k-carousel__dot` | part |

## Examples

### Looping slides

Three slides, loop on. Arrows wrap. Dots jump.

```html
<div id="docs-carousel" class="k-carousel"></div>
```

```js
import { KCarousel } from 'k-web-ui/js';

KCarousel.mount('docs-carousel', {
  items: [
    { content: 'First slide' },
    { content: 'Second slide' },
    { content: 'Third slide' },
  ],
});
```

## Accessibility

The element gets `aria-roledescription="carousel"` and `tabindex="0"` so it can take keyboard focus. Slides are labelled `1 of n`. Prev / next and dots have `aria-label`. The current dot is `aria-current="true"`. Arrow keys, Home, and End move when `keyboard` is true. With `loop: false`, end arrows are `disabled`. Reduced motion drops the slide animation.

## Dos and don'ts

**Do**
- Mount on an empty element with an id and `.k-carousel`.
- Pass `items` as `content` strings or nodes.
- Use `loop: false` when the ends should stop.

**Don't**
- Hand-write the track, arrows, and dots. `mount` builds them.
- Put required page content only in a carousel.
- Nest carousels.
