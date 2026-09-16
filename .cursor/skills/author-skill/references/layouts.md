# Section layouts

Two skeletons. Copy the one matching the archetype and fill it in.

## Scaffolding skill

For a skill whose job is producing a known set of files. The risk it manages is an incomplete job — a component that works but never got registered in the sidebar.

Sections in order:

1. **Opening, two or three paragraphs.** What the thing is, stated by its defining property rather than its category. When to reach for it, when not, and a pointer to the sibling skill that handles the other case. Which existing code to read as the reference implementation, plus any outlier worth flagging.
2. **`## Files to touch`.** The checklist. Conventions below.
3. **The domain rules.** One or more sections of bolded lead-in rules. Name them for the domain (`## The layer contract`, `## Step 1: the stylesheet`), not generically.
4. **`## Verify`.** Real commands, what each catches, and which warnings to ignore.
5. **`## Additional resources`.** Links to `references/`, then paths to the reference implementation in the codebase.

````md
---
name: create-thing
description: >
  Scaffold a thing: <the concrete deliverables, named>. Use when <the phrasings
  you would actually type, including the lazy one>.
---

# Create a thing

<What it is, by its defining property. "A real custom element in the light DOM.
There is no shadow root, so the consumer's stylesheet reaches inside normally.">

<Reach for this only when <condition>. If <simpler case>, use `sibling-skill`.>

<Use `x` as the reference implementation. `y` is the outlier, with no <part>.>

## Files to touch

```
- [ ] path/to/first.ts      what it holds
- [ ] path/to/second.css    what it holds
```

<What is optional, and under exactly what condition.>

## The domain rules

**A rule, as an imperative.** Why it exists, and the failure mode it prevents.

**Another rule.** Its reason.

Full contracts and copy-ready templates: [references/topic.md](references/topic.md).
Read it before writing any of them.

## Verify

```bash
pnpm lint:fix
pnpm typecheck
```

<Which command catches which class of mistake. Which warnings are pre-existing.>

## Additional resources

- Templates: [references/topic.md](references/topic.md)
- Reference implementation: `path/to/example/`
````

### The "Files to touch" checklist

A plain fence holding `- [ ]` lines, each with an inline note on what the file holds.

**Order by dependency, not alphabetically.** List them in the order someone should write them, so the list doubles as the plan. `create-js-component` goes models, dom, events, keybinds, controller, index, because each layer only imports from the ones before it.

**Abbreviate a repeated long prefix** and say so on the line above, so the purpose notes stay aligned and readable:

```
js/<name>/ below is short for package/src/components/js/<name>/

- [ ] js/<name>/models/models.ts   item, options, and State types
- [ ] js/<name>/dom/dom.ts + test  build and paint
```

**Say that every entry is required, and name the failure mode.** "Every one is required; a component that skips the docs mirror or the sidebar entry ships broken." Without that line the agent treats the tail of the list as optional.

**Follow the list with the real exceptions.** "Skip `keybinds` only when the component genuinely has no keyboard interaction."

## Judgment skill

For a skill whose job is applying taste or rules to material that already exists. The risk it manages is a miss — failing to recognize a pattern, or replacing it with something equally bad.

Sections in order:

1. **Opening.** State the role and the single job. Then a paragraph on what good output looks like, so the agent has a target rather than only a list of prohibitions.
2. **`## When to Use` / `## When NOT to Use`.** Two bullet lists. The second matters more; it is what stops the skill firing on a README.
3. **`## Before You Start`.** What to read first, and any choice to resolve before acting.
4. **The process, broken into named passes.** Ordered, with a reason for the order. Each pattern gets a bolded lead-in, the reason it is a problem, and a `Bad:` / `Good:` pair.
5. **`## Quality Checklist (Run Before Returning)`.** `- [ ]` items, one per rule above, each mechanically checkable.
6. **`## What to Protect`.** What must survive the edit. This is what keeps the skill from overcorrecting.

````md
---
name: judge-thing
description: >
  Use when <trigger>, says <the phrasing a user would actually use>, or asks to
  <verb> a <artifact>. Also applies to <adjacent cases>.
---

# Judge Thing

You're a <role>. Your one job is <the single outcome>.

<What good output looks like, so there is a target and not just prohibitions.>

## When to Use
- <Trigger>
- <Trigger>

## When NOT to Use
- <The case this must not fire on>
- <Another>

## Before You Start

Read `references/<lookup>.md` in this skill's directory. That's your playbook.

## The Process

Work through it in <n> passes. Don't try to do everything at once.

### Pass 1: <name>

<What this pass scans for and what it does.>

**A pattern.** Why it is a tell, and what to replace it with.
Bad: "<the pattern>"
Good: "<the fix>"

## Quality Checklist (Run Before Returning)

- [ ] <Mechanically checkable claim>
- [ ] <Another>

## What to Protect

<What must survive the edit, and the overcorrection to avoid.>
````

### The quality checklist

**One item per rule stated above.** The checklist is the rules made auditable, not a new set.

**Make each item checkable without judgment.** "Every class in the table exists in the stylesheet" can be verified. "The page reads well" cannot.

**Put it before the output, not after.** The heading says "Run Before Returning" for a reason.

## Shared conventions

These apply to both archetypes.

**Tables for short enumerable facts only.** A helper-to-purpose mapping or an archetype comparison. Explanations belong in prose around the table, not inside a cell.

**Hypothetical subjects in templates.** `breadcrumb`, `k-steps`. Never a real component name, or the template gets mistaken for documentation and copying it produces a duplicate.

**Concrete over abstract in examples.** `nav.k-breadcrumb`, `pnpm build:docs`, `--k-badge-size`. A placeholder like `<selector>` teaches nothing that the surrounding sentence did not already say.

**Number steps only when order is load-bearing.** `create-css-component` numbers its steps because the stylesheet has to exist before the import resolves. `create-js-component` names its sections instead, because the layer contract is a set of rules rather than a sequence.
