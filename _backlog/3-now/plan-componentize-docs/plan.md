# Plan: Componentize Docs

**ID:** `componentize-docs`

**Status:** `READY`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** DRY docs rendering across Noodlestan Astro sites.

**Description:** Create an Astro components package for docs in the Noodlestan Web project, modeled on the package that already exists at `$NOODLESTAN_WEB/packages/astro-components`, so shared docs sections live once and every Noodlestan Astro site consumes them. The extraction carries the full JSDoc surface: every rendered module entity, function, and type keeps its description, tags, parameter and return entries, and member descriptions — no entity is rendered by the shared package without its docs data when the meta carries it.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable            | Resolved Path                               | Purpose                                           |
| ------------------- | ------------------------------------------- | ------------------------------------------------- |
| `$WORKSPACE`        | Current working directory                   | Workspace root directory.                         |
| `$PROJECT`          | `$WORKSPACE/checkouts/artificials`          | This plan's backlog and the milestone.            |
| `$ART_MD_WEB`       | `$PROJECT/apps/art-md-web`                  | Reference docs implementation to extract from.    |
| `$NOODLESTAN_WEB`   | `$WORKSPACE/checkouts/noodlestan-web`       | Target project — hosts the new package.           |
| `$ASTRO_COMPONENTS` | `$NOODLESTAN_WEB/packages/astro-components` | Existing package to model conventions on.         |
| `$PURRTRAIT`        | `$WORKSPACE/checkouts/purrtrait`            | `@purrtrait/astro-components` renderers consumed. |

## Summary

Extract the docs section components from `$ART_MD_WEB` into a new shared Astro docs package under `$NOODLESTAN_WEB/packages`, following the conventions of `@noodlestan/astro-components`, and re-point the Art MD Website at it with no behaviour change.

## Context

### Upstream Work

| Kind      | Path                                                               | Role                                  |
| --------- | ------------------------------------------------------------------ | ------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md` | Phase 4 (Docs) coordinates this plan. |

### Knowledge

::READ `$NOODLESTAN_WEB/packages/astro-components/` (Reference) — Package structure, exports map (`.` and `./global.css`), and conventions to replicate.
::READ `$ART_MD_WEB/src/components/docs/` (Source) — The docs sections to extract: `DocsBreadcrumbs`, `EntitiesSection`, `EntitySummary`, `FunctionsSection`, `TypesSection`.
::READ `$ART_MD_WEB/src/styles/global.css` (Source) — The Purrtrait consumer styles (`.shiki` variable mapping, `.code-block`, `.jsdoc-*`, `.tags`) that get copied into the package.
::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — The route helpers the breadcrumbs consume and the parameterisation contract replaces.
::READ `$PURRTRAIT/libs/astro-components/` (Source) — `CodeBlock.astro` / `JsDocBlock.astro` consumed through the shared package.
::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification.
::READ `$WORKSPACE/_guide.md` (Guide) — Workspace operations and commit conventions.

## Scope

Package work happens in `$NOODLESTAN_WEB`; the consumer migration happens in `$PROJECT`.

### (Scope) Package: Astro Docs

**Record:** `$NOODLESTAN_WEB/packages/astro-docs/_records/package.art` — New

**Role:** Owns shared Astro docs components for all Noodlestan Astro sites.

**Component inventory (extracted as-is, then parameterised):**

| Component                | Carries                                                                                          | Injection needed                       |
| ------------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `DocsBreadcrumbs.astro`  | Nav trail; hard-codes `/docs`, `/docs/api` and imports app `routes.ts`                           | Route helpers passed as props          |
| `EntitiesSection.astro`  | `{ href, label }` list                                                                           | None — already injected                |
| `EntitySummary.astro`    | Entity description + tags via `JsDocBlock.astro`                                                 | `jsdoc`, `resolveLink` props (already) |
| `FunctionsSection.astro` | Per function: heading, `CodeBlock.astro`, `JsDocBlock.astro` (description, `@param`, `@returns`) | `functions`, `resolveLink` props       |
| `TypesSection.astro`     | Per type: heading, `JsDocBlock.astro`, `CodeBlock.astro`, member descriptions from node data     | `types`, `resolveLink` props           |
| `styles`                 | Purrtrait consumer styles currently in `$ART_MD_WEB/src/styles/global.css`                       | None                                   |

**Changes:**

- Create `$NOODLESTAN_WEB/packages/astro-docs` (`@noodlestan/astro-docs`) modeled on `$ASTRO_COMPONENTS` (raw-TS `main`, exports map `.` + `./global.css`, peer `astro`, dependency on `@purrtrait/astro-components`).
- Move the five docs sections from `$ART_MD_WEB/src/components/docs/` into it; `DocsBreadcrumbs` receives route helpers as props (`docsRoot`, `apiRoot`, `packageHref`, `moduleHref`) so no `/docs` literal survives in the package.
- Copy the Purrtrait consumer styles (`.shiki` light/dark variable mapping, `.code-block`, `.jsdoc-*`, `.tags`) into the package `styles/global.css`; the app drops its copy only when it re-points, so styling is never in flux between commits.
- **JSDoc rendering is preserved for every rendered entity**: module summaries keep description and tags, every function keeps its description plus `@param` / `@returns` entries, every type keeps its description, tags, and member descriptions. The shared package renders `JsDocBlock.astro` for each — no entity renders bare.
- Re-point `$ART_MD_WEB` at the package, passing its route helpers; rendered output stays byte-identical to the pre-extraction build.

**Dependencies:**

- Plan: Astro Components — `DONE` (`@purrtrait/astro-components` exists).
- Plan: Integrate Purrtrait and Shiki — iterations `integrate-code-rendering` and `add-descriptions-and-tags` must be `DONE`; this plan extracts the post-integration components, so starting earlier extracts the wrong shape.

## Execution Context

Executed from `$WORKSPACE/`. Package work happens in `$NOODLESTAN_WEB` on branch `main`; the consumer migration in `$PROJECT` on branch `main`.

---

## Items:

| Iteration / Instructions                                                   | Status  |
| -------------------------------------------------------------------------- | ------- |
| Iteration: Scaffold Astro Docs `./instructions/scaffold-astro-docs.md`     | `DONE`  |
| Iteration: Extract Docs Sections `./instructions/extract-docs-sections.md` | `DONE`  |
| Iteration: Record Astro Docs `./instructions/record-astro-docs.md`         | `DONE`  |
| Iteration: Publish Astro Docs                                              | `READY` |

### Iteration: Scaffold Astro Docs

**Id:** `scaffold-astro-docs`

**Status:** `DONE`

**Purpose:** Create the shared package skeleton with the Purrtrait consumer styles.

**Description:** New `$NOODLESTAN_WEB/packages/astro-docs` (`@noodlestan/astro-docs`) modeled on `$ASTRO_COMPONENTS`, shipping the styles that today live in the Art MD Website.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/scaffold-astro-docs.md`

**Report:** `./instructions/scaffold-astro-docs__report.md`

**Changes:**

- Create `package.json` mirroring `$ASTRO_COMPONENTS` (raw-TS `main: ./src/index.ts`, exports map `.` → `./src/index.ts` and `./global.css` → `./src/styles/global.css`, peer `astro` `^7.4.2`, exact npm dependency `@purrtrait/astro-components` `0.0.1` — published, never a `file:` link — plus the sibling config and ignore files and the type-only `@purrception/lang-ts` devDependency the extracted components need).
- Add `src/styles/global.css` with the Purrtrait consumer styles **copied** verbatim from `$ART_MD_WEB/src/styles/global.css` (the app keeps its copy until the extraction iteration removes it, so the docs stay styled between commits) (`.shiki` light/dark variable mapping, `.code-block`, `.jsdoc-*`, `.tags`).
- Add empty `src/components/` barrels and `src/index.ts`, `_records/package.art`, `README.md`.
- Run `npm ci` and `npm run ci` from `$NOODLESTAN_WEB`.

**Dependencies:**

- None — Plan: Astro Components is `DONE`.

#### Commits:

| ID                    | Repository / Checkout / Branch              | Policy   | Hash      | Status      |
| --------------------- | ------------------------------------------- | -------- | --------- | ----------- |
| `scaffold-astro-docs` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | `077f840` | `COMMITTED` |

##### Commit: `scaffold-astro-docs`

**Message:**

```text
build(astro-docs): Scaffold the docs components package.
```

### Iteration: Extract Docs Sections

**Id:** `extract-docs-sections`

**Status:** `DONE`

**Purpose:** Move the five docs sections into the shared package and re-point the Art MD Website with byte-identical output.

**Description:** Components move with their JSDoc surface intact; `DocsBreadcrumbs` becomes route-injected; the consumer loses its local docs components and style block.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/extract-docs-sections.md`

**Report:** `./instructions/extract-docs-sections__report.md`

**Changes:**

- Move `DocsBreadcrumbs`, `EntitiesSection`, `EntitySummary`, `FunctionsSection`, `TypesSection` into `$NOODLESTAN_WEB/packages/astro-docs/src/components/`, with a barrel export.
- Parameterise `DocsBreadcrumbs`: props gain `docsRoot`, `apiRoot`, `packageHref`, `moduleHref`; no `/docs` literal remains in the package.
- Re-point `$ART_MD_WEB`: pages and layouts import from `@noodlestan/astro-docs`, pass route helpers built in `lib/routes.ts`, delete `src/components/docs/`, drop the moved style block from `src/styles/global.css`, and import the package's `./global.css` from `PageLayout.astro`.
- **JSDoc surface check during the move:** every function rendered keeps `JsDocBlock.astro` (description + `paramTags` / `returnsTag`), every type keeps description, tags, and member descriptions, every module summary keeps description and tags with `{@link …}` resolved through `resolveLink` — nothing is dropped in the transfer.
- Validation: build both checkouts; diff `dist/docs/api/**` before and after — byte-identical except asset hashes; count `jsdoc-params` blocks in `dist` against functions carrying `paramTags` in `meta.json` — every such function has a rendered params block; confirm `ParserConfig` member descriptions and the `config` module description render, and `{@link ParserConfig}` in that description becomes an `/docs/api/...` anchor.
- `grep -rn "'/docs" $NOODLESTAN_WEB/packages/astro-docs/src` returns nothing (routes fully injected).

**Dependencies:**

- Iteration: Scaffold Astro Docs.
- Plan: Integrate Purrtrait and Shiki — iterations `integrate-code-rendering` and `add-descriptions-and-tags` `DONE`.

#### Commits:

| ID                      | Repository / Checkout / Branch              | Policy   | Hash      | Status      |
| ----------------------- | ------------------------------------------- | -------- | --------- | ----------- |
| `extract-docs-sections` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | `a406701` | `COMMITTED` |
| `repoint-art-md-docs`   | Artificials / `$PROJECT` / `main`           | `NOPUSH` | `03b51d1` | `COMMITTED` |

##### Commit: `extract-docs-sections`

**Message:**

```text
build(astro-docs): Add the docs sections extracted from art-md-web.
```

##### Commit: `repoint-art-md-docs`

**Message:**

```text
refactor(art-md-web): Consume `@noodlestan/astro-docs`.
```

### Iteration: Record Astro Docs

**Id:** `record-astro-docs`

**Status:** `DONE`

**Purpose:** Register the new package and close the coordination loop.

**Description:** Records, guides, and roadmap rows follow the extraction.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/record-astro-docs.md`

**Report:** `./instructions/record-astro-docs__report.md`

**Changes:**

- Finalize `$NOODLESTAN_WEB/packages/astro-docs/_records/package.art` and add the package row to the `$NOODLESTAN_WEB/_guide.md` packages table.
- Refresh the milestone Phase 4 rows and the `$PROJECT/_backlog/_parking-lot.md` in `$PROJECT`.
- Record Evidence in this plan: the byte-identical diff and the JSDoc coverage counts from the extraction.

**Dependencies:**

- Iteration: Extract Docs Sections.

#### Commits:

| ID                   | Repository / Checkout / Branch              | Policy   | Hash      | Status      |
| -------------------- | ------------------------------------------- | -------- | --------- | ----------- |
| `record-astro-docs`  | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | `9f6613e` | `COMMITTED` |
| `reflect-astro-docs` | Artificials / `$PROJECT` / `main`           | `NOPUSH` | `09de76e` | `COMMITTED` |

##### Commit: `record-astro-docs`

**Message:**

```text
records(astro-docs): Register the package in the workspace records and guides.
```

##### Commit: `reflect-astro-docs`

**Message:**

```text
roadmap(art-md-hello-world): Move `componentize-docs` forward; reflected upstream.
```

### Iteration: Publish Astro Docs

**Id:** `publish-astro-docs`

**Status:** `READY`

**Purpose:** Retire the plan's one remaining `file:` link by publishing the package and pinning it exact.

**Description:** `@noodlestan/astro-docs` goes to npm as `0.0.1`, the consumer swaps `file:` for the exact pin, and the workspace `file:` count returns to zero with no unpublished exceptions left in `apps/art-md-web/package.json`.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

From `$NOODLESTAN_WEB`: copy `$ASTRO_COMPONENTS/LICENSE-MIT` into `$PACKAGE/` if absent (the `files` array requires it and the scaffold did not copy it), then in `$PACKAGE/_records/package.art` set `Published` to `true` and add the `Deployment` entry mirroring the model's record. Run `npm pack --dry-run` from `packages/astro-docs` and verify the file list contains only `src`, `LICENSE-MIT`, `README.md`, `CHANGELOG.md` — no `test/` and no fixture artifacts. STOP and hand `@noodlestan/astro-docs@0.0.1` to the user for `npm publish`; confirm with `npm view @noodlestan/astro-docs version`. From `$PROJECT`: replace the `file:../../../noodlestan-web/packages/astro-docs` entry in `apps/art-md-web/package.json` with the exact pin `0.0.1`, run `npm install`, and verify: `node_modules/@noodlestan/astro-docs` is not a symlink, `npm ls @noodlestan/astro-docs` resolves from the registry, the workspace-wide `file:` sweep across all manifests returns zero, and the docs build is green (`lint:fix` then `astro sync` then `build` then `lint`). Finally remove the parking-lot item about publishing `@noodlestan/astro-docs` from `$PROJECT/_backlog/_parking-lot.md`, since this iteration discharges it.

**Changes:**

- Ensure `LICENSE-MIT` in the package; flip the record to `Published: true` with a `Deployment` entry.
- User gate: `npm pack --dry-run`, then `npm publish`, then `npm view` confirms `0.0.1`.
- Swap `apps/art-md-web/package.json` from the `file:` link to exact `0.0.1`; refresh the lock.
- Verify registry resolution (no symlink), a zero `file:` sweep, and a green docs build.
- Clear the discharged parking-lot item.

**Dependencies:**

- Iteration: Extract Docs Sections.

#### Commits:

| ID                   | Repository / Checkout / Branch              | Policy   | Hash  | Status     |
| -------------------- | ------------------------------------------- | -------- | ----- | ---------- |
| `release-astro-docs` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |
| `pin-astro-docs`     | Artificials / `$PROJECT` / `main`           | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `release-astro-docs`

**Message:**

```text
release(astro-docs): 0.0.1.
```

##### Commit: `pin-astro-docs`

**Message:**

```text
build(art-md-web): Pin @noodlestan/astro-docs from npm.
```

## Work

### Next

Iterations 1-3 are `DONE` (`077f840`, `a406701` + `03b51d1`, `9f6613e` + `09de76e`). One iteration remains: `publish-astro-docs` (`READY`, inlined) — it retires the plan's single `file:` link and the parking-lot item logged by `record-astro-docs`. Delegate it when the window is right; its only gate is the user's `npm publish` of `@noodlestan/astro-docs@0.0.1`.

### Blockers

- None — the former blocker (Plan: Integrate Purrtrait and Shiki, iterations 1–2) is resolved: both are `DONE`, the integrate plan completed all 9 iterations, and Plan: Distribute Meta JSON's fetcher owns `meta.json` production.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md` and `$PROJECT/_guide.md`)

Run `npm ci` from the `$NOODLESTAN_WEB` and `$PROJECT` roots.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirm the shared package builds and the consuming site still renders.

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md` and `$PROJECT/_guide.md`)

Run `npm run ci` from the `$NOODLESTAN_WEB` root, then the docs build (`lint:fix` → `astro sync` → `build` → `lint`) from `$ART_MD_WEB`.

Then confirm the JSDoc surface survived the extraction — for every rendered entity, not spot checks:

- Every function whose `meta.json` node carries `paramTags` has a rendered `jsdoc-params` block in `dist` (count parity between meta and dist).
- Every type with described members shows those member descriptions (e.g. `ParserConfig`), and every type/module carrying `description` / `tags` renders them through `JsDocBlock.astro`.
- `{@link …}` targets in descriptions render as `/docs/api/...` anchors.
- The `dist/docs/api/**` before/after diff is byte-identical, asset hashes aside.

---

## Coordination

### Not In Scope

- **Publishing other packages** — `@noodlestan/astro-docs` is published by iteration `publish-astro-docs`; no other npm release happens in this plan.
- **Other Astro sites** — beyond `$ART_MD_WEB`, migrations are follow-ups.
- **`@purrtrait/astro-components` changes** — consumed as-is.

### Evidence

- `scaffold-astro-docs` (`077f840`) — `@noodlestan/astro-docs` scaffolded as a sibling of `@noodlestan/astro-components`: manifest (raw-TS `main`, exports `.` + `./global.css`, peer `astro ^7.4.2`, exact npm pin `@purrtrait/astro-components@0.0.1`, type-only `@purrception/lang-ts` devDependency), the Purrtrait consumer styles copied verbatim (`shiki-light` ×5), empty component barrel + `src/index.ts`, a minimal fixture proving the `.astro` graph and styles build, `_records/package.art`, README, CHANGELOG. `npm ci` + `npm run ci` green (3/3 turbo tasks including the model package); `$ART_MD_WEB` untouched. Report: `./instructions/scaffold-astro-docs__report.md`.
- `extract-docs-sections` (`a406701`, `03b51d1`) — the five docs sections moved into `packages/astro-docs/src/components/` with a barrel and a `DocsResolveLink` of identical shape to the app's; `DocsBreadcrumbs` route-injected (`docsRoot="/docs"`, `apiRoot="/docs/api"`, `packageHref`, `moduleHref`); the app pages/layouts import from `@noodlestan/astro-docs`, `PageLayout` pulls the package's `./global.css`, and the local `src/components/docs/` plus the Purrtrait style block are gone (−57 lines); the fixture now renders breadcrumbs and entities. Gate: normalized HTML diff **0/15 — byte-identical visible markup**, empty under the ratified waiver of the three move-inherent classes (path-derived `data-astro-cid-*`, dotted asset-hash normalization defect, inline-vs-external style emission); coverage parity: functions carrying `paramTags` vs rendered `jsdoc-params` blocks = 3 functions × 2 render sites = 6, `ParserConfig` 2 member descriptions, `{@link ParserConfig}` → `/docs/api/...` anchor; both greps empty; `$NOODLESTAN_WEB` and app CI green. Report: `./instructions/extract-docs-sections__report.md`.
- `record-astro-docs` (`9f6613e`, `09de76e`) — package registered: `## Packages` row in `$NOODLESTAN_WEB/_guide.md`, `_records/package.art` verified against the manifest with no drift; this plan moved to `_backlog/1-done/` with status `DONE` and all iterations `DONE`; the milestone Phase 4 row repointed to `1-done/plan-componentize-docs/plan.md` + `DONE`; the parking lot gains only the genuinely-new follow-ups (publish `@noodlestan/astro-docs`, migrate other Astro sites — cross-checked against Follow Ups so nothing is duplicated). `$NOODLESTAN_WEB` `npm run ci` green (3/3), docs build (`lint:fix` → `sync` → `build` 15 pages → `lint`) green, every cited path resolves, no `None yet` left. Report: `./instructions/record-astro-docs__report.md`.

### Decisions

- **Modeled on `@noodlestan/astro-components`** — same package shape, exports map (`.`, `./global.css`), and peer-dependency style as the existing package in `$NOODLESTAN_WEB/packages/`.
- **Routes injected, not hard-coded** — sites pass their href helpers, so `/docs/api` stays Art MD's own ground truth; `DocsBreadcrumbs` takes `docsRoot` / `apiRoot` / `packageHref` / `moduleHref` props.
- **Name settled: `@noodlestan/astro-docs`** — parallel to `@noodlestan/astro-components`.
- **Styles travel with the package** — the Purrtrait consumer styles (`.shiki` variable mapping, `.code-block`, `.jsdoc-*`, `.tags`) ship as the package's `./global.css`, so consumers get rendering parity for free.
- **JSDoc surface is part of the contract** — the package renders `JsDocBlock.astro` for every function, type, and module summary it displays; an entity without its docs data is a bug, not a style choice.

### Follow Ups

- Meta availability comes from Plan: Distribute Meta JSON's fetcher (`meta-docs.config.mts` + `fetch-meta.mjs`); coverage checks read `src/data/meta.json`, the gitignored fetch cache — not `node_modules`.
- Migrate other Noodlestan Astro sites to the shared package.

### Feedback

- First delegation of `scaffold-astro-docs` BLOCKED on an internal contradiction: Step 3's fixture had to render `DocsBreadcrumbs`/`EntitiesSection` that do not exist until iteration 2 (whose `git mv` also forbids pre-created placeholders), while Step 5 demanded all-green CI. The worker reported the blocker without touching either tree; with the user's approval the delegator applied Fix (a) — the iteration-1 fixture now imports only the package entry and copied styles, and `extract-docs-sections.md` explicitly takes over the component renders — then re-delegated to the same session, which completed first try. Lesson for instruction writing: a step must not require artefacts the same instruction defers.
- The literal byte-identical contract could not hold for a component move: Astro's `data-astro-cid-*` scope id is filename-derived, the gate's `sed` pattern stopped at the dot (could not match `name.HASH.ext`), and moving the stylesheet import shifts emission between the external chunk and inline `<style>`. Ratified by the user — those three classes normalize away (visible markup 0/15 identical) — and the amended Step 5 now carries the fixed pattern and the waiver so the next reader is not blocked by a dead rule.
- Step 4.2's `apiRoot={DOCS_ROOT}` was unsatisfiable (`DOCS_ROOT` declared without `export`, `src/lib/routes.ts` frozen by the same step); ratified to the literal `"/docs/api"`, consistent with the step's own `docsRoot="/docs"` literal.
- Concurrent third-party work (an `@types/node` bump in `$PROJECT`'s root manifests) sat uncommitted throughout this iteration — the worker staged around it surgically; staging must stay file-scoped while parallel sessions share the tree.
