# Instructions: `add-descriptions-and-tags`

**Plan:** `integrate-purrtrait-and-shiki`

**Iteration Id:** `add-descriptions-and-tags`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-integrate-purrtrait-and-shiki/instructions/add-descriptions-and-tags__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-descriptions-and-tags`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable      | Resolved Path                      | Purpose                                       |
| ------------- | ---------------------------------- | --------------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                     |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | Artificials checkout — implementation target. |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | Astro website to modify.                      |
| `$NO_COMPLY`  | `$WORKSPACE/checkouts/no-comply`   | Reference ApiScreen granularity.              |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat history, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-descriptions-and-tags`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Bring the Art MD docs to reference granularity: entity descriptions and tags, per-function JSDoc descriptions with param/return entries, and per-type descriptions with member descriptions — all through `JsDocBlock.astro` with `{@link …}` resolved to `/docs/api/...` anchors — committed as `build(art-md-web): Add js doc descriptions and tags to docs.`

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment. Relevant for every step.
- ::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — `entityHref` / `packageParts` backing `makeEntityHref` and `resolveLink`. Relevant for Step 1.
- ::READ `$ART_MD_WEB/src/content.config.ts` (Source) — Collections and the loose `entities` schema (note: `tags` is carried but untyped — cast it). Relevant for Steps 1 and 2.
- ::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/components/sections/APITypesSection/APITypesSection.tsx` (Reference) — The per-type granularity being matched. Relevant for Step 4.
- ::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/components/sections/APIHelpersSection/APIHelpersSection.tsx` (Reference) — The per-function granularity being matched. Relevant for Step 3.
- ::READ `$WORKSPACE/_guide.md` (Guide) — Workspace operations and commit conventions. Relevant for the commit step.
- ::READ `$WORKSPACE/checkouts/art-md/libs/purrfiles-entities/src/createMetaService.ts` (Source) — `createMetaService(entities, { makeEntityHref })` and its `resolveLink(text): [displayName, href] | undefined` — a TUPLE, not the object shape `JsDocBlock.astro` expects. Relevant for Step 1.
- ::READ `$WORKSPACE/checkouts/art-md/libs/purrfiles-entities/src/types.ts` (Source) — `PurrfilesMetaOptions.makeEntityHref: (entity, symbol?) => string`. Relevant for Step 1.
- ::READ `$PURRTRAIT/libs/astro-components/src/components/JsDocBlock.astro` (Source) — Props (`jsdoc`, `title?`, `resolveLink?`), the empty-fragment rule, and the `FunctionJsDocData` param/returns surface. Relevant for Steps 2–4.
- ::READ `$PURRTRAIT/libs/jsdoc-renderer/src/controllers/JsDocBlockRenderer/types.ts` (Source) — `JsDocData` / `FunctionJsDocData` shapes the `jsdoc` prop receives. Relevant for Steps 2–4.
- ::READ `$ART_MD_WEB/src/components/docs/EntitySummary.astro`, `$ART_MD_WEB/src/components/docs/FunctionsSection.astro`, `$ART_MD_WEB/src/components/docs/TypesSection.astro` (Source) — The sections being extended. Relevant for Steps 2–4.
- ::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Allowed commit types, scopes, and message format. Relevant for the commit step.
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the `$PROJECT` root:

```bash
npm ci # to install dependencies.
```

If it fails, resolve the issue before proceeding with implementation.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms all docs routes render and the site still builds. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix # to fix formatting issues automatically
npx astro sync # regenerates the collection types
npm run build # runs extract, then a full static build
npm run lint # prettier check — MUST run AFTER build
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 6 — Add the `resolveLink` glue
- Step 2 / 6 — Rework `EntitySummary.astro` onto `JsDocBlock.astro` and wire the pages
- Step 3 / 6 — Add JSDoc descriptions to `FunctionsSection.astro`
- Step 4 / 6 — Add JSDoc descriptions and members to `TypesSection.astro`
- Step 5 / 6 — Verify the build and the rendered pages
- Step 6 / 6 — Commit `add-descriptions-and-tags`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 6` — Add the `resolveLink` glue

Create `$ART_MD_WEB/src/lib/meta.ts`:

- Export `createDocsResolveLink(entities: PurrfilesEntityData[]): (target: string) => { text: string; href: string } | undefined` where `PurrfilesEntityData` is imported as a type from `@noodlestan/purrfiles-entities`.
- Implementation:
  1. Build the service ONCE: `createMetaService(entities, { makeEntityHref })` — imported from `@noodlestan/purrfiles-entities`.
  2. `makeEntityHref: (entity, _symbol) => entityHref(entity.package, entity.module ?? entity.name, entity.type, entity.name)` — `entityHref` imported from `./routes`. Symbols get no fragment anchor in v1; the display name still shows the symbol.
  3. Wrap the tuple: `const resolveLink = target => { const hit = meta.resolveLink(target); return hit ? { text: hit[0], href: hit[1] } : undefined; };`.
- RULE: `makeEntityHref` MUST be passed. Without it `createMetaService.resolveLink` returns `[text, text]` — the literal target as the href — and every `{@link}` would link to itself instead of `/docs/api/...`.
- This file is resolver glue only: if you find yourself rendering markup or formatting descriptions here, STOP — rendering belongs to the purrtrait components.

### Step `2 / 6` — Rework `EntitySummary.astro` onto `JsDocBlock.astro` and wire the pages

1. Rewrite `$ART_MD_WEB/src/components/docs/EntitySummary.astro`:
   - Props become `{ jsdoc: { description?: string; tags?: Record<string, string | string[]> }; resolveLink?: (target: string) => { text: string; href: string } | undefined };`.
   - Import: `import JsDocBlock from '@purrtrait/astro-components/components/JsDocBlock.astro';`.
   - Render nothing when `!jsdoc.description` and `!jsdoc.tags` (or `Object.keys(jsdoc.tags).length === 0`).
   - Otherwise render the existing `<h2>Summary</h2>` heading followed by `<JsDocBlock jsdoc={jsdoc} resolveLink={resolveLink} />` (no `title` prop — the local `h2` keeps the heading hierarchy).

2. Wire both pages — `$ART_MD_WEB/src/pages/docs/api/[ns]/[pkg]/[mod].astro` and `$ART_MD_WEB/src/pages/docs/api/[ns]/[pkg]/[mod]/[type]/[ent].astro`:
   - In `getStaticPaths` (or the page frontmatter), collect `const all = await getCollection('entities');` and derive `const resolveLink = createDocsResolveLink(all.map(entry => entry.data as unknown as PurrfilesEntityData));`.
   - Pass `resolveLink` to `EntitySummary`, `FunctionsSection`, and `TypesSection`.
   - Replace `<EntitySummary description={description} />` with `<EntitySummary jsdoc={{ description, tags: (entry.data as { tags?: Record<string, string | string[]> }).tags ?? {} }} resolveLink={resolveLink} />` — the `entities` schema is `z.looseObject`, so `tags` is carried but untyped; cast at the use site.

### Step `3 / 6` — Add JSDoc descriptions to `FunctionsSection.astro`

- Add a `resolveLink` prop (same signature as Step 2) and pass it through.
- Per function, under the `CodeBlock.astro`: `<JsDocBlock jsdoc={fn.node} resolveLink={resolveLink} />`.
- RULE: `fn.node` is the inner function node — it carries `{ description, paramTags, returnsTag }`, exactly the `FunctionJsDocData` shape. If `tsc` balks, cast with `as FunctionJsDocData` (type import from `@purrtrait/jsdoc-renderer` or `@purrception/lang-ts` — whichever the component's types re-export), never with `any`.
- RULE: rendering gaps (a param, tag, or description the component cannot show) belong upstream — REPORT A BLOCKER. Do NOT write a local helper: the deleted `normalizeComment` / `describeFunction` style code must not come back.

### Step `4 / 6` — Add JSDoc descriptions and members to `TypesSection.astro`

- Add a `resolveLink` prop and pass it through.
- Per type, above the `CodeBlock.astro`: `<JsDocBlock jsdoc={declType.node} resolveLink={resolveLink} />`. When the node carries no description/tags the component renders nothing — that is correct, do not guard locally.
- Restore the members list from node data: for object nodes, render each member's name (with `?` when optional) and its `description` as plain text under it — the data lives on `member.description`. No type text per member: the serialized declaration in `CodeBlock.astro` already shows it. Skip members without a description.
- Keep the public/private split and headings unchanged.

### Step `5 / 6` — Verify the build and the rendered pages

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix
npx astro sync
npm run build
npm run lint
```

All MUST pass. Then confirm in `dist/`:

- `dist/docs/api/art-md/parser/index.html` shows module tags (a `jsdoc-links`/`jsdoc-tags` list or the module description markup).
- The `parse` module page shows the function description and `@param` / `@returns` entries under the function's code block.
- The `ParserConfig` type page shows its description and member descriptions.
- `{@link …}`: grep the meta data (`grep -o '{@link[^}]*}' $ART_MD_WEB/src/data/meta.json | head`) — if occurrences exist, confirm they render as `<a href="/docs/api/...">` anchors in `dist`; if none exist, record that the mechanism is wired but current data carries no occurrences.
- Breadcrumbs, entities section, routes, and the 404 fallback are unchanged (`git diff` shows no change to `DocsBreadcrumbs.astro`, `EntitiesSection.astro`, `routes.ts`, or the unknown-entity fallback).

---

#### Commit: `add-descriptions-and-tags`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(art-md-web): Add js doc descriptions and tags to docs.
```

RULE: Commit from the `$PROJECT` root on branch `main`, and stage only `$ART_MD_WEB/**` plus `$PROJECT/package-lock.json` if it changed. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit is created and NOT pushed.
- Verify that `$ART_MD_WEB/src/lib/meta.ts` contains only the resolver glue (service creation + tuple adapter) and no rendering logic.
- Verify that `EntitySummary`, `FunctionsSection`, and `TypesSection` all receive `resolveLink` from both pages, and that `createDocsResolveLink` passes `makeEntityHref`.
- Verify that no local JSDoc formatting helper exists (`grep -rn "normalizeComment\|describeFunction" $ART_MD_WEB/src` returns nothing).
- Verify that the three example pages from Step 5 render descriptions, tags, and member descriptions.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
