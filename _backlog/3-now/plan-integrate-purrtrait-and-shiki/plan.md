# Plan: Integrate Purrtrait and Shiki

**ID:** `integrate-purrtrait-and-shiki`

**Status:** `READY`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Replace the hand-rolled signature renderer in the Art MD docs with the Purrtrait rendering stack, and show descriptions and tags at module, function, and type granularity.

**Description:** `$ART_MD_WEB` consumes `@purrtrait/astro-components` (and transitively `@purrtrait/code-renderer`, `@purrtrait/jsdoc-renderer`, `@purrtrait/lang-ts`, `shiki`, `marked`). `src/lib/signature.ts` is deleted. Docs components render serialized declaration code blocks with syntax highlighting, and JSDoc descriptions, tags, and links at the same granularity as the SolidJS reference — module entities only, functions and types only.

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
| `$PURRFILES`  | `$WORKSPACE/checkouts/purrfiles`   | Purrfiles repository — packages move here.    |
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

The website work in `$PROJECT` ships the rendering. Getting there and then off the temporary links runs across three more repositories: `$PURRTRAIT` (publish the renderers), `$ART_MD` (publish the purrfiles packages), and the workspace records (move them home). Only `module` entities are rendered; no `components` or `props` entities, no in-code symbol links in v1.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Consumes the Purrtrait renderers and renders the docs section.

**Changes:**

- Add the dependencies below to `$ART_MD_WEB/package.json`, exact-pinned per `_ops/packages/policy.md`. Pin from npm wherever the package is published; keep a `file:` link only where it is not yet published, and declare each linked package directly because cross-repo `file:` links do not resolve transitive workspace deps:

  | Dependency                    | Version                                         | Why                                                                                                                              |
  | ----------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
  | `@purrtrait/astro-components` | `file:../../../purrtrait/libs/astro-components` | Delivered by Plan: Astro Components but not yet published; `file:` until `publish-purrtrait-renderers` retires it.               |
  | `@purrtrait/jsdoc-renderer`   | `0.0.2` (npm)                                   | Published by Plan: Add JSDoc Renderer Package — pinned exact from npm on day one, never linked.                                  |
  | `@purrtrait/lang-ts`          | `file:../../../purrtrait/libs/lang-ts`          | Published `0.0.11` ships a `git+ssh://…#main` dependency; the local manifest is correct, so link it until purrtrait republishes. |
  | `@purrtrait/code-renderer`    | `0.0.11` (npm)                                  | Published with no dependencies — safe to pin.                                                                                    |
  | `@purrception/lang-ts`        | `0.1.1` (npm)                                   | Already pinned exact elsewhere in the workspace.                                                                                 |
  | `shiki`                       | `4.5.0` (npm)                                   | Installed transitively via `astro` today; declared directly because `CodeBlock.astro` imports it.                                |
  | `marked`                      | `18.1.2` (npm)                                  | Descriptions render as markdown.                                                                                                 |

  This leaves three `file:` links to retire later in this plan (astro-components, `lang-ts`, and the pre-existing `purrfiles-entities`), rather than the five the `file:`-everywhere approach would have added.

- Delete `src/lib/signature.ts` — every local signature helper goes; typed symbol access uses the canonical `getEntityTypes` / `getEntityFunctions` helpers from `@noodlestan/purrfiles-entities`, which the docs pages already consume.
- Rework `FunctionsSection.astro` and `TypesSection.astro` to render declaration code blocks through `CodeBlock.astro`, and descriptions, tags, and links through `JsDocBlock.astro`.
- Resolve `{@link …}` targets with `createMetaService().resolveLink` so docs links point at `/docs/api/...` routes.

**Dependencies:**

- `@purrtrait/astro-components` must exist (Plan: Astro Components) — `DONE`, package delivered; only the publish is outstanding.

## Execution Context

Executed from `$WORKSPACE/`. Website work happens in `$PROJECT` on branch `main`. `$ART_MD` must be built first so `@noodlestan/purrfiles-entities` and the synced `meta.json` are current.

---

## Items:

| Iteration / Instructions                                                           | Status  |
| ---------------------------------------------------------------------------------- | ------- |
| Iteration: Integrate Code Rendering `./instructions/integrate-code-rendering.md`   | `READY` |
| Iteration: Add Descriptions and Tags `./instructions/add-descriptions-and-tags.md` | `READY` |
| Iteration: Publish Purrtrait Renderers                                             | `READY` |
| Iteration: Consume Purrtrait Releases                                              | `READY` |
| Iteration: Publish Purrfiles Packages                                              | `READY` |
| Iteration: Retire File Links                                                       | `READY` |
| Iteration: Move Purrfiles Packages                                                 | `READY` |
| Iteration: Update Knowledge and Plans                                              | `READY` |

### Iteration: Integrate Code Rendering

**Id:** `integrate-code-rendering`

**Status:** `READY`

**Purpose:** Render serialized, highlighted declaration code instead of plain-text signatures.

**Description:** Add the Purrtrait dependencies, switch the function and type sections to `CodeBlock.astro`, and delete `src/lib/signature.ts`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/integrate-code-rendering.md`

**Changes:**

- Dependencies listed in the scope (exact npm pins where published; `file:` only for `@purrtrait/astro-components` and `@purrtrait/lang-ts`); `npm install` then `npm ci` from `$PROJECT`.
- Keep `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities` as the only typed symbol access: `fix-docs-rendering` (`d931b76`) already removed the manual `toDeclaredType` / `toDeclaredFunction` sweeps, so there is nothing to replace here.
- Rewrite `src/components/docs/FunctionsSection.astro`: per function, a heading and a `CodeBlock.astro` rendering the serialized function declaration.
- Rewrite `src/components/docs/TypesSection.astro`: per type, a heading (with `(private)` suffix) and a `CodeBlock.astro` rendering the serialized declaration; keep the public/private split.
- Delete `src/lib/signature.ts` entirely — including the `paramTags` / `returnsTag` extensions `fix-docs-rendering` added (`d931b76`), treated as throwaway — and update every import that referenced it.
- Verify: `npx astro sync`, `npm run build`, `npm run lint` from `$ART_MD_WEB`; confirm the `dist/docs/api/` pages contain highlighted code and that no `src/lib/signature.ts` file or `signature` import remains.

**Dependencies:**

- Iteration: Add Astro Code Block (Plan: Astro Components) — `DONE`.

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

**Status:** `READY`

**Purpose:** Show descriptions, tags, and links at module, function, and type granularity.

**Description:** Bring the docs pages to reference granularity: entity summary with description and tags, per-function description with param/return tags, per-type description with tags and member descriptions.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-descriptions-and-tags.md`

**Changes:**

- Rework `src/components/docs/EntitySummary.astro` into a `JsDocBlock.astro` consumer: entity `description` and `tags`, with `resolveLink` wired from `createMetaService().resolveLink` so `{@link …}` targets become `/docs/api/...` anchors; keep rendering nothing when empty.
- Extend `src/components/docs/FunctionsSection.astro`: per function, render the JsDoc description and the `paramTags` / `returnsTag` entries under the code block — through the jsdoc-renderer params/returns surface; if that coverage is missing, the gap is closed in Plan: Add JSDoc Renderer Package or Plan: Astro Components, never as a local helper.
- Extend `src/components/docs/TypesSection.astro`: per type, render the JsDoc description and tags above the declaration block, and each object member's `description` under its name (data already carried by the declaration node).
- Keep breadcrumbs, entities section, routes, and the 404 fallback unchanged.
- Verify: `npm run build` and `npm run lint` from `$ART_MD_WEB`; confirm `dist/docs/api/art-md/parser/index.html` shows the module tags, the `parse` page shows the function description and param/returns entries, and the `config` page shows `ParserConfig`'s member descriptions; confirm `{@link}` targets render as `/docs/api/...` anchors.

**Dependencies:**

- Iteration: Add Astro Js Doc Block (Plan: Astro Components) — `DONE`.

#### Commits:

| ID                          | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| --------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `add-descriptions-and-tags` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `add-descriptions-and-tags`

**Message:**

```text
build(art-md-web): Add js doc descriptions and tags to docs.
```

### Iteration: Publish Purrtrait Renderers

**Id:** `publish-purrtrait-renderers`

**Status:** `READY`

**Purpose:** Put the rendering packages on npm so the website can stop linking across checkouts.

**Description:** Release `@purrtrait/jsdoc-renderer` and `@purrtrait/astro-components` once their plans deliver them, and republish `@purrtrait/lang-ts` so the npm artifact stops carrying a `git+ssh://…#main` dependency.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

From `$PURRTRAIT`, release in dependency order: verify `jsdoc-renderer@0.0.2` already resolves (`npm view @purrtrait/jsdoc-renderer version` — published by its own plan, no work left here), then release `astro-components` (currently `0.0.1`, unpublished), then `lang-ts` at `0.0.12` — `0.0.11` is the artifact on npm that ships the git dependency, and `ed38271` already corrected its manifest. Republish `code-renderer` only if the jsdoc rewire changed it. Each release gets its own `release(...)` commit; stop and hand version numbers to the user for `npm publish`, and confirm each resolves with `npm view <package> version` before moving on.

**Changes:**

- Bump and commit `release(purrtrait)` for `@purrtrait/jsdoc-renderer`, `@purrtrait/astro-components`, `@purrtrait/lang-ts`.
- Verify each published version resolves from the registry before any downstream pin.

**Dependencies:**

- Plan: Add JSDoc Renderer Package.
- Plan: Astro Components.

#### Commits:

| ID                            | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| ----------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `publish-purrtrait-renderers` | Purrtrait / `$PURRTRAIT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `publish-purrtrait-renderers`

**Message:**

```text
release(purrtrait): Publish the renderer packages.
```

### Iteration: Consume Purrtrait Releases

**Id:** `consume-purrtrait-releases`

**Status:** `READY`

**Purpose:** Replace the renderer `file:` links with exact npm pins.

**Description:** Swap `@purrtrait/astro-components` and `@purrtrait/lang-ts` from `file:` links to the exact versions published by the previous iteration — `@purrtrait/jsdoc-renderer` is already pinned `0.0.2` from npm and was never linked — keeping `@purrtrait/code-renderer` on its existing pin.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

In `$ART_MD_WEB/package.json`, replace the two remaining renderer `file:` entries (`@purrtrait/astro-components`, `@purrtrait/lang-ts`) with exact versions from the previous iteration, then `npm ci` from `$PROJECT`. Keep `@purrtrait/code-renderer` and `@purrtrait/jsdoc-renderer` on their pins, and leave `@noodlestan/purrfiles-entities` linked — it is retired in a later iteration.

**Changes:**

- Swap the two remaining renderer `file:` entries for exact npm versions in `apps/art-md-web/package.json`.
- Reinstall and rebuild; confirm no renderer still resolves through a checkout link.

**Dependencies:**

- Iteration: Publish Purrtrait Renderers.
- Iteration: Add Descriptions and Tags.

#### Commits:

| ID                           | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| ---------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `consume-purrtrait-releases` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `consume-purrtrait-releases`

**Message:**

```text
build(art-md-web): Pin the purrtrait renderer releases.
```

### Iteration: Publish Purrfiles Packages

**Id:** `publish-purrfiles-packages`

**Status:** `READY`

**Purpose:** Publish the meta packages so the last cross-repo link can go.

**Description:** Release `@noodlestan/purrfiles-entities`, then `@noodlestan/purrfiles-extract` — the second depends on the first.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

From `$ART_MD`, bump `libs/purrfiles-entities` first and commit its `release(art-md)` commit; stop and hand the version to the user for `npm publish`, and confirm it resolves with `npm view`. Then do the same for `cli/purrfiles-extract`. Verify `npm ls @noodlestan/purrfiles-entities` inside `$ART_MD` resolves to the published version rather than a workspace link.

**Changes:**

- Bump and commit `release(art-md)` for `@noodlestan/purrfiles-entities`, then `@noodlestan/purrfiles-extract`.
- Confirm both resolve from the registry before any downstream pin.

**Dependencies:**

- Plan: Art MD Docs.

#### Commits:

| ID                           | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ---------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `publish-purrfiles-packages` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `publish-purrfiles-packages`

**Message:**

```text
release(art-md): Publish the purrfiles packages.
```

### Iteration: Retire File Links

**Id:** `retire-file-links`

**Status:** `READY`

**Purpose:** Finish with no `file:` dependency left anywhere in the workspace.

**Description:** Pin `@noodlestan/purrfiles-entities` to its published version, sweep every manifest for `file:` entries, and drop the temporary-exception decisions that justified them.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Replace the `file:../../../art-md/libs/purrfiles-entities` entry in `$ART_MD_WEB/package.json` with an exact version, then `npm ci` from `$PROJECT`. Sweep all manifests under `$WORKSPACE/checkouts/*/` for `file:` entries and confirm the count is zero. Where a decision recorded the exception as temporary, remove it and note the replacement in Decisions.

**Changes:**

- Pin `@noodlestan/purrfiles-entities` in `apps/art-md-web/package.json`.
- Workspace-wide `file:` sweep reporting zero, from a clean install.
- Drop the `file:` exception decisions in this plan and in Plan: Art MD Docs.

**Dependencies:**

- Iteration: Publish Purrfiles Packages.
- Iteration: Consume Purrtrait Releases.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| ------------------- | --------------------------------- | -------- | ----- | ---------- |
| `retire-file-links` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `retire-file-links`

**Message:**

```text
build(art-md-web): Pin purrfiles-entities and retire file links.
```

### Iteration: Move Purrfiles Packages

**Id:** `move-purrfiles-packages`

**Status:** `READY`

**Purpose:** Give the purrfiles packages their own repository and workspace records.

**Description:** Move `@noodlestan/purrfiles-entities` and `@noodlestan/purrfiles-extract` out of `$ART_MD` into the `noodlestan/purrfiles` repository, adding the repository record and manifest entry the workspace is missing.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Add `purrfiles` to the workspace manifest and `_records/repositories/`, clone it, then move both packages with their `_records/` and knowledge intact. Re-point every consumer and the `extract` script that reads `$ART_MD/libs/parser`, rebuild both repos, and confirm the published packages still resolve. The move must not change either package's published content.

**Changes:**

- Add a workspace manifest entry and `_records/repositories/purrfiles.art`.
- Move `libs/purrfiles-entities` and `cli/purrfiles-extract` from `$ART_MD` to the new checkout.
- Re-point consumers and the parser `extract` script; rebuild both checkouts.

**Dependencies:**

- Iteration: Retire File Links.

#### Commits:

| ID                        | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| ------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `move-purrfiles-packages` | Purrfiles / `$PURRFILES` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `move-purrfiles-packages`

**Message:**

```text
records(purrfiles): Move the purrfiles packages to their repository.
```

### Iteration: Update Knowledge and Plans

**Id:** `update-knowledge-and-plans`

**Status:** `READY`

**Purpose:** Record what changed and queue what comes next.

**Description:** Update the knowledge, records, and roadmap touched by this work, and open the follow-on plans it revealed.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Update `$ART_MD_WEB/_guide.md` and the affected `_records/` for the new rendering stack and pinned dependencies. Move resolved items off the parking lot, refresh the milestone's Phase 4 rows, and open follow-on plans for the work this plan deliberately left: docs search, the sidebar, in-code symbol links, and rendering `components` and `props` entities.

**Changes:**

- Update `$ART_MD_WEB/_guide.md` and package records for the Purrtrait stack.
- Refresh `$PROJECT/_backlog/_parking-lot.md` and the Phase 4 milestone rows.
- Open follow-on plans: docs search, sidebar, in-code symbol links, non-module entities.

**Dependencies:**

- Iteration: Move Purrfiles Packages.

#### Commits:

| ID                           | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| ---------------------------- | --------------------------------- | -------- | ----- | ---------- |
| `update-knowledge-and-plans` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `update-knowledge-and-plans`

**Message:**

```text
plan(art-md-web): Record the purrtrait docs work and open follow-on plans.
```

## Work

### Next

Both web iterations have self-contained instructions: `./instructions/integrate-code-rendering.md` and `./instructions/add-descriptions-and-tags.md`; the six operational iterations carry inline instructions. Plan: Add JSDoc Renderer Package and Plan: Astro Components are both `DONE`, so every `PLANNING` iteration is unblocked — delegate in order: `integrate-code-rendering` → `add-descriptions-and-tags` → `publish-purrtrait-renderers` (user `npm publish` gate) → `consume-purrtrait-releases` → `publish-purrfiles-packages` (user gate) → `retire-file-links` → `move-purrfiles-packages` → `update-knowledge-and-plans`.

### Blockers

- None — the former blockers (Plan: Astro Components, Plan: Add JSDoc Renderer Package) are both `DONE`; `@purrtrait/jsdoc-renderer@0.0.2` is published and `@purrtrait/astro-components` is built, awaiting its publish in `publish-purrtrait-renderers`.

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
- **Publishing** — no npm release in the rendering iterations. Releases happen in their own iterations: `publish-purrtrait-renderers` and `publish-purrfiles-packages`. The `file:` exception stands until those and `retire-file-links` land.

### Evidence

- None yet.

### Decisions

- **All signature rendering vanishes** — `src/lib/signature.ts` is deleted whole, including the `paramTags` / `returnsTag` extensions from `fix-docs-rendering` (`d931b76`), treated as throwaway; signature and JSDoc rendering move to `@purrtrait/astro-components`.
- **Canonical helpers own typed access** — `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities` filter on `kind`; no local narrowing anywhere.
- **Routes live under `/docs/api`** — `DOCS_ROOT = '/docs/api'` (`Nest Docs Under API`, `c4a6859`) is this plan's route ground truth; `resolveLink` anchors target `/docs/api/...`.
- **Gaps belong upstream** — if tag, description, param, or member rendering is missing while porting the ApiScreen sections, the fix lands in the purrtrait plans, not in `$ART_MD_WEB`.
- **Declare every dependency directly; prefer npm pins over `file:` links** — cross-repo `file:` links do not resolve transitive workspace deps, so `$ART_MD_WEB` declares each package itself (precedent: `@noodlestan/purrfiles-entities`). Where the package is already published, use an exact npm version instead of a link; `file:` is reserved for packages that do not exist on npm yet, and every remaining link is on the path to being retired.
- **Descriptions render as markdown** — the reference app renders them as plain text; Astro renders markdown so resolver-produced links become real anchors.

### Follow Ups

- Render in-code symbol links once supported by the Astro components.
- Revisit the `solid-code@0.0.12` manifest: it publishes `@purrtrait/lang-ts` and `@purrtrait/code-renderer` as `*`, the same loose-range defect fixed for `lang-ts` in `ed38271`.

### Feedback

- None yet.
