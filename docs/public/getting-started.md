# Getting started

Install the kit and put a class on a button.

You write the HTML. Classes that start with `k-` get the kit look. JavaScript is only there for widgets CSS cannot do, such as tabs and pagination. If an element has no `k-` class, the kit leaves it alone.

Every docs page has a `.md` twin. Copy it from the button at the top, start at [/llms.txt](/llms.txt), or take [/llms-full.txt](/llms-full.txt) in one request.

## Install

```bash
pnpm add k-web-ui
```

## CSS

This one import is the full prebuilt stylesheet. You do not need Tailwind for it:

```js
import 'k-web-ui';
```

Or pull the layers in separately:

```js
import 'k-web-ui/base';
import 'k-web-ui/components';
import 'k-web-ui/utilities';
```

`base` is colors, fonts, icon masks, and the focus ring. See [Colors](/foundations/colors/), [Typography](/foundations/typography/), and [Styles](/foundations/styles/) for the tokens. `components` is the UI pieces. `utilities` is a small set of helpers such as `bg-k-primary`. Components expect `base` to be imported first.

If you already compile Tailwind, import the source and let the compiler omit what you did not use:

```js
import 'k-web-ui/source';
```

## Markup

Classes are tied to the element. A button is a `<button>` with `.k-btn`, not a `div` you styled to look like one.

```html
<button type="button" class="k-btn k-btn--primary">Save</button>
<button type="button" class="k-btn k-btn--secondary">Cancel</button>
```

## Theme

One attribute on the document root:

```html
<html data-theme="light">
```

`light`, `dark`, or `auto` (follows the OS). The orange on buttons and fields stays the same. The page background and text change.

## JavaScript

A few widgets need you to leave an empty element on the page and call `mount`:

```html
<div id="pages" class="k-pagination"></div>
```

```js
import { KPagination } from 'k-web-ui/js';

KPagination.mount('pages', { count: 12, page: 5 });
```

Accordion, grid, modal, sidebar, spin, table, toast, and tooltip are CSS only. You write the markup and skip `mount`.
