---
name: author-skill
description: >
  Write a new skill for this repo in the house format: frontmatter, the
  scaffolding or judgment layout, references/ for long templates, and a
  grounding pass that verifies every claim against real code. Use when
  creating, authoring, or restructuring a skill, writing a SKILL.md, or asking
  how the skills in this repo are organized.
---

# Author a skill

A skill is instructions the agent loads on demand. It exists to carry the things the agent cannot infer from reading one file: which six places a component has to be registered, which convention prevents which bug, which script actually runs the docs build.

Cursor ships a built-in `create-skill` that covers the general mechanics — frontmatter fields, storage locations, progressive disclosure, why descriptions matter. Read it if you need that background. This skill covers the format layered on top, so every skill in this repo reads the same way.

Two worked examples live in `.cursor/skills/`, both of them scaffolding skills. Read the closer one before you start.

## Where it goes

```
.cursor/skills/<name>/SKILL.md
.cursor/skills/<name>/references/<topic>.md   optional
```

Project-scoped, so the skill ships with the repo and works for anyone who clones it. The directory name and the `name` field must match, both kebab-case.

Never write to `~/.cursor/skills-cursor/`. That directory is Cursor's own and is managed for you.

### Whitelist it in `.gitignore`

`.cursor/skills/*` is ignored, so a new skill directory is invisible to git until you re-include it. Add a line, keeping the list alphabetical:

```
!.cursor/skills/<name>/
```

Skip this and the skill still loads locally and reports no error — it just never reaches the repo, which was the reason for writing it down. Do it when you create the directory, not at the end.

The catch-all exists because other tools drop skills into that directory. Only the kit's own skills are versioned.

## Step 1: pick the archetype

Two shapes, and the choice determines every section that follows. Decide before you write a line.

| Archetype | For | In this repo |
| --- | --- | --- |
| **Scaffolding** | Producing a known set of files | `create-css-component`, `create-js-component` |
| **Judgment** | Applying taste or rules to material that already exists | None yet; start from the skeleton |

A scaffolding skill's job is completeness: the agent must touch all sixteen files and forget none. A judgment skill's job is discrimination: the agent must recognize a pattern and know what to replace it with.

Section-by-section layouts for both: [references/layouts.md](references/layouts.md). Read it before drafting.

## Step 2: frontmatter

```yaml
---
name: create-css-component
description: >
  Scaffold a new CSS-only component in the k-web-ui kit: the stylesheet, its
  import, a Storybook story, both docs pages, and the sidebar entry. Use when
  adding, creating, or scaffolding a CSS component, a class-only component, or
  a component that needs no JavaScript, and when the user names a new kit
  component such as "add a breadcrumb component."
---
```

**Use the folded `>` block for the description.** Every skill here does, and it keeps the line length readable.

**Name the deliverables, not the category.** "Scaffold a CSS component" is a category. "the stylesheet, its import, a Storybook story, both docs pages, and the sidebar entry" tells the agent what it is committing to. The description is the only thing loaded before the skill is chosen, so it has to carry the weight.

**Write the trigger phrasings you would actually type**, including the lazy one. `create-css-component` lists `add a breadcrumb component` because that is what you will say in six months, not "scaffold a class-only component."

**Write it in third person.** It gets injected into a system prompt. "Scaffold a new component", not "I can help you scaffold."

**Omit `disable-model-invocation`.** Every skill in this repo auto-invokes, which is the point — you say "add a breadcrumb component" and the skill fires. Add `disable-model-invocation: true` only for something destructive or expensive enough that it must never fire on its own.

## Step 3: ground every claim

The most common way a skill goes wrong is stating a convention that is almost true. A skill is worse than no skill when it confidently names a script that does not exist.

Before writing any factual claim, open the thing and check it:

- **Commands**: read `package.json` and use the script the repo defines. `pnpm lint:fix` is the house command; reaching past it for `npx biome check --write .` happens to run the same thing today and silently drifts the day the script changes.
- **Helper behavior**: read the function. `DocTable` renders the first cell as `<code>` and an empty cell as an em dash — worth documenting, and not guessable from the name.
- **Import boundaries**: grep the imports. "`index.ts` imports only the controller" was wrong; it also imports its own model types.
- **File lists**: glob the directory rather than recalling it.

Cite real paths so the next reader can check you. When a rule has an exception, name it: `create-js-component` says to use `tabs` as the reference and flags `gauge` as the outlier with no events or keybinds.

## Step 4: earn each rule

A convention belongs in a skill only when it is **non-obvious from reading one reference file**.

Include it when skipping it causes a bug the agent would not see coming: wrap CSS in `@layer components`, check `state.keyboard` inside the handler so the attribute can be toggled live, clear the cached item list before the `isConnected` check.

Leave it out when the formatter or the type checker already enforces it, or when copying the reference file gets it right for free.

State each rule as a bolded lead-in sentence, then the reason. The reason is what lets the agent generalize when your example does not quite fit.

```md
**Qualify the block selector with its element.** `nav.k-breadcrumb`,
`button.k-btn`, `span.k-badge`. This is what keeps the kit from styling the
wrong tag, and it is why every existing file reads this way.
```

Name the failure mode, not just the rule. "Give every host a distinct `id`" is a rule. "Generated child ids derive from it, so two id-less hosts on one docs page collide" is a rule someone will follow.

## Step 5: split long material into references/

Keep `SKILL.md` under roughly 200 lines. When a template or a lookup table would blow past that, move it:

```
.cursor/skills/<name>/references/<topic>.md
```

**One level deep only.** Link from `SKILL.md` with a relative markdown link and never from one reference to another.

**Split by when the material is needed**, not by size. `create-js-component` has `architecture.md` for writing source and `docs-and-story.md` for writing docs, because those are two different moments in the task.

**Tell the agent to open it.** A bare link gets skipped. "Read it before writing either file" does not.

## Step 6: mind the fences

Skills are markdown that contains markdown, and this bites every time. Two rules:

**A fence that contains a fence needs more backticks than the one inside it.** A template for a `.md` file that itself contains an html block needs a four-backtick outer fence:

`````md
````md
# Breadcrumb

```html
<nav class="k-breadcrumb">…</nav>
```
````
`````

**Inline code containing backticks needs a longer delimiter and padding spaces.** Writing a literal triple backtick inside single backticks silently breaks the rest of the document. Prefer rewording to avoid it: "a fenced html block" reads fine and cannot break.

## Verify

Check the fences pair up. Every line that opens a block must have a matching closer at the same backtick count:

```bash
rg -n '^`{3,}' .cursor/skills/<name>/
```

Check that git can see the skill. Empty output means it is still ignored and the `!` line is missing or misspelled:

```bash
git status --short --untracked-files=all -- .cursor/skills/<name>/
```

Then confirm:

- `SKILL.md` is under ~200 lines, references may run longer
- `name` matches the directory
- Every relative link resolves and is one level deep
- No claim went in unverified

Last, use it. Run the skill against a real task and watch where the agent hesitates or guesses. That gap is the section you still owe.

## Voice

Match the repo's documentation voice, the same one the component docs use. Short declarative sentences. Second person for instructions. Explain the why behind a convention rather than only asserting it.

Use a hypothetical subject in templates — `create-css-component` uses `breadcrumb`, `create-js-component` uses `k-steps` — so the template can be copied wholesale without colliding with a real component, and so nobody mistakes the example for documentation of something that exists.

Skip the emoji, the "Note that", and the "It's important to."

## Additional resources

- Layouts for both archetypes: [references/layouts.md](references/layouts.md)
- Scaffolding examples: `.cursor/skills/create-css-component/`, `.cursor/skills/create-js-component/`
- Generic skill mechanics: Cursor's built-in `create-skill`
