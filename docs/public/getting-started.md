# Getting started

Install the kit and put a class on a button.

You write the HTML. Put a `k-` class on it and it picks up the kit look. Most of this kit is CSS, so a lot of the time that's all you need. JavaScript only shows up for widgets CSS can't do, like tabs and pagination. No `k-` class? The kit leaves that element alone.

Every docs page has a `.md` twin. Copy it from the button at the top, start at [/llms.txt](/llms.txt), or grab [/llms-full.txt](/llms-full.txt) in one request.

## Install

```bash
pnpm add k-web-ui
```

That writes it into `package.json` and installs it into `node_modules`. Import the sheet once, in your CSS:

```css
@import 'k-web-ui';
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
<html data-theme="k-light">
```

`k-light` or `k-dark`. Orange on buttons and fields stays put. Background and text flip. Override those tokens, or add a name of your own, in [How it works](/how-it-works.md). The [Theme playground](/theme-playground/) is there if you want to poke at values first.

## JavaScript

Six widgets are custom elements: tabs, pagination, dropdown, carousel, gauge, and scrollbar. Put the tag on the page with its inputs, import the JS once, and the element writes the inside.

```html
<k-tabs
  class="k-tabs"
  label="Sections"
  panels='[{"label":"Overview","content":"The first panel."},{"label":"Usage","content":"The second panel."},{"label":"API","content":"The third panel."}]'
></k-tabs>
```

A progress bar is `<progress class="k-progress">`. Accordion, grid, modal, sidebar, spin, table, toast, and tooltip are CSS only. You write the markup and skip the JS import.
