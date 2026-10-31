# Plan: Integrate Purrtrait and Shiki

**ID:** `integrate-purrtrait-and-shiki`

**Status:** `PLANNING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Replace the hand-rolled signature renderer in the Art MD docs with the Purrtrait rendering stack, and show descriptions and tags at module, function, and type granularity.

**Description:** `$ART_MD_WEB` consumes `@purrtrait/astro-components` (and transitively `@purrtrait/code-renderer`, `@purrtrait/js-doc-renderer`, `@purrtrait/lang-ts`, `shiki`, `marked`). `src/lib/signature.ts` is deleted. Docs components render serialized declaration code blocks with syntax highlighting, and JSDoc descriptions, tags, and links at the same granularity as the SolidJS reference — module entities only, functions and types only.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                      | Purpose                                       |
| ------------- | ---------------------------------- | --------------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                     |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | Artificials checkout — implementation target. |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | Astro website to modify.                      |
| `$PURRTRAIT`  | `$WORKSPACE/checkouts/purrtrait`   | Purrtrait monorepo — rendering packages.      |
| `$ART_MD`     | `$WORKSPACE/checkouts/art-md`      | Extraction monorepo — meta JSON source.       |
| `$NO_COMPLY`  | `$WORKSPACE/checkouts/no-comply`   | Reference ApiScreen granularity.              |

## Summary

Wire the Purrtrait Astro components into the docs section, delete `src/lib/signature.ts`, and bring the module, function, and type rendering up to reference granularity: highlighted declaration code, descriptions, tags, and resolved `{@link}` references.

## Context

### Upstream Work

| Kind        | Path                                                               | Role                                                       |
| ----------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Milestone   | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md` | Phase 4 (Docs) coordinates this plan and its dependencies. |
| Parking Lot | `$PROJECT/_backlog/_parking-lot.md`                                | Artificials actionables and follow-ups.                    |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment.
::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — Route helpers (`DOCS_ROOT = '/docs/api'`) backing `resolveLink`.
::READ `$ART_MD_WEB/src/content.config.ts` (Source) — Collections feeding the entity data this plan renders.
::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/components/sections/APITypesSection/APITypesSection.tsx` (Reference) — The per-type granularity being matched.
::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/components/sections/APIHelpersSection/APIHelpersSection.tsx` (Reference) — The per-function granularity being matched.
::READ `$WORKSPACE/_guide.md` (Guide) — Workspace operations and commit conventions.

## Scope

One application in `$PROJECT`. Only `module` entities are rendered; no `components` or `props` entities, no in-code symbol links in v1.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Consumes the Purrtrait renderers and renders the docs section.

**Changes:**

- Add `@purrtrait/astro-components` as a dependency via `file:../../../purrtrait/libs/astro-components`, plus direct dependencies on `@purrtrait/code-renderer`, `@purrtrait/js-doc-renderer`, `@purrtrait/lang-ts` (all `file:` links), `@purrception/lang-ts` (npm), `shiki`, and `marked` — the app declares every link so resolution works cross-repo (same explicit exception as the `purrfiles-entities` file link).
- Delete `src/lib/signature.ts` — every local signature helper goes; typed symbol access uses the canonical `getEntityTypes` / `getEntityFunctions` helpers from `@noodlestan/purrfiles-entities`, which the docs pages already consume.
- Rework `FunctionsSection.astro` and `TypesSection.astro` to render declaration code blocks through `CodeBlock.astro`, and descriptions, tags, and links through `JsDocBlock.astro`.
- Resolve `{@link …}` targets with `createMetaService().resolveLink` so docs links point at `/docs/api/...` routes.

**Dependencies:**

- `@purrtrait/astro-components` must exist (Plan: Astro Components).

## Execution Context

Executed from `$WORKSPACE/`. Website work happens in `$PROJECT` on branch `main`. `$ART_MD` must be built first so `@noodlestan/purrfiles-entities` and the synced `meta.json` are current.

---

## Items:

| Iteration / Instructions             | Status     |
| ------------------------------------ | ---------- |
| Iteration: Integrate Code Rendering  | `PLANNING` |
| Iteration: Add Descriptions and Tags | `PLANNING` |

### Iteration: Integrate Code Rendering

**Id:** `integrate-code-rendering`

**Status:** `PLANNING`

**Purpose:** Render serialized, highlighted declaration code instead of plain-text signatures.

**Description:** Add the Purrtrait dependencies, switch the function and type sections to `CodeBlock.astro`, and delete `src/lib/signature.ts`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add the dependencies listed in the scope; run `npm ci` from `$PROJECT`.
- Replace the manual `toDeclaredType` / `toDeclaredFunction` sweeps in `src/pages/docs/[ns]/[pkg]/[mod].astro` and `[mod]/[type]/[ent].astro` with `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities` (canonical, `kind`-filtered).
- Rewrite `src/components/docs/FunctionsSection.astro`: per function, a heading and a `CodeBlock.astro` rendering the serialized function declaration.
- Rewrite `src/components/docs/TypesSection.astro`: per type, a heading (with `(private)` suffix) and a `CodeBlock.astro` rendering the serialized declaration; keep the public/private split.
- Delete `src/lib/signature.ts` entirely — including the `paramTags` / `returnsTag` extensions `fix-docs-rendering` added (`d931b76`), treated as throwaway — and update every import that referenced it.
- Verify: `npx astro sync`, `npm run build`, `npm run lint` from `$ART_MD_WEB`; confirm the `dist/docs/api/` pages contain highlighted code and that no `src/lib/signature.ts` file or `signature` import remains.

**Dependencies:**

- Iteration: Add Astro Code Block (Plan: Astro Components).

#### Commits:

| ID                         | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| -------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `integrate-code-rendering` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `integrate-code-rendering`

**Message:**

```text
build(art-md-web): Integrate purrtrait code renderer and shiki.
```

### Iteration: Add Descriptions and Tags

**Id:** `add-descriptions-and-tags`

**Status:** `PLANNING`

**Purpose:** Show descriptions, tags, and links at module, function, and type granularity.

**Description:** Bring the docs pages to reference granularity: entity summary with description and tags, per-function description with param/return tags, per-type description with tags and member descriptions.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Rework `src/components/docs/EntitySummary.astro` into a `JsDocBlock.astro` consumer: entity `description` and `tags`, with `resolveLink` wired from `createMetaService().resolveLink` so `{@link …}` targets become `/docs/api/...` anchors; keep rendering nothing when empty.
- Extend `src/components/docs/FunctionsSection.astro`: per function, render the JsDoc description and the `paramTags` / `returnsTag` entries under the code block — through the js-doc-renderer params/returns surface; if that coverage is missing, the gap is closed in Plan: Add JS Doc Renderer Package or Plan: Astro Components, never as a local helper.
- Extend `src/components/docs/TypesSection.astro`: per type, render the JsDoc description and tags above the declaration block, and each object member's `description` under its name (data already carried by the declaration node).
- Keep breadcrumbs, entities section, routes, and the 404 fallback unchanged.
- Verify: `npm run build` and `npm run lint` from `$ART_MD_WEB`; confirm `dist/docs/api/art-md/parser/index.html` shows the module tags, the `parse` page shows the function description and param/returns entries, and the `config` page shows `ParserConfig`'s member descriptions; confirm `{@link}` targets render as `/docs/api/...` anchors.

**Dependencies:**

- Iteration: Add Astro Js Doc Block (Plan: Astro Components).

#### Commits:

| ID                          | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| --------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `add-descriptions-and-tags` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `add-descriptions-and-tags`

**Message:**

```text
build(art-md-web): Add js doc descriptions and tags to docs.
```

## Work

### Next

Write instructions for Iteration: Integrate Code Rendering once Plan: Astro Components iteration 1 lands, then delegate.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$PROJECT/_guide.md` and the Art MD Docs plan)

Run from `$ART_MD` — the canonical check, which rebuilds `$ENTITIES/dist/` and regenerates the meta JSON:

```bash
npm run ci
```

Run from `$PROJECT`:

```bash
npm ci
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms all docs routes render and the site still builds.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix # to fix formatting issues automatically
npx astro sync # regenerates the collection types
npm run build # runs extract, then a full static build
npm run lint # prettier check — MUST run AFTER build
```

---

## Coordination

### Not In Scope

- **`components` and `props` entities** — only `module` entities render in v1.
- **In-code symbol links** — token links inside serialized code deferred with Plan: Astro Components.
- **Search and sidebar** — already tracked as follow-ups of Plan: Art MD Docs.
- **Publishing** — no npm release; the file: link exception stands while the purrtrait packages live in their checkouts.

### Evidence

- None yet.

### Decisions

- **All signature rendering vanishes** — `src/lib/signature.ts` is deleted whole, including the `paramTags` / `returnsTag` extensions from `fix-docs-rendering` (`d931b76`), treated as throwaway; signature and JSDoc rendering move to `@purrtrait/astro-components`.
- **Canonical helpers own typed access** — `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities` filter on `kind`; no local narrowing anywhere.
- **Routes live under `/docs/api`** — `DOCS_ROOT = '/docs/api'` (`Nest Docs Under API`, `c4a6859`) is this plan's route ground truth; `resolveLink` anchors target `/docs/api/...`.
- **Gaps belong upstream** — if tag, description, param, or member rendering is missing while porting the ApiScreen sections, the fix lands in the purrtrait plans, not in `$ART_MD_WEB`.
- **Direct file: deps for every linked package** — cross-repo `file:` links do not resolve transitive workspace deps, so the app declares each one (precedent: `@noodlestan/purrfiles-entities`).
- **Descriptions render as markdown** — the reference app renders them as plain text; Astro renders markdown so resolver-produced links become real anchors.

### Follow Ups

- Render in-code symbol links once supported by the Astro components.
- Revisit the file: link exception when the purrtrait packages are published.

### Feedback

- None yet.
