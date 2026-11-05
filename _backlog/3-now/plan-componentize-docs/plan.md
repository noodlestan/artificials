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
| Iteration: Extract Docs Sections `./instructions/extract-docs-sections.md` | `READY` |
| Iteration: Record Astro Docs `./instructions/record-astro-docs.md`         | `READY` |

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

**Status:** `READY`

**Purpose:** Move the five docs sections into the shared package and re-point the Art MD Website with byte-identical output.

**Description:** Components move with their JSDoc surface intact; `DocsBreadcrumbs` becomes route-injected; the consumer loses its local docs components and style block.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/extract-docs-sections.md`

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

| ID                      | Repository / Checkout / Branch              | Policy   | Hash  | Status     |
| ----------------------- | ------------------------------------------- | -------- | ----- | ---------- |
| `extract-docs-sections` | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |
| `repoint-art-md-docs`   | Artificials / `$PROJECT` / `main`           | `NOPUSH` | (TBD) | `AUTHORED` |

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

**Status:** `READY`

**Purpose:** Register the new package and close the coordination loop.

**Description:** Records, guides, and roadmap rows follow the extraction.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/record-astro-docs.md`

**Changes:**

- Finalize `$NOODLESTAN_WEB/packages/astro-docs/_records/package.art` and add the package row to the `$NOODLESTAN_WEB/_guide.md` packages table.
- Refresh the milestone Phase 4 rows and the `$PROJECT/_backlog/_parking-lot.md` in `$PROJECT`.
- Record Evidence in this plan: the byte-identical diff and the JSDoc coverage counts from the extraction.

**Dependencies:**

- Iteration: Extract Docs Sections.

#### Commits:

| ID                   | Repository / Checkout / Branch              | Policy   | Hash  | Status     |
| -------------------- | ------------------------------------------- | -------- | ----- | ---------- |
| `record-astro-docs`  | Noodlestan Web / `$NOODLESTAN_WEB` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |
| `reflect-astro-docs` | Artificials / `$PROJECT` / `main`           | `NOPUSH` | (TBD) | `AUTHORED` |

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

## Work

### Next

All three iterations are `READY` with self-contained instructions: `./instructions/scaffold-astro-docs.md`, `./instructions/extract-docs-sections.md`, `./instructions/record-astro-docs.md`. Plan: Integrate Purrtrait and Shiki is complete and the tree is clean — delegate in order; serialize iteration 2's consumer commit against Plan: Distribute Meta JSON's app-side edits (both touch `$ART_MD_WEB/package.json`, different sections).

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

- **Publishing** — no npm release; `file:` links or workspace wiring only.
- **Other Astro sites** — beyond `$ART_MD_WEB`, migrations are follow-ups.
- **`@purrtrait/astro-components` changes** — consumed as-is.

### Evidence

- `scaffold-astro-docs` (`077f840`) — `@noodlestan/astro-docs` scaffolded as a sibling of `@noodlestan/astro-components`: manifest (raw-TS `main`, exports `.` + `./global.css`, peer `astro ^7.4.2`, exact npm pin `@purrtrait/astro-components@0.0.1`, type-only `@purrception/lang-ts` devDependency), the Purrtrait consumer styles copied verbatim (`shiki-light` ×5), empty component barrel + `src/index.ts`, a minimal fixture proving the `.astro` graph and styles build, `_records/package.art`, README, CHANGELOG. `npm ci` + `npm run ci` green (3/3 turbo tasks including the model package); `$ART_MD_WEB` untouched. Report: `./instructions/scaffold-astro-docs__report.md`.

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
