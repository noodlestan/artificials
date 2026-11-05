# Plan: Integrate Purrtrait and Shiki

**ID:** `integrate-purrtrait-and-shiki`

**Status:** `DONE`

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

- Add the dependencies below to `$ART_MD_WEB/package.json`, exact-pinned per `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md`. Pin from npm wherever the package is published; keep a `file:` link only where it is not yet published, and declare each linked package directly because cross-repo `file:` links do not resolve transitive workspace deps:

  | Dependency                    | Version        | Why                                                                                                                                  |
  | ----------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
  | `@purrtrait/astro-components` | `0.0.1` (npm)  | Delivered by Plan: Astro Components; was `file:` until `publish-purrtrait-renderers` published it and `retire-file-links` pinned it. |
  | `@purrtrait/jsdoc-renderer`   | `0.0.2` (npm)  | Published by Plan: Add JSDoc Renderer Package — pinned exact from npm on day one, never linked.                                      |
  | `@purrtrait/lang-ts`          | `0.0.12` (npm) | Published `0.0.11` shipped a `git+ssh://…#main` dependency; `publish-purrtrait-renderers` republished it clean, now pinned exact.    |
  | `@purrtrait/code-renderer`    | `0.0.11` (npm) | Published with no dependencies — safe to pin.                                                                                        |
  | `@purrception/lang-ts`        | `0.1.1` (npm)  | Already pinned exact elsewhere in the workspace.                                                                                     |
  | `shiki`                       | `4.5.0` (npm)  | Installed transitively via `astro` today; declared directly because `CodeBlock.astro` imports it.                                    |
  | `marked`                      | `18.1.2` (npm) | Descriptions render as markdown.                                                                                                     |

  This plan carried three `file:` links (astro-components, `lang-ts`, and the pre-existing `purrfiles-entities`); all three are retired — `retire-file-links` sweeps the workspace to zero.

- Delete `src/lib/signature.ts` — every local signature helper goes; typed symbol access uses the canonical `getEntityTypes` / `getEntityFunctions` helpers from `@noodlestan/purrfiles-entities`, which the docs pages already consume.
- Rework `FunctionsSection.astro` and `TypesSection.astro` to render declaration code blocks through `CodeBlock.astro`, and descriptions, tags, and links through `JsDocBlock.astro`.
- Resolve `{@link …}` targets with `createMetaService().resolveLink` so docs links point at `/docs/api/...` routes.

**Dependencies:**

- `@purrtrait/astro-components` must exist (Plan: Astro Components) — `DONE`, package delivered; only the publish is outstanding.

## Execution Context

Executed from `$WORKSPACE/`. Website work happens in `$PROJECT` on branch `main`. `$ART_MD` must be built first so `@noodlestan/purrfiles-entities` and the synced `meta.json` are current.

---

## Items:

| Iteration / Instructions                                                           | Status |
| ---------------------------------------------------------------------------------- | ------ |
| Iteration: Integrate Code Rendering `./instructions/integrate-code-rendering.md`   | `DONE` |
| Iteration: Add Descriptions and Tags `./instructions/add-descriptions-and-tags.md` | `DONE` |
| Iteration: Resolve Symbol Links                                                    | `DONE` |
| Iteration: Publish Purrtrait Renderers                                             | `DONE` |
| Iteration: Consume Purrtrait Releases                                              | `DONE` |
| Iteration: Publish Purrfiles Packages                                              | `DONE` |
| Iteration: Retire File Links                                                       | `DONE` |
| Iteration: Move Purrfiles Packages                                                 | `DONE` |
| Iteration: Update Knowledge and Plans                                              | `DONE` |

### Iteration: Integrate Code Rendering

**Id:** `integrate-code-rendering`

**Status:** `DONE`

**Purpose:** Render serialized, highlighted declaration code instead of plain-text signatures.

**Description:** Add the Purrtrait dependencies, switch the function and type sections to `CodeBlock.astro`, and delete `src/lib/signature.ts`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/integrate-code-rendering.md`

**Report:** `./instructions/integrate-code-rendering__report.md`

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

| ID                         | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| -------------------------- | --------------------------------- | -------- | --------- | ----------- |
| `integrate-code-rendering` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `c6a7f8c` | `COMMITTED` |

##### Commit: `integrate-code-rendering`

**Message:**

```text
build(art-md-web): Integrate purrtrait code renderer and shiki.
```

### Iteration: Add Descriptions and Tags

**Id:** `add-descriptions-and-tags`

**Status:** `DONE`

**Purpose:** Show descriptions, tags, and links at module, function, and type granularity.

**Description:** Bring the docs pages to reference granularity: entity summary with description and tags, per-function description with param/return tags, per-type description with tags and member descriptions.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-descriptions-and-tags.md`

**Report:** `./instructions/add-descriptions-and-tags__report.md`

**Changes:**

- Rework `src/components/docs/EntitySummary.astro` into a `JsDocBlock.astro` consumer: entity `description` and `tags`, with `resolveLink` wired from `createMetaService().resolveLink` so `{@link …}` targets become `/docs/api/...` anchors; keep rendering nothing when empty.
- Extend `src/components/docs/FunctionsSection.astro`: per function, render the JsDoc description and the `paramTags` / `returnsTag` entries under the code block — through the jsdoc-renderer params/returns surface; if that coverage is missing, the gap is closed in Plan: Add JSDoc Renderer Package or Plan: Astro Components, never as a local helper.
- Extend `src/components/docs/TypesSection.astro`: per type, render the JsDoc description and tags above the declaration block, and each object member's `description` under its name (data already carried by the declaration node).
- Keep breadcrumbs, entities section, routes, and the 404 fallback unchanged.
- Verify: `npm run build` and `npm run lint` from `$ART_MD_WEB`; confirm `dist/docs/api/art-md/parser/index.html` shows the module tags, the `parse` page shows the function description and param/returns entries, and the `config` page shows `ParserConfig`'s member descriptions; confirm `{@link}` targets render as `/docs/api/...` anchors.

**Dependencies:**

- Iteration: Add Astro Js Doc Block (Plan: Astro Components) — `DONE`.

#### Commits:

| ID                          | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| --------------------------- | --------------------------------- | -------- | --------- | ----------- |
| `add-descriptions-and-tags` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `563dee6` | `COMMITTED` |

##### Commit: `add-descriptions-and-tags`

**Message:**

```text
build(art-md-web): Add js doc descriptions and tags to docs.
```

### Iteration: Resolve Symbol Links

**Id:** `resolve-symbol-links`

**Status:** `DONE`

**Purpose:** Make `{@link}` targets that name declared symbols resolve to their owning module's page anchor.

**Description:** Corrective iteration added after the user's rendering review: re-authored the `art-md` JSDoc link targets to the `entity#symbol` form (the form the resolver already half-supported), regenerated the meta, and taught the consumer's glue to carry the symbol through to a fragment — with heading and member ids so the fragments actually land.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

From `$ART_MD`: re-authored seven `{@link}` targets across `libs/parser/src` as `entity#symbol` expressions — `config#ParserConfig` (×3), `config#ParserConfig.defaultConstruct`, `config#ParserConfig.constructs`, `config#createDefaultParserConfig`, `mdast#BLOCK_TYPES` — and ran `npm run extract` to regenerate `libs/parser/dist/meta.json`. Cross-package targets (`ParseContext`, `ArtDocument`, the npm URL) stay unqualified: they render as plain text until their own packages are documented. From `$PROJECT`: `src/lib/meta.ts` appends `#symbol` to the `makeEntityHref` result; `FunctionsSection.astro` and `TypesSection.astro` carry `id` on function headings, type headings, and described members (`Type.member`); the gitignored `src/data/meta.json` was re-synced. Verify: the `config` page renders `<a href="…/config/module/config#ParserConfig">ParserConfig</a>` landing on `<h3 id="ParserConfig">`, and `ParseContext` still renders as plain text.

**Changes:**

- Re-author seven link targets in `$ART_MD` as `entity#symbol`; regenerate the meta.
- Append `#symbol` in the consumer glue; add heading and member anchors.
- Re-sync `meta.json` (gitignored — regenerated by `npm run extract`).

**Dependencies:**

- Iteration: Add Descriptions and Tags.

#### Commits:

| ID                     | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ---------------------- | --------------------------------- | -------- | --------- | ----------- |
| `resolve-symbol-links` | Art MD / `$ART_MD` / `main`       | `NOPUSH` | `9b065e3` | `COMMITTED` |
| `resolve-symbol-links` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `e40b703` | `COMMITTED` |

### Iteration: Publish Purrtrait Renderers

**Id:** `publish-purrtrait-renderers`

**Status:** `DONE`

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

| ID                                             | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ---------------------------------------------- | --------------------------------- | -------- | --------- | ----------- |
| `publish-purrtrait-renderers-lang-ts`          | Purrtrait / `$PURRTRAIT` / `main` | `NOPUSH` | `546167c` | `COMMITTED` |
| `publish-purrtrait-renderers-astro-components` | Purrtrait / `$PURRTRAIT` / `main` | `NOPUSH` | `7a51c97` | `COMMITTED` |

##### Commit: `publish-purrtrait-renderers-lang-ts`

**Message:**

```text
release(lang-ts): 0.0.12
```

##### Commit: `publish-purrtrait-renderers-astro-components`

**Message:**

```text
release(astro-components): 0.0.1
```

> **Execution note:** this iteration was executed directly by the user, not delegated — there is no worker report file. `@purrtrait/jsdoc-renderer@0.0.2` was already published by its own plan and is verified, not released here. The originally reported hashes `2b8cea3` / `e92ce97` were rewritten by a rebase on pull; the recorded hashes are their identical-patch counterparts now on `main`.

### Iteration: Consume Purrtrait Releases

**Id:** `consume-purrtrait-releases`

**Status:** `DONE`

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

| ID                           | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ---------------------------- | --------------------------------- | -------- | --------- | ----------- |
| `consume-purrtrait-releases` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `ee1e661` | `COMMITTED` |

##### Commit: `consume-purrtrait-releases`

**Message:**

```text
build(art-md-web): Pin the purrtrait renderer releases.
```

### Iteration: Publish Purrfiles Packages

**Id:** `publish-purrfiles-packages`

**Status:** `DONE`

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

| ID                                    | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------------------------- | ------------------------------ | -------- | --------- | ----------- |
| `publish-purrfiles-packages-entities` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `cc2a0b3` | `COMMITTED` |
| `publish-purrfiles-packages-extract`  | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `2498f16` | `COMMITTED` |

##### Commit: `publish-purrfiles-packages-entities`

**Message:**

```text
release(purrfiles-entities): 0.0.1
```

##### Commit: `publish-purrfiles-packages-extract`

**Message:**

```text
release(purrfiles-extract): 0.0.1
```

> **Execution note:** both packages are first publishes (npm had neither), so the user decided to keep the manifest versions at `0.0.1` — the entities release commit carries the new `CHANGELOG.md` with no version change, and `cli/purrfiles-extract`'s existing `0.0.1` dependency pin stayed valid. The iteration paused at the user's `npm publish` gate between the two commits; both are now published and confirmed.

### Iteration: Retire File Links

**Id:** `retire-file-links`

**Status:** `DONE`

**Purpose:** Finish with no `file:` dependency left anywhere in the workspace.

**Description:** Pin `@noodlestan/purrfiles-entities` to its published version, sweep every manifest for `file:` entries, and drop the temporary-exception decisions that justified them.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Replace the `file:../../../art-md/libs/purrfiles-entities` entry in `$ART_MD_WEB/package.json` with an exact version, then `npm ci` from `$PROJECT`. Sweep all manifests under `$WORKSPACE/checkouts/*/` for `file:` entries and confirm the count is zero. Where a decision recorded the exception as temporary, remove it and note the replacement in Decisions.

**Report:** `./instructions/retire-file-links__report.md`

**Changes:**

- Pin `@noodlestan/purrfiles-entities` in `apps/art-md-web/package.json`.
- Workspace-wide `file:` sweep reporting zero, from a clean install.
- Drop the `file:` exception decisions in this plan and in Plan: Art MD Docs.
- Extend `apps/art-md-web/astro.config.mjs` `vite.ssr.noExternal` with `@noodlestan/purrfiles-entities` and mirror it onto the `astro` and `prerender` environments: the physical npm install externalizes the raw-TS chain and Node refuses to type-strip `.ts` under `node_modules` (worker BLOCKER; fixed outside the worker's scope in `de9c6ed`, build verified green).

**Dependencies:**

- Iteration: Publish Purrfiles Packages.
- Iteration: Consume Purrtrait Releases.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ------------------- | --------------------------------- | -------- | --------- | ----------- |
| `retire-file-links` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `841336f` | `COMMITTED` |

##### Commit: `retire-file-links`

**Message:**

```text
build(art-md-web): Pin purrfiles-entities and retire file links.
```

### Iteration: Move Purrfiles Packages

**Id:** `move-purrfiles-packages`

**Status:** `DONE`

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

| ID                                  | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ----------------------------------- | --------------------------------- | -------- | --------- | ----------- |
| `move-purrfiles-packages`           | Purrfiles / `$PURRFILES` / `main` | `NOPUSH` | `22b4c9d` | `COMMITTED` |
| `move-purrfiles-packages-art-md`    | Art MD / `$ART_MD` / `main`       | `NOPUSH` | `af97cc0` | `COMMITTED` |
| `move-purrfiles-packages-workspace` | Workspace / `$WORKSPACE` / `main` | `NOPUSH` | `17ca8eb` | `COMMITTED` |

##### Commit: `move-purrfiles-packages`

**Message:**

```text
records(purrfiles): Move the purrfiles packages to their repository.
```

##### Commit: `move-purrfiles-packages-art-md`

**Message:**

```text
migrate(art-md): Move the purrfiles packages to the purrfiles repository.
```

##### Commit: `move-purrfiles-packages-workspace`

**Message:**

```text
records(purrfiles): Add the purrfiles repository record.
```

### Iteration: Update Knowledge and Plans

**Id:** `update-knowledge-and-plans`

**Status:** `DONE`

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

| ID                                   | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ------------------------------------ | --------------------------------- | -------- | --------- | ----------- |
| `update-knowledge-and-plans`         | Artificials / `$PROJECT` / `main` | `NOPUSH` | `576e694` | `COMMITTED` |
| `update-knowledge-and-plans-records` | Purrfiles / `$PURRFILES` / `main` | `NOPUSH` | `ae5ed53` | `COMMITTED` |

##### Commit: `update-knowledge-and-plans`

**Message:**

```text
plan(art-md-web): Record the purrtrait docs work and open follow-on plans.
```

##### Commit: `update-knowledge-and-plans-records`

**Message:**

```text
records(purrfiles): Repoint package records to their new home.
```

## Work

### Next

Both web iterations have self-contained instructions: `./instructions/integrate-code-rendering.md` and `./instructions/add-descriptions-and-tags.md`; the six operational iterations carry inline instructions. **All nine iterations are `DONE`** — plan complete, ready for the milestone reflection: ~~`integrate-code-rendering`~~ (`c6a7f8c`) → ~~`add-descriptions-and-tags`~~ (`563dee6`) → ~~`resolve-symbol-links`~~ (`9b065e3` + `e40b703`) → ~~`publish-purrtrait-renderers`~~ (user-executed, `546167c` + `7a51c97`) → ~~`consume-purrtrait-releases`~~ (`ee1e661`) → ~~`publish-purrfiles-packages`~~ (`cc2a0b3` + `2498f16`, both `0.0.1` published) → ~~`retire-file-links`~~ (`841336f` + `de9c6ed`, `file:` sweep = 0) → ~~`move-purrfiles-packages`~~ (`22b4c9d` + `af97cc0` + `17ca8eb`) → ~~`update-knowledge-and-plans`~~ (`576e694` + `ae5ed53`).

### Blockers

- None — the former blockers (Plan: Astro Components, Plan: Add JSDoc Renderer Package) are both `DONE`; `@purrtrait/jsdoc-renderer@0.0.2`, `@purrtrait/astro-components@0.0.1`, and `@purrtrait/lang-ts@0.0.12` all resolve from npm.

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
- **Publishing** — no npm release in the rendering iterations. Releases happen in their own iterations: `publish-purrtrait-renderers` and `publish-purrfiles-packages`. Both have landed, and with `retire-file-links` no `file:` dependency remains anywhere in the workspace (sweep: 0 across 82 manifests).

### Evidence

- `integrate-code-rendering` (`c6a7f8c`) — `src/lib/signature.ts` deleted with no remaining references; `FunctionsSection.astro` and `TypesSection.astro` render `CodeBlock.astro` with full declaration wrappers; seven dependencies pinned; `lint:fix`, `astro sync`, `build`, `lint`, and the root pre-commit CI all pass; built module pages contain `pre.shiki` highlighted markup. Report: `./instructions/integrate-code-rendering__report.md`.
- `add-descriptions-and-tags` (`563dee6`) — new `src/lib/meta.ts` resolver glue (`createDocsResolveLink`); `EntitySummary`, `FunctionsSection`, `TypesSection` render descriptions, tags, param/returns entries, and member descriptions through `JsDocBlock.astro`; both pages wire `resolveLink`; all builds/lints and the pre-commit CI pass. `{@link …}` mechanism is wired (entity targets resolve to `/docs/api/...`), but the current data's 8 link targets are declared symbols, which never resolve as entities — they render as plain text pending symbol-level extraction. Report: `./instructions/add-descriptions-and-tags__report.md`.
- `publish-purrtrait-renderers` (`546167c`, `7a51c97`) — released by the user directly, so no delegation and no worker report file; `@purrtrait/lang-ts@0.0.12` (manifest free of the `git+ssh` defect), `@purrtrait/astro-components@0.0.1`, and `@purrtrait/jsdoc-renderer@0.0.2` each confirmed with `npm view <package> version`.
- `consume-purrtrait-releases` (`ee1e661`) — `@purrtrait/astro-components` `0.0.1` and `@purrtrait/lang-ts` `0.0.12` pinned exact in `apps/art-md-web/package.json`; `npm ls` resolves both from the registry with no link arrows, and the lockfile carries registry `resolved` + integrity for both — the only remaining `file:` link is `@noodlestan/purrfiles-entities` (plus the workspace self-link). `lint:fix`, `astro sync`, `build`, `lint`, and the pre-commit CI all pass. Inlined instructions, so the worker reported in chat — no report file.
- `publish-purrfiles-packages` (`cc2a0b3`, `2498f16`) — `libs/purrfiles-entities/CHANGELOG.md` and `cli/purrfiles-extract/CHANGELOG.md` created with `0.0.1` first-release entries and no version changes (user's decision: keep `0.0.1`, so extract's existing pin holds); both `$ART_MD` root `npm run ci` runs pass (12/12 tasks) and the pre-commit hook re-ran them. Both packages published and confirmed: `npm view` → `0.0.1` each; `npm ls @noodlestan/purrfiles-entities` inside `$ART_MD` reports `@noodlestan/purrfiles-entities@0.0.1` (it still prints the `-> ./libs/…` arrow — it stays a workspace member, so `npm view` is the registry check that matters). Nothing pushed, no report file (inlined instructions).
- `retire-file-links` (`841336f`, `de9c6ed`) — `@noodlestan/purrfiles-entities` pinned exact `0.0.1`, lockfile registry-resolved, `npm ls` shows no link arrows, and the workspace-wide sweep reports **0** `file:` entries across 82 manifests. The physical install externalized the raw-TS chain and broke `astro sync` / `build` (worker BLOCKER); `de9c6ed` forces `@noodlestan/purrfiles-entities` through Vite's `noExternal` in the `ssr`, `astro`, and `prerender` environments — build green (15 pages). Temporary-exception decisions dropped in this plan and in Plan: Art MD Docs. Report: `./instructions/retire-file-links__report.md`.
- `move-purrfiles-packages` (`22b4c9d`, `af97cc0`, `17ca8eb`) — both packages moved to `$PURRFILES` with `_records/` and knowledge intact; workspace repository record committed; `$ART_MD` lockfile re-resolves `libs/parser`'s `@noodlestan/purrfiles-extract` from the registry (no link arrow). `npm pack` sha256 before/after the move is **byte-identical** for both tarballs — the published-content invariant held (only change: the extract test's `rootDir` re-point, test-only, not in the tarball). `npm run ci` green in `$ART_MD` (8/8) and `$PURRFILES` (2/2); `$PROJECT` + `$ART_MD_WEB` (sync, build 15 pages, lint) unaffected; `npm view` → `0.0.1` both. Inlined instructions — chat report, no report file.
- `update-knowledge-and-plans` (`576e694`, `ae5ed53`) — `$ART_MD_WEB/_guide.md` now documents the delivered stack (8 exact pins, zero `file:` links, the `noExternal` raw-TS rule, deleted `src/lib/signature.ts`), each claim code-checked before writing; the package record gained all 14 runtime pins; milestone Phase 4 rows refreshed (this plan → `DONE`) and four follow-on drafts opened in `4-next/` (`plan-docs-search`, `plan-docs-sidebar`, `plan-in-code-symbol-links`, `plan-non-module-entities`, all `DRAFT`, no iterations yet); parking lot unchanged (nothing of this plan's was ever parked there); purrfiles package records repointed (`Owner: Project: Purrfiles`, `Published: true`, `Status: DEPLOYED`). Inlined instructions — chat report.

### Decisions

- **All signature rendering vanishes** — `src/lib/signature.ts` is deleted whole, including the `paramTags` / `returnsTag` extensions from `fix-docs-rendering` (`d931b76`), treated as throwaway; signature and JSDoc rendering move to `@purrtrait/astro-components`.
- **Canonical helpers own typed access** — `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities` filter on `kind`; no local narrowing anywhere.
- **Routes live under `/docs/api`** — `DOCS_ROOT = '/docs/api'` (`Nest Docs Under API`, `c4a6859`) is this plan's route ground truth; `resolveLink` anchors target `/docs/api/...`.
- **Gaps belong upstream** — if tag, description, param, or member rendering is missing while porting the ApiScreen sections, the fix lands in the purrtrait plans, not in `$ART_MD_WEB`.
- **Declare every dependency directly; prefer npm pins over `file:` links** — cross-repo `file:` links do not resolve transitive workspace deps, so `$ART_MD_WEB` declares each package itself (precedent: `@noodlestan/purrfiles-entities`). Where the package is already published, use an exact npm version instead of a link; `file:` is reserved for packages that do not exist on npm yet. _Replacement recorded by `retire-file-links`: the exception is retired — all eight dependencies are now exact npm pins (`astro-components` `0.0.1`, `jsdoc-renderer` `0.0.2`, `lang-ts` `0.0.12`, `code-renderer` `0.0.11`, `purrfiles-entities` `0.0.1`, `@purrception/lang-ts` `0.1.1`, `shiki` `4.5.0`, `marked` `18.1.2`) and the workspace `file:` sweep is zero._
- **Descriptions render as markdown** — the reference app renders them as plain text; Astro renders markdown so resolver-produced links become real anchors.

### Follow Ups

- Replace the workspace-relative meta sync (`scripts/sync-meta.mjs`) with the config-pinned endpoint fetcher — Plan: Distribute Meta JSON.
- Render in-code symbol links once supported by the Astro components.
- Revisit the `solid-code@0.0.12` manifest: it publishes `@purrtrait/lang-ts` and `@purrtrait/code-renderer` as `*`, the same loose-range defect fixed for `lang-ts` in `ed38271`.
- `libs/purrfiles-entities/package.json` `files` omits `CHANGELOG.md` while siblings (`cli/bin`, `libs/parser`) include it — add it so the changelog ships in the npm tarball.
- Both moved packages still declare `repository.url` `github.com/noodlestan/art-md.git` with `directory: libs/…` — stale after the move, but fixing it changes published content, so correct it at their next release (needs a version bump + republish).
- Vendor a fixture for `createModuleEntityExtractor.test.ts` (or skip when `$ART_MD/libs/parser/src` is absent) so a purrfiles-only clone passes `npm run ci`.

### Feedback

- Step 5's verification `grep -l 'astro-code\|--shiki' …/dist/docs/api/art-md/parser/index.html` targets the package page, which renders no functions/types sections — highlighted markup lives on module pages (e.g. `dist/docs/api/art-md/parser/parse/index.html`); `CodeBlock.astro` emits `pre.shiki` with `--shiki-*` variables, not `astro-code`. Fix the check path in later iterations.
- The root pre-commit hook (`npm run ci`) lints the whole working tree, so uncommitted `_backlog/` files block commits; keep plan and report files formatted (root `npm run lint:fix`) before committing.
- The Step 1 dependency table order was superseded by the step's own "alphabetically sorted" rule; applied true alphabetical order — pinned values unchanged.
- `{@link …}` targets are declared symbols (`ParserConfig`, `BLOCK_TYPES`, …); with `ENTITY_TYPES = ['module']` `createMetaService.resolveLink` returns `undefined` and `JsDocBlock.astro` falls back to plain text (`Could not resolve link for "…"` build logs are expected). Anchors need symbol-level extraction upstream — ties into the in-code symbol links follow-up.
- Check-path and markup wording in Step 5 remain stale: `dist/docs/api/art-md/parser/index.html` is the package page (module markup lives on `.../parse/index.html` etc.); tags emit `<ul class="tags">`; "the `ParserConfig` type page" does not exist as a route — `ParserConfig` renders on the `config` module page.
- Verify `{@link …}` as "mechanism resolves entity targets" rather than "all rendered as anchors" until symbol-level entities exist.
- `npm ci` from `$PROJECT` exits 0 even when the manifest and lockfile disagree, silently reinstalling the stale `file:` links, and `npm install` alone keeps them because the local checkout versions satisfy the new specs. Registry resolution required removing the stale symlinks and an explicit `npm install @purrtrait/astro-components@0.0.1 @purrtrait/lang-ts@0.0.12 -w apps/art-md-web --save-exact`; `retire-file-links` should expect the same pattern for `purrfiles-entities`.
- My `npm publish libs/purrfiles-entities --dry-run` failed on `git ls-remote ssh://git@github.com/libs/purrfiles-entities.git` (`Repository not found`) — a bogus URL no manifest or lockfile declares (`grep` for `git+|github:|ssh://` finds nothing, `npm whoami` was fine) — yet the user's real publish later succeeded with no manifest change. Unexplained; if it recurs on `cli/purrfiles-extract` or the moved packages, capture the npm debug log before changing anything.
- Removing a workspace member does not clean up after itself: `npm install` (and `--package-lock-only`) left the stale lockfile keys and the dangling `node_modules/@noodlestan/purrfiles-*` symlinks behind (`npm ls` said `invalid`). Fix required removing the symlinks + `node_modules/.package-lock.json`, deleting the four lockfile keys by hand, then `npm install` to re-resolve from the registry — extends the stale-link pitfall already recorded for `retire-file-links`.
- `@noodlestan/purrfiles-extract`'s test suite now reaches `$ART_MD/libs/parser/src` through a cross-checkout relative path, so a purrfiles-only clone fails that one test — see Follow Ups.
- `$ART_MD/turbo.json`'s `extract` pipeline lost its two `pkg#build` `dependsOn` entries (the members are no longer in-workspace): art-md now consumes the registry-published dist, so purrfiles rebuilds are invisible to it until a republish.
- "Move resolved items off the parking lot" was a no-op — this plan never parked anything there; future plans should name the concrete items or drop the step.
- No `$PROJECT` record named the rendering stack and the package record had no `Dependencies:` field, so the worker added all 14 runtime pins from `package.json` rather than only the 8 rendering-stack ones (partial records drift fastest).
- Pre-existing inconsistencies surfaced but left untouched (out of this iteration's scope): `plan-componentize-docs` and `plan-author-art-md-docs` still carry `READY`/blocker wording against this plan (now `DONE`); the milestone `Phases` table indexes Docs as `#3` while its section is `Phase: 4`; `$PURRTRAIT/libs/astro-components/_records/package.art` still says `Published: false` though `0.0.1` ships.
- Rebase pulls keep rewriting commit hashes: every tracked hash was rebound to its identical-patch counterpart now on `main` (`9404085`→`c6a7f8c`, `2908387`→`563dee6`, `58105ca`→`e40b703`, `9feb113`→`9b065e3`, `472c20c`→`ee1e661`); `purrtrait` and the two `0.0.1` release commits in `$ART_MD` were untouched. Re-verify hashes against `git log` after any pull before citing them.
