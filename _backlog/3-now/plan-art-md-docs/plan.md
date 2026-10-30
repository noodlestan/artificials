# Plan: Art MD Docs

**ID:** `art-md-docs`

**Status:** `WORKING`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Extract purrception metadata from Art MD packages and publish it as a docs section in the Art MD Astro website.

**Description:** Two coordinated streams. In `$ART_MD`, add two canonical packages — `@noodlestan/purrfiles-entities` (browser-safe entity model and framework-agnostic meta service) and `@noodlestan/purrfiles-extract` (Node/TypeScript module extractor) — then wire an `extract` script into `@art-md/parser` to produce `dist/meta.json`. In `$ART_MD_WEB`, consume `@noodlestan/purrfiles-entities`, load the meta JSON into Astro collections (`entities` and `packages`), and add docs routes for index, package, module, and entity pages. Both purrfiles packages later move to the `noodlestan/purrfiles` repository, which is out of scope.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable       | Resolved Path                      | Purpose                                 |
| -------------- | ---------------------------------- | --------------------------------------- |
| `$WORKSPACE`   | Current working directory          | Workspace root directory.               |
| `$ART_MD`      | `$WORKSPACE/checkouts/art-md`      | Art MD checkout — extraction work.      |
| `$ARTIFICIALS` | `$WORKSPACE/checkouts/artificials` | Artificials checkout — website work.    |
| `$ART_MD_WEB`  | `$ARTIFICIALS/apps/art-md-web`     | Art MD Astro website.                   |
| `$NO_COMPLY`   | `$WORKSPACE/checkouts/no-comply`   | Reference implementation (SolidJS SPA). |

## Summary

Produce a `meta.json` for `@art-md/parser` and render it in the Art MD Astro website as a docs section that lists packages and exposes package, module, and entity routes.

## Context

### Upstream Work

| Kind        | Path                                    | Role                                    |
| ----------- | --------------------------------------- | --------------------------------------- |
| Parking Lot | `$ART_MD/_backlog/_parking-lot.md`      | Art MD actionables and follow-ups.      |
| Parking Lot | `$ARTIFICIALS/_backlog/_parking-lot.md` | Artificials actionables and follow-ups. |

### Knowledge

::READ `$NO_COMPLY/libs/solid-accessibility/scripts/extract.ts` (Reference) — Extraction entry point pattern.
::READ `$NO_COMPLY/cli/meta-extract/src/entities/Module/` (Reference) — Module extractor, matcher, file resolver.
::READ `$NO_COMPLY/libs/meta/src/` (Reference) — Entity model, service API, and entity helpers to copy and decouple.
::READ `$NO_COMPLY/libs/meta/src/createNoComplyMetaService.ts` (Reference) — Service API to copy and decouple.
::READ `$NO_COMPLY/libs/meta/src/types.ts` (Reference) — Service API surface.
::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/` (Reference) — Index, package, module, and entity page layouts.
::READ `$NO_COMPLY/apps/standard-ui-demo/src/providers/Meta/MetaProvider.tsx` (Reference) — How meta JSON is loaded.
::READ `$NO_COMPLY/libs/solid-accessibility/dist/meta.json` (Reference) — Output shape.
::READ `$ART_MD/libs/parser/src/parse/parse.ts` (Source) — First extracted source.
::READ `$ART_MD_WEB/_guide.md` (Guide) — Website setup, verification, deployment.
::READ `$WORKSPACE/_guide.md` (Guide) — Workspace operations and commit conventions.

## Scope

Changes span two checkouts: extraction in `$ART_MD`, presentation in `$ARTIFICIALS`. Only the `@art-md/parser` package is extracted; only the `Module` entity type is rendered.

### (Scope) Package: Purrfiles Entities

**Record:** `$ART_MD/libs/purrfiles-entities/_records/package.art` — New

**Role:** Owns the browser-safe generic entity model and the framework-agnostic meta service.

**Changes:**

- Create the package with canonical name `@noodlestan/purrfiles-entities`.
- Export entity types and the service API with no `solid-js`, TypeScript, or `node:fs` imports.

**Partial:**

- `canonicalName` — `@noodlestan/purrfiles-entities`
- `owner` — Project: Noodlestan Purrception (Planned, not in scope)
- `path` — `libs/purrfiles-entities`
- `note` — Scaffolded in Art MD for convenience (moved to new project later)

### (Scope) Package: Purrfiles Extract

**Record:** `$ART_MD/cli/purrfiles-extract/_records/package.art` — New

**Role:** Owns the Node/TypeScript extractors.

**Changes:**

- Create the package with canonical name `@noodlestan/purrfiles-extract`.
- Add the generic `Module` extractor, matcher, and file resolver; depend on `@noodlestan/purrfiles-entities` and `@purrception/*`.

**Partial:**

- `canonicalName` — `@noodlestan/purrfiles-extract`
- `owner` — Project: Noodlestan Purrception (Planned, not in scope)
- `path` — `cli/purrfiles-extract`
- `note` — Scaffolded in Art MD for convenience (moved to new project later)

### (Scope) Package: Parser

**Record:** `$ART_MD/libs/parser/_records/package.art`

**Role:** First package to produce purrception metadata.

**Changes:**

- Add `scripts/extract.ts` and an `extract` script.
- Emit `dist/meta.json` for the `parse` module.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Hosts the docs section.

**Changes:**

- Consume `@noodlestan/purrfiles-entities` for the meta service, add `entities` and `packages` collections, and docs routes.

**Dependencies:**

- `@art-md/parser` meta JSON must exist before collections can be validated end-to-end.

## Execution Context

Execution from `$WORKSPACE/`. Extraction work is performed in `$ART_MD` on branch `main`; website work is performed in `$ARTIFICIALS` on branch `main`.

---

## Items:

| Iteration / Instructions           | Status  |
| ---------------------------------- | ------- |
| Iteration: Add Purrfiles Entities  | `DONE`  |
| Iteration: Add Purrfiles Extract   | `DONE`  |
| Iteration: Extract Art MD Meta     | `DONE`  |
| Iteration: Create Docs Collections | `READY` |
| Iteration: Add Docs Index          | `DRAFT` |
| Iteration: Add Docs Routes         | `DRAFT` |

### Iteration: Add Purrfiles Entities

**Id:** `add-purrfiles-entities`

**Status:** `DONE`

**Purpose:** Create the browser-safe entity model and meta service as a canonical package.

**Description:** New `$ART_MD/libs/purrfiles-entities` package, decoupled from `$NO_COMPLY/libs/meta`, exporting generic entity types and the framework-agnostic service.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-purrfiles-entities.md`

**Report:** `./instructions/add-purrfiles-entities__report.md`

**Changes:**

- Create `$ART_MD/libs/purrfiles-entities/` package (config, build, records, README, guide) with canonical name `@noodlestan/purrfiles-entities`; `type: module`, `sideEffects: false`, publishable.
- Add generic `PurrfilesEntityPartial` / `PurrfilesEntityData` types extending `EntityDataBase`, with `path` and a concrete `Module` type carrying `functions` (named `helpers` when first authored, renamed when file discovery was generalised); declared symbols may hold both type and function declarations.
- Copy and rename `createNoComplyMetaService` to `createMetaService`, keeping the docs subset: `getEntities`, `getPackageNames`, `hasPackage`, `getPackageModuleNames`, `getModuleMaybe`, `getModuleEntities`, `getEntityMaybe`, and optional `resolveLink`.
- Add the entity helpers `getEntityTypes` and `getEntityFunctions`.
- Enforce browser-safe imports: no `solid-js`, `typescript`, `node:fs`, or `@purrception/lang-ts-extract`.
- Add unit tests for package and module reduction.

**Dependencies:**

- None.

#### Commits:

| ID                       | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ------------------------ | ------------------------------ | -------- | --------- | ----------- |
| `add-purrfiles-entities` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `b87253f` | `COMMITTED` |

##### Commit: `add-purrfiles-entities`

**Message:**

```text
build(purrfiles-entities): Add generic entity model and meta service.
```

### Iteration: Add Purrfiles Extract

**Id:** `add-purrfiles-extract`

**Status:** `DONE`

**Purpose:** Create the Node/TypeScript extraction package that consumes the entity model.

**Description:** New `$ART_MD/cli/purrfiles-extract` package with the generic module extractor built on `@purrception/source-fs` and `@purrception/lang-ts-extract`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-purrfiles-extract.md`

**Report:** `./instructions/add-purrfiles-extract__report.md`

**Changes:**

- Create `$ART_MD/cli/purrfiles-extract/` package (config, build, records, README, guide) with canonical name `@noodlestan/purrfiles-extract`.
- Add `createModuleEntityExtractor` with module matcher, file resolver, and entity extractor. The matcher accepts any non-empty directory under the root (subdirectories recurse) and sets `module` to the parent directory name; the root directory never yields an entity.
- Resolver rules: `index.*` → docs source; else the same-name entry file (for example `parse/parse.ts`); `types.*` → types; every other non-test, non-declaration source file → symbol sources (so `constants.ts` is read). Directories holding no source files yield no module.
- Expose `createModuleEntityExtractor({ extensions, ignore, skipSubDirs })`; default to TypeScript extensions, no ignores, recursion on.
- Depend on `@noodlestan/purrfiles-entities` for the entity types.
- Add a fixture test proving `src/parse/` yields Module `parse` with function `parse`.

**Dependencies:**

- Iteration: Add Purrfiles Entities.

#### Commits:

| ID                      | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ----------------------- | ------------------------------ | -------- | --------- | ----------- |
| `add-purrfiles-extract` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `8e294dc` | `COMMITTED` |

##### Commit: `add-purrfiles-extract`

**Message:**

```text
build(purrfiles-extract): Add generic module entity extractor.
```

### Iteration: Extract Art MD Meta

**Id:** `extract-art-md-meta`

**Status:** `DONE`

**Purpose:** Produce the first real `meta.json` from `@art-md/parser`.

**Description:** Add the extraction script to the parser package, wire it into the monorepo, and verify the output contains the `parse` module.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/extract-art-md-meta.md`

**Report:** `./instructions/extract-art-md-meta__report.md`

**Changes:**

- Add `$ART_MD/libs/parser/scripts/extract.ts` calling `extractEntitiesFromFileSystem` with `rootDir: 'src/'`, the module extractor, `ignore: ['private', 'test']`, and `meta: { package: '@art-md/parser' }`; write `dist/meta.json`.
- Add `"extract": "tsx scripts/extract.ts"` and the required dev dependencies (`@noodlestan/purrfiles-extract`, `@purrception/source-fs`, `@purrception/lang-ts-extract`, `tsx`).
- Replace the root `"extract": "echo no purrception yet"` with `"extract": "turbo run extract"`, and add the `extract` task to `$ART_MD/turbo.json` (`dependsOn: ["^build"]`, `cache: false`, `outputs: ["dist/meta.json"]`) so extraction always has built dependencies.
- Add the `0-build-deps` step to `$ART_MD/lefthook.yml` so the pre-commit `1-extract` runs against built `dist/` output (resolves the `BLOCKER` in the report).
- Verify `dist/meta.json` contains Module `parse` with `functions: ["parse"]`; run `npm run ci` from `$ART_MD`.

**Dependencies:**

- Iteration: Add Purrfiles Extract.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| --------------------- | ------------------------------ | -------- | --------- | ----------- |
| `extract-art-md-meta` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `8e294dc` | `COMMITTED` |

##### Commit: `extract-art-md-meta`

**Message:**

```text
build(parser): Add purrception metadata extraction.
```

**Note:** Never created as a standalone commit. The worker hit a `BLOCKER` (see report) and the iteration was reworked during history reorganisation: its wiring landed in `8e294dc` together with the extractor fixes and the hook correction the blocker required.

### Iteration: Create Docs Collections

**Id:** `create-docs-collections`

**Status:** `READY`

**Purpose:** Load the meta JSON into Astro collections so pages can be generated statically.

**Description:** Consume the meta service from `@noodlestan/purrfiles-entities`, sync the meta JSON, and define `entities` and `packages` collections with custom loaders.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/create-docs-collections.md`

**Report:** `./instructions/create-docs-collections__report.md`

**Changes:**

- Add `@noodlestan/purrfiles-entities` as a dependency of `$ART_MD_WEB` via `file:../../../art-md/libs/purrfiles-entities` (npm links it; `$ART_MD` must be built first).
- Add `$ART_MD_WEB/scripts/sync-meta.mjs` copying `$ART_MD/libs/parser/dist/meta.json` to `$ART_MD_WEB/src/data/meta.json`; run it from `dev`, `build`, and an `extract` script.
- Add `$ART_MD_WEB/src/content.config.ts` with:
  - `entities` — one entry per meta entity, id `{package}/{type}/{name}`, data validated by a generic entity schema.
  - `packages` — one entry per package, reduced through `createMetaService` (name, module names, entity count).
- Add `$ART_MD_WEB/src/lib/routes.ts` with helpers for package, module, and entity hrefs (`/docs/{ns}/{pkg}/...`).
- Run `astro sync` and `astro build` to validate loaders.

**Dependencies:**

- Iteration: Add Purrfiles Entities.
- Iteration: Extract Art MD Meta.

#### Commits:

| ID                        | Repository / Checkout / Branch        | Policy   | Hash  | Status     |
| ------------------------- | ------------------------------------- | -------- | ----- | ---------- |
| `create-docs-collections` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `create-docs-collections`

**Message:**

```text
build(art-md-web): Add docs entities and packages collections.
```

### Iteration: Add Docs Index

**Id:** `add-docs-index`

**Status:** `DRAFT`

**Purpose:** Ship a first visible docs page listing packages.

**Description:** Add `/docs` using the `packages` collection, plus a Docs link in the site navigation.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add `$ART_MD_WEB/src/pages/docs/index.astro` listing packages from `getCollection('packages')`, with module counts and links.
- Add a Docs entry to `$ART_MD_WEB/src/components/site/SiteNav.astro`.
- Keep styling consistent with the existing Astro site components.

**Dependencies:**

- Iteration: Create Docs Collections.

#### Commits:

| ID               | Repository / Checkout / Branch        | Policy   | Hash  | Status     |
| ---------------- | ------------------------------------- | -------- | ----- | ---------- |
| `add-docs-index` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `add-docs-index`

**Message:**

```text
build(art-md-web): Add docs index listing packages.
```

### Iteration: Add Docs Routes

**Id:** `add-docs-routes`

**Status:** `DRAFT`

**Purpose:** Complete the docs navigation from package to module to entity.

**Description:** Add package, module, and entity pages generated from the collections, with a `Module` entity view.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add `docs/[ns]/[pkg].astro` — package page listing modules.
- Add `docs/[ns]/[pkg]/[mod].astro` — module page listing entities, functions, and types.
- Add `docs/[ns]/[pkg]/[mod]/[type]/[ent].astro` — entity page with a type switch; only `Module` is rendered in v1.
- Add docs components: breadcrumbs, entity summary, entities section, functions section, types section.
- Generate `getStaticPaths` from the collections; return 404 for unknown ids.

**Dependencies:**

- Iteration: Add Docs Index.
- Iteration: Create Docs Collections.

#### Commits:

| ID                | Repository / Checkout / Branch        | Policy   | Hash  | Status     |
| ----------------- | ------------------------------------- | -------- | ----- | ---------- |
| `add-docs-routes` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `add-docs-routes`

**Message:**

```text
build(art-md-web): Add docs package, module, and entity routes.
```

## Work

### Next

Delegate Iteration: Create Docs Collections (`READY`, commit `AUTHORED`) to a worker, then record the outcome. This is the first iteration in `$ARTIFICIALS`.

### Blockers

- None.

---

## Operating Instructions

### Setting Up

Run from `$ART_MD` and `$ARTIFICIALS` roots:

```bash
npm ci
```

### Verifying Completion

Run from `$ART_MD`:

```bash
npm run ci
npm run extract
```

Run from `$ART_MD_WEB`:

```bash
npm run lint
npm run build
```

---

## Coordination

### Not In Scope

- **SolidJS SPA changes** — No Comply is reference only.
- **Purrfiles repository migration** — creating `noodlestan/purrfiles` is out of scope; both packages live temporarily under `$ART_MD`.
- **Search** — the docs index lists packages without search in v1.
- **Other packages and entity types** — only `@art-md/parser` and `Module` in v1.
- **Publishing** — no npm release or deployment in this plan.

### Evidence

- `$ART_MD/libs/parser/dist/meta.json` contains 4 Module entities (`buildDocument`, `config`, `mdast`, `parse`); Module `parse` has `functions: ["parse"]` and `description: "Module: parse — turns Art MD source into Art documents."`. The file is gitignored — it is produced by `npm run extract` from `$ART_MD`.
- `@noodlestan/purrfiles-entities` builds, lints, and passes 26 unit tests in `$ART_MD`; full `npm run ci` passes 9 turbo tasks.
- `$ART_MD` installs `@purrception/lang-ts-extract@0.1.1`, `@purrception/lang-ts@0.1.1`, `@purrception/source-fs@0.1.1`, and `@purrception/primitives@0.1.0`.
- Pending (iterations 4–6): `$ART_MD_WEB` builds and `/docs` lists `@art-md/parser`.

### Decisions

- **Two purrfiles packages** — `@noodlestan/purrfiles-entities` remains browser-safe (types + service); `@noodlestan/purrfiles-extract` owns the Node/TypeScript extractors.
- **Generic entity model** — one `PurrfilesEntityData` shape with `symbols.declared` carrying both types and functions; no product-specific entity types, plus a concrete `Module` type in v1.
- **Service lives in entities** — the website consumes `@noodlestan/purrfiles-entities`; it does not copy the service.
- **Temporary home** — both packages are created under `$ART_MD` until moved to `noodlestan/purrfiles`; the move is out of scope.
- **Meta JSON is synced, not imported cross-repo** — a script copies `dist/meta.json` into the app.
- **Route shape** — `/docs/{ns}/{pkg}/{mod}/{type}/{ent}` mirrors the No Comply demo and handles scoped package names.
- **Module fallback** — directories without an index file use their same-name file as entry and docs source; directories holding nothing but subdirectories are not modules.
- **Extractor options** — `createModuleEntityExtractor({ extensions, ignore, skipSubDirs })` is freeform `purrfiles-extract` config extending the standard `@purrception/source-fs` `DirectoryExtractorOptions`. Defaults: TypeScript extensions only (no `.js` — `lang-ts-extract` has no `allowJs`), `ignore: []`, `skipSubDirs: false`. `@art-md/parser` extracts with `ignore: ['private', 'test']`.
- **Entities reach the site via a `file:` link** — `$ART_MD` and `$ARTIFICIALS` are separate repositories with their own package roots, so npm workspaces cannot resolve `@noodlestan/purrfiles-entities` by name. `$ART_MD_WEB` declares it as `file:../../../art-md/libs/purrfiles-entities`; publishing stays out of scope. This is an explicit exception to the exact-version rule in `_ops/packages/policy.md`, valid only while both purrfiles packages remain temporary residents of `$ART_MD`.
- **Hashes refreshed 2026-10-30** — the commit hashes recorded in this plan now match current `main` in `$ART_MD` (`b87253f`, `8e294dc`).
- **Instructions mode** — all iterations use self-contained files because each touches multiple files or needs code-level detail.

### Follow Ups

- Create "Repository: Noodlestan Purrception" and "Project: Noodlestan Purrception"
- Move `@noodlestan/purrfiles-entities` and `@noodlestan/purrfiles-extract` to the `noodlestan/purrfiles` repository and initialize knowledge there.
- Extract remaining Art MD packages, load all `meta.json` files in the docs, render all pacakges.
- Add sidebar (visible on all pages except homepage and about).
- Add search to the docs index.
- Add routes and section components for additional entity types.
- Create "Repository: Noodlestan Purrtrait" and "Project: Noodlestan Purrtrait"
- Extract the entity rendering components to an "astro entities" package in Noodlestan Purrtrait (name TBD)
- Extract the entity search interactions to a "solids components" — either in in Noodlestan Purrtrait (name TBD), in case it depends on `@noodlestan/purrfiles-entities` shapes — or in `@purrtrait/solid-search` in case it depends only on generic entity shapes.

### Feedback

- Plan record omits template sections `Domains`, `Workflows`, `Workflow Operations`, `Required Skills`, `Resource Types in Scope`, `Findings`, and `Knowledge to Update`. These do not affect workers, whose entry point is a self-contained instructions file.
