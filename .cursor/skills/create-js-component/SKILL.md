---
name: create-js-component
description: >
  Scaffold a new custom element in the k-web-ui kit following the
  index/controller/dom/events/keybinds layering: the element class, its
  controller, specs, stylesheet, barrel export, Storybook story, docs demo,
  both docs pages, and the API.md entry. Use when adding, creating, or
  scaffolding a JS component, a custom element, or a component that generates
  its own DOM or holds state.
---

# Create a JS component

A JS component is a real custom element in the light DOM. There is no shadow root, so the consumer's stylesheet, `querySelector`, and devtools all reach inside normally. The consumer writes one tag with a couple of attributes and the element writes its own children.

Reach for this only when the component must generate children or hold state. If a class on existing HTML would do, use `create-css-component`.

Use `tabs` as the reference implementation; it exercises every layer. `gauge` is the outlier, with no events or keybinds.

## Files to touch

```
js/<name>/ below is short for package/src/components/js/<name>/

- [ ] js/<name>/models/models.ts             item, options, and State types
- [ ] js/<name>/dom/dom.ts + dom.test.ts     build and paint
- [ ] js/<name>/events/events.ts + test      listeners and state transitions
- [ ] js/<name>/keybinds/keybinds.ts + test  keydown only
- [ ] js/<name>/controller/controller.ts     parsing, init, applyAttribute
- [ ] js/<name>/controller/controller.spec.ts
- [ ] js/<name>/index.ts + index.test.ts     the element and its public API
- [ ] package/src/components/js/index.ts     barrel exports
- [ ] package/src/components/css/<name>.css  the visual layer
- [ ] package/src/components/index.css       @import the stylesheet
- [ ] dev-env/stories/<name>.stories.ts      Storybook story
- [ ] docs/src/components/<Name>Demo.astro   live demo for the docs page
- [ ] docs/src/content/docs/components/<name>.mdx  docs page, kind: js
- [ ] docs/public/components/<name>.md       its markdown twin
- [ ] docs/astro.config.mjs                  sidebar entry
- [ ] API.md                                 consumer reference
```

Skip `keybinds` only when the component genuinely has no keyboard interaction.

## The layer contract

This is the part to get right. Each file has one job, and the boundaries are what keep the element readable.

**`index.ts` is the public API and nothing else.** It holds the element class, `defineElement`, and the `HTMLElementTagNameMap` augmentation. Every member is either a lifecycle callback or something a consumer calls, and each delegates to the controller in one to three lines. No parsing, no DOM building, no `switch` on attribute names. Its only imports are `defineElement` from `../root.js`, functions from `./controller/controller.js`, and types from `./models/models.js` — never from `dom`, `events`, or `keybinds` directly.

**`controller/controller.ts` is the plumbing that used to clutter the index.** Attribute parsing and serialization, the real `init()`, the `applyAttribute()` patch router, and the read helpers behind the public API. It composes `dom`, `events`, and `keybinds`, and re-exports the handful of their functions that `index.ts` needs so the index never reaches past it.

**`dom/dom.ts` builds and paints.** Creates the subtree, sets ARIA, writes styles. No listeners.

**`events/events.ts` binds listeners and owns state transitions.** The functions that actually change what is selected or showing live here, because both the listeners and the controller call them.

**`keybinds/keybinds.ts` binds keydown only.** It calls into `events` for the transitions.

**`models/models.ts` holds the types.** The item type, the options type, and the `State` type the other layers pass around.

Full contracts and copy-ready templates for each file: [references/architecture.md](references/architecture.md). Read it before writing any of them.

## Shared helpers

Import these from `package/src/components/js/root.ts` rather than reimplementing them:

| Helper | Use |
| --- | --- |
| `defineElement(tag, ctor)` | Guarded `customElements.define` |
| `parseJsonList(raw, name)` | Parses a JSON array attribute, throws `"<name>: invalid JSON"` |
| `fill(node, content)` | Writes a string as text or replaces children with a `Node` |
| `emitKChange(host, detail)` | Dispatches the bubbling `k-change` event |
| `insertAt` / `removeAt` / `patchAt` | Immutable item-list edits for add/remove/update methods |
| `resolveRoot(target, name)` | Accepts an element or an id string |

## The standard API surface

Consumers expect the same shape from every element in the kit. Provide what applies:

- A **content property** (`panels`, `slides`, `options`) that is read/write and reflects to its JSON attribute. Accept a `Node` where it makes sense and keep node values out of the attribute.
- `count` — number of items. Read it from the attribute so it works before the element connects.
- Node getters: `getX(index)` returning `null` past the end, and a plural `getXs()` returning a copy.
- Movement: `next()` / `previous()` / `first()` / `last()`, plus `select(index)` or `goTo(index)`.
- Read state: `getSelected()` returning the index with its live nodes, and booleans like `hasNext`.
- List edits: `addX(item, at?)` / `removeX(index)` / `updateX(index, patch)`, all writing through the content property.
- `refresh()` — rebuild from current inputs.
- `disconnect()` — abort listeners without removing the element. Omit it only if the component binds nothing.

Every command must be inert while disconnected, and every read must return `null` or `[]`. Test that.

## Behavioral rules

**One event.** Dispatch `k-change` via `emitKChange`. Programmatic calls and user interaction emit; attribute changes do not, so an app can drive the element from its own state without a feedback loop.

**Config patches, content rebuilds.** Route scalar attributes (`selected`, `index`, `page`, `label`) through `applyAttribute` so focus, scroll, and running animations survive. Content attributes (`panels`, `slides`, `options`) rebuild the subtree.

**One `AbortController` per connect.** Abort it before rebuilding and pass its signal to every listener. Reset it in `disconnectedCallback`.

**Guard property-to-attribute reflection** with a `#reflecting` flag so the setter's own `setAttribute` does not trigger a rebuild.

**Derive child ids from the host** as `` `${root.id || 'k-<name>'}-part-${i}` ``. Document that consumers need an `id` when more than one instance is on a page.

**Empty input is a no-op.** No content list means render nothing and stay inert. Malformed JSON throws.

## Verify

```bash
pnpm lint:fix
pnpm format:check
pnpm typecheck
pnpm test
pnpm build:docs
pnpm build:storybook
```

Vitest globs both `*.test.ts` and `*.spec.ts` under `src/components/js`, per `package/vite.config.ts`. Tests run on happy-dom. If a new spec file seems to pass suspiciously fast, check that glob before trusting it.

Starlight warns about a missing `i18n` collection and a missing `404` entry on every build. Both are pre-existing and unrelated.

After the build, read the generated `package/dist/js/<name>/index.d.ts` and confirm the declared surface is what you meant to publish. It is the fastest way to catch a method you forgot to expose or a type you leaked.

## Additional resources

- Layer contracts and file templates: [references/architecture.md](references/architecture.md)
- Story, demo, and the API.md entry: [references/story-demo-api.md](references/story-demo-api.md)
- The two docs pages: the `create-component-docs` skill
- Reference implementation: `package/src/components/js/tabs/`
- Consumer-facing API reference to extend: `API.md`
