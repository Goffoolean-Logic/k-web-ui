# Carousel

k-carousel. Track, slides, and controls from items.

A carousel steps through slides in one viewport, such as screenshots, quotes, or a short tour. Put `<k-carousel class="k-carousel">` on the page and set `items`. The element builds the track, slides, prev/next, and dots. Each item is `content` (a string or a node).

It loops by default. Set `loop="false"` to stop at the ends. The arrows disable there. `index` sets the starting slide. `keyboard` (default true) lets arrow keys move once the carousel is focused.

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
<k-carousel id="docs-carousel" class="k-carousel"></k-carousel>
```

```js
import { KCarousel } from 'k-web-ui/js';

const carousel = document.getElementById('docs-carousel');
carousel.items = [
  { content: 'First slide' },
  { content: 'Second slide' },
  { content: 'Third slide' },
];
```

## Accessibility

The element gets `aria-roledescription="carousel"` and `tabindex="0"` so it can take keyboard focus. Slides are labelled `1 of n`. Prev / next and dots have `aria-label`. The current dot is `aria-current="true"`. Arrow keys, Home, and End move when `keyboard` is true. With `loop="false"`, end arrows are `disabled`. Reduced motion drops the slide animation.

## Dos and don'ts

**Do**
- Use `<k-carousel class="k-carousel">` and set `items`.
- Pass `items` as `content` strings or nodes.
- Use `loop="false"` when the ends should stop.

**Don't**
- Hand-write the track, arrows, and dots. The element builds them.
- Put required page content only in a carousel.
- Nest carousels.
