# Mobile docs issues

Checked the local docs at 320px, 390px, and 768px. The sidebar docks at 50em (800px), so a phone and an iPad in portrait both get this layout. Nothing here is published. It sits next to the docs app so it stays out of the sidebar.

## Hero title shrinks to body type

The wordmark is set to 4.5rem (72px). On a phone it measures 15px.

`Hero.astro` sizes it with:

```css
font-size: min(var(--hero-title-size, 4.5rem), calc((100vw - 5rem) / 21));
```

The `/ 21` is there so "K-Web-UI" stays on one line. There is no floor, so the type shrinks until the line fits.

| Width | Title |
| --- | --- |
| 320px | 11px |
| 390px | 15px |
| 768px | 33px |

The tagline under it is clamped to body size, which bottoms out at 16px. On a phone the sentence is bigger than the name. At 320px the tagline also wraps to two lines, so it takes even more of the screen.

Give the title a floor that still reads as a title on a phone (around 2rem). The tagline should stay smaller than that. The `/ 21` clamp can stay for wide screens, where 72px is the cap.

## Hero buttons don't match

"Get started" and "View components" are links with `k-btn`. The theme control is a real `<button class="k-btn">`. Measured at 390px:

- The two links are 14px type, 40px tall.
- The theme button is 16px type, 28px line-height, 50px tall.

They don't share a row cleanly. At 390px the links sit together and the theme control wraps under them, taller than both. At 320px each one takes its own row, and the theme control is still the tall one. At 768px they finally share a row, and the links stretch up to 50px to match the button, so the padding looks uneven.

Starlight's reset sets `font: inherit` on `button`, inside `@layer starlight.reset`. That layer lands after the kit's `components` layer, so it wins on real buttons and loses on links. The links keep the kit's `text-sm` / tight line-height. Buttons inherit the body font. Same padding, different type, different height.

That same override is why "Copy markdown" (a `k-btn--sm` button) renders at 16px instead of the small size, and why playground buttons like Light / Dark don't pick up `k-btn--sm` type.

Make the three hero controls one height. The `k-btn` type size has to win on `<button>` too, since the links already have it.

The "Scroll down" arrow is 3.5rem (56px). Next to a 15px title it is the biggest thing on the screen. Once the title is a real title, that size is fine. Until then it makes the hero look empty, with a tiny cluster in the middle and a large arrow at the bottom.

## There is no way to open the sidebar

On a docs page the nav exists. It is translated off the left edge (`x: -264` at 390px) and nothing on screen opens it. I counted `.k-sidebar__trigger--open` on every page I opened. The count was 0.

`MobileMenuToggle.astro` is the open button. It is registered in `astro.config.mjs`, and it is a `<label for="docs-nav">`, which is the right hook for the checkbox drawer. Starlight only mounts that component from its own `PageFrame`. Ours replaced that frame and never renders the toggle. The close label is inside the panel, so it is off screen with the nav.

What to build:

- A menu button in the header, below 50em, wired to `#docs-nav`.
- A close button that stays on the panel. The "Close" label is already there. It just needs to be reachable.
- Tapping a nav link already clears the checkbox. Keep that.

Until that button exists, the only on-page control is Starlight's "On this page" bar. That bar jumps to headings on the current article. It does not open Getting started, Components, or anything else.

Two things that look like header actions are actually inside that closed panel. Starlight hides the header's theme picker and GitHub icon below 50rem (`sl-hidden md:sl-flex`) and renders them again in the sidebar footer. On a phone you cannot change theme from a docs page, because the picker is in the drawer. The footer still has a GitHub link, so that one is not fully trapped.

The homepage is a separate hole. The splash template does not render the header or the sidebar (`hasSidebar && !isSplash`). The two hero links and a few cards are the only way off the page. A header menu button has nowhere to go until the splash page keeps a header, or a menu button of its own, and the nav markup is actually in the page.

The header already reserves the slot. On docs pages, `padding-inline-end` is 64px so a menu button can sit in the corner. The search icon is 32×40 and stops 64px short of the right edge. That empty corner is the missing button. While that corner gets filled, the search hit target should grow. 32px is small for a thumb.

## The drawer is as tall as the article

Opening it is only half the problem. `aside.k-sidebar__panel` is `position: absolute` inside `.k-sidebar`, and that element grows with the article. On Getting started the panel is 2691px tall. On Tabs it is 7558px. It scrolls away with the page. The close control is at the top of that, so it scrolls away too.

Below 50em the drawer should be fixed to the viewport, scroll inside itself, and keep the close button on screen. The scrim is already there. The page behind it should not scroll while the drawer is open. `.k-sidebar` also sets `overflow: hidden` below 50em, which is what clips the wide tables in the next section. A fixed panel does not need the whole page clipped.

The hidden checkbox is exposed to assistive tech as "Close" even while the panel is off screen, because that label is the accessible name. The open button wants its own name ("Menu") so a screen reader is not announcing a close control that isn't visible.

## Page titles share a row with Copy markdown

`.doc-title` is a horizontal row. The heading column's flex basis is 12rem, so on a 390px screen the title gets about 200px and the button gets the rest.

"Getting started" and "Theme playground" wrap to two lines beside the button. "Iconography" fits on one line and sits flush against it. "Button" and "Carousel" are worse: title, CSS/JS badge, and the button are three items on one row.

At 320px the row finally wraps and the button drops under the title. That is the better layout. Do it on purpose under roughly 40rem: title full width, button underneath.

## Code blocks look cut off

Sample lines are much wider than the box. A carousel example line is about 700px inside a 356px `pre`. The modal page has a line around 900px. Native scrollbars are turned off on every element (`scrollbar-width: none` in `docs.css`), and the custom scrollbar does not read as "there is more" on a phone.

The carousel sample stops mid-attribute at the orange border: `scenery.jp` and `class="k-carousel"` are cut with no cue that the line continues. Swipe may work. Nothing shows that it will.

Let code scroll inside the block, and show a scrollbar or some other hint on narrow screens. Don't rely on the page scrolling sideways. The shell clips that.

## Some class tables get clipped

Most tables fit. A few don't. On Pagination a `k-table` measured 427px in a 390px viewport. On Tabs, 407px. The parent is `.k-class-table`, which does not scroll. `.k-sidebar` has `overflow: hidden` below 50em, and the document's scroll width stayed at 390px, so the extra columns are clipped. You cannot drag the page sideways to see them.

Wrap those tables in a horizontal scroller, the same idea as the code blocks. The shell should not be what cuts them off.

## "Site: 0.1.0" sits on top of the homepage

`.docs-version` is `position: fixed` at the top right, with no background, and only on the splash page. It stays put while you scroll. Over the lower cards it covers the copy. "React, Vue, or anything else…" reads through the version string.

Park it somewhere that isn't over the content, or give it a solid background and keep it in a corner that the cards don't use. It should not track the scroll across the whole homepage.
