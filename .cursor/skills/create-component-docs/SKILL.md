---
name: create-component-docs
description: >
  Write or update a component documentation page in the k-web-ui docs: the
  Starlight .mdx page, its plain-markdown twin under docs/public, and the
  sidebar entry. Use when adding, editing, or reviewing component docs, a
  DocTable, an Example block, the CSS or JS badge, or when the user asks to
  document a component or fix a docs page.
---

# Write a component docs page

Every component in the kit has two documentation files that say the same thing in two formats. Getting one right and forgetting the other is the failure this skill exists to prevent.

Read `docs/src/content/docs/components/badge.mdx` before writing a CSS page and `tabs.mdx` before writing a JS page. They are the pages the rest were shaped against.

## Files to touch

Editing an existing page is the first two. A brand new page is all five.

```
- [ ] docs/src/content/docs/components/<name>.mdx  the rendered page
- [ ] docs/public/components/<name>.md             the plain-markdown twin
- [ ] docs/astro.config.mjs                        sidebar entry
- [ ] docs/public/llms.txt                         index entry, title + description
- [ ] docs/src/pages/llms-full.txt.ts              add the twin to the PAGES array
```

The twin is not decoration. `PageTitle.astro` puts a "Copy markdown" button on every page that fetches `${path}.md`, so a missing or stale twin means the button hands the reader the wrong page. Edit both in the same pass, every time.

The last two are easy to miss because nothing visibly breaks. `llms.txt` is a hand-written index, and `llms-full.txt.ts` concatenates a hardcoded list of twins into one response. A page left out of either is invisible to anything reading the docs through those routes. `llms-full.txt.ts` reads each file with `readFileSync`, so listing a twin you have not written yet fails the build, which is the one part of this that checks itself.

## Frontmatter

```yaml
---
title: Badge
description: span.k-badge. Color, style, size.
kind: css
---
```

`description` is the selector, then a few words on what varies. It shows under the title and in search results, so it is a label rather than a sentence.

`kind` is either `css` or `js`, and it draws the badge beside the page title: a yellow **JS** or a blue **CSS**. Component pages always carry it. Leave it off anything that is not a component, which is why Getting started and the Foundations pages have no badge.

## Section order

Fixed, because readers move between pages and learn where to look. A CSS page runs:

```
## Classes
## Examples      (one ### per state worth seeing)
## Accessibility
## Dos and don'ts
```

A JS page adds three reference tables in the middle:

```
## Classes
## Attributes
## Properties
## Methods
## Examples
## Accessibility
## Dos and don'ts
```

Before the tables, both kinds open the same way: an intro paragraph saying what the component is for and what to use instead when it is the wrong pick, then a usage paragraph naming the element and the classes or attributes that drive it.

A JS page adds one more paragraph covering behavior: what the element generates, and **which attribute changes patch versus which rebuild**. That sentence is the one consumers need most and the one most often left out. Tabs puts it plainly: changing `panels` rebuilds the tablist; changing `selected`, `size`, `label`, or `keyboard` does not.

Follow the tables on a JS page with a line on the event. Programmatic calls and clicks fire `k-change`; attribute changes do not, so an app can drive the element from its own state without a loop.

## The `Classes` table on a JS page has one row

Only the block class in `rows`. A JS component generates its own parts, so `k-tabs__tab` is not something a consumer writes and does not belong in a table of classes they do. Describe the row as the one class you write, and say what the element builds inside it.

Pass those generated parts as `generated` on the same `DocTable`. That draws a closed accordion under the table, with a second Class / Type / Description table for restyling. Leave `generated` off on CSS pages and on the Attributes, Properties, and Methods tables. An omitted or empty `generated` array is the default: no accordion.

The twin lists them under a **Generated classes** heading so copy-markdown still has the selectors.

CSS pages list everything: the block, its parts, and its modifiers.

## Tables

`DocTable` takes `columns` and `rows`. Column sets by table:

| Table | Columns |
| --- | --- |
| Classes | Class, Type, Description |
| Attributes | Attribute, Type, Default, Description |
| Properties | Property, Type, Description |
| Methods | Method, Returns, Description |

The `Type` column on a Classes table uses a fixed vocabulary, listed in this order: `component` for the block, `part` for a `k-name__thing` child, `variant` for a color, `style` for a fill treatment, `modifier` for everything else including sizes.

From `docs/src/components/DocTable.astro`:

- The first cell of every row renders inside `<code>`, so do not add backticks there.
- An empty cell renders an em dash. Pass `''` for "no default" rather than writing one.
- Every other cell is plain text, not markdown. Backticks in them show up literally.
- `generated` is an optional second set of rows. Same columns. Off by default.

Write a method that takes an options object in its destructured form: `next({ wrap, focus })`.

## Examples

```mdx
<Example html={`<span class="k-badge">New</span>`}>
  <span class="k-badge">New</span>
</Example>
```

The `html` prop is the source the reader copies. The children are what renders. **They must match**, and keeping them in sync by hand is the price of the component, so re-check both whenever you touch either.

Two optional props: `stack` lays the preview out vertically, `lift` raises it onto a panel. Use `stack` for anything full-width.

Prefer single quotes inside the `html` template literal. Backticks there need escaping and are easy to get wrong.

On a JS page, the children are usually the demo component rather than raw markup, since the element needs the JS import:

```mdx
<Example stack html={`<k-tabs class="k-tabs" panels='[...]'></k-tabs>`}>
  <TabsDemo />
</Example>
```

## The markdown twin

Same prose, translated. Full templates are in [references/templates.md](references/templates.md); read it before writing either file.

The rules that are easy to miss:

- Open with an H1 of the title, then the kind line, then the frontmatter description as a plain line. The kind line is **CSS component.** No JavaScript needed. or **JS component.** Import `k-web-ui/js` once and the element writes the inside.
- Every `DocTable` becomes a markdown table, with an em dash where a cell was empty.
- `generated` on a Classes table becomes a **Generated classes** heading and a second markdown table.
- Every `Example` becomes a fenced html block holding only the `html` prop.
- Drop the imports and the frontmatter.
- Escape `|` inside a cell as `\|`. Union return types like `HTMLElement \| null` need it.
- Wrap bare element names in backticks where the mdx left them plain, since the twin is read as markdown.

## Voice

Short declarative sentences. Second person when instructing: "Put `.k-badge` on a `span`." Say what a thing is for, then what to use instead when it is wrong, and link that alternative.

State defaults as facts. "Leave the size off and you get 1.5rem." No hedging, no "simply", no "just".

The Dos and don'ts section is two bolded lists, **Do** then **Don't**, three or four items each. Make them specific enough to act on: "Give the host an `id` when more than one is on the page" beats "follow accessibility best practices".

## Verify

```bash
pnpm lint:fix
pnpm format:check
pnpm build:docs
```

`pnpm build:docs` catches bad frontmatter, a sidebar slug that points nowhere, and a twin named in `llms-full.txt.ts` that does not exist. It does not catch a stale twin, a page missing from `llms.txt`, or a class in a table that no longer exists in the stylesheet. Check those by reading.

Last, open the page and press Copy markdown. What lands on the clipboard should be the page you just wrote.

## Additional resources

- Full page templates, both kinds and both files: [references/templates.md](references/templates.md)
- CSS reference page: `docs/src/content/docs/components/badge.mdx`
- JS reference page: `docs/src/content/docs/components/tabs.mdx`
- Scaffolding a whole component: `create-css-component`, `create-js-component`
