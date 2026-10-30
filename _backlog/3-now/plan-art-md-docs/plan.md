# Plan: Art MD Docs

**ID:** `art-md-docs`

**Status:** `DONE`

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
| Iteration: Create Docs Collections | `DONE`  |
| Iteration: Add Docs Index          | `DONE`  |
| Iteration: Add Docs Routes         | `DONE`  |
| Iteration: Document Parser API     | `READY` |
| Iteration: Fix Docs Rendering      | `READY` |

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

**Status:** `DONE`

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

| ID                        | Repository / Checkout / Branch        | Policy   | Hash      | Status      |
| ------------------------- | ------------------------------------- | -------- | --------- | ----------- |
| `create-docs-collections` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | `569a610` | `COMMITTED` |

##### Commit: `create-docs-collections`

**Message:**

```text
build(art-md-web): Add docs entities and packages collections.
```

### Iteration: Add Docs Index

**Id:** `add-docs-index`

**Status:** `DONE`

**Purpose:** Ship a first visible docs page listing packages.

**Description:** Add `/docs` using the `packages` collection, plus a Docs link in the site navigation.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-docs-index.md`

**Report:** `./instructions/add-docs-index__report.md`

**Changes:**

- Add `$ART_MD_WEB/src/pages/docs/index.astro` listing packages from `getCollection('packages')`, with module counts and links.
- Add a Docs entry to `$ART_MD_WEB/src/components/site/SiteNav.astro`.
- Keep styling consistent with the existing Astro site components.

**Dependencies:**

- Iteration: Create Docs Collections.

#### Commits:

| ID               | Repository / Checkout / Branch        | Policy   | Hash      | Status      |
| ---------------- | ------------------------------------- | -------- | --------- | ----------- |
| `add-docs-index` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | `b50f9a8` | `COMMITTED` |

##### Commit: `add-docs-index`

**Message:**

```text
build(art-md-web): Add docs index listing packages.
```

### Iteration: Add Docs Routes

**Id:** `add-docs-routes`

**Status:** `DONE`

**Purpose:** Complete the docs navigation from package to module to entity.

**Description:** Add package, module, and entity pages generated from the collections, with a `Module` entity view.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/add-docs-routes.md`

**Report:** `./instructions/add-docs-routes__report.md`

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

| ID                | Repository / Checkout / Branch        | Policy   | Hash      | Status      |
| ----------------- | ------------------------------------- | -------- | --------- | ----------- |
| `add-docs-routes` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | `d186036` | `COMMITTED` |

##### Commit: `add-docs-routes`

**Message:**

```text
build(art-md-web): Add docs package, module, and entity routes.
```

### Iteration: Document Parser API

**Id:** `document-parser-api`

**Status:** `READY`

**Purpose:** Give `@art-md/parser` a documented API so the docs site has something to render.

**Description:** Add JSDoc to every source file in `$ART_MD/libs/parser`, including `private/`; add the missing barrel file for the public `parse` module and give each public barrel its own module-level `/** */` above the exports; document `ParserConfig` members.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Work from `$ART_MD/libs/parser`. Mandatory reading for the two modules `knowledge/api.md` documents — `config` and `parse` — is `$ART_MD/libs/parser/knowledge/api.md`; take wording from it rather than inventing new descriptions. Also read `$ART_MD/libs/parser/knowledge/parser.md` for the `buildDocument` visit loop and the mdast mapping.

1. **Barrel files.** `src/parse/` has no `index.ts`; every other public module has one. Add `src/parse/index.ts` exporting `parse` (value) and the types it is the canonical home of. Then give every public barrel — `src/index.ts`, `src/buildDocument/index.ts`, `src/config/index.ts`, `src/mdast/index.ts`, `src/parse/index.ts` — a module-level `/** */` directly above its export block, describing what the module contributes. `src/private/index.ts` is internal and gets no barrel-level claim beyond a short line saying it is private.
2. **Every exported symbol gets JSDoc.** Cover all of `src/`, including `src/private/` and `src/test/` helpers: `buildDocument`, `createDefaultParserConfig`, `isBlockType`, `BLOCK_TYPES`, `parse`, `createDocumentVisitContext`, and the type declarations (`ParserConfig`, `DocumentVisitContext`, `HandleResult`, and the rest).
3. **Multi-line and human readable.** A summary line, then a blank `*` line, then body paragraphs where the behaviour needs explaining. Do not write one-line telegraphic stubs. Wrap to a readable width; do not let a single sentence run the width of the file.
4. **Canonical `@param` tags on every function.** Each parameter gets its own `@param {Type} name - description.`, then `@returns {Type} description.` for functions that return. Match the signature exactly — `buildDocument` takes `defaultConstruct`, `constructParsers`, `docContext`; `parse` takes `markdown`, `config`, and its overloads take a `context` first. Where an overload set exists, document the implementation signature once rather than repeating identical tags per overload.
5. **`ParserConfig` members.** In `src/config/types.ts`, put `/** */` above the `defaultConstruct` and `constructs` members individually, taking the description from `knowledge/api.md`: `defaultConstruct` is the fallback factory used when no construct claims a node; `constructs` is the ordered list of factories consulted during parsing.
6. **Keep behaviour untouched.** This is a comments-and-barrels change. No signature, logic, or export-list changes beyond adding `src/parse/index.ts`. If adding a barrel would change what `src/index.ts` re-exports, keep the root export list exactly as it is.

**Validate** by running `npm run ci` from `$ART_MD`, then confirming `meta.json` changed: from `$ART_MD` run `npm run extract` and check that `libs/parser/dist/meta.json` now carries a `description` on `buildDocument`, `config`, `mdast`, `isBlockType`, and `createDefaultParserConfig`, and a non-empty `paramTags` on `buildDocument`. If any description is still absent, its JSDoc is missing or mis-attached — fix it before committing.

**Changes:**

- Add JSDoc across `$ART_MD/libs/parser/src`, including `private/` and test helpers.
- Add `$ART_MD/libs/parser/src/parse/index.ts` and module-level JSDoc to all public barrels.
- Add member JSDoc to `ParserConfig.defaultConstruct` and `ParserConfig.constructs`.
- Re-extract and verify descriptions and `paramTags` land in `dist/meta.json`.

**Dependencies:**

- Iteration: Extract Art MD Meta.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| --------------------- | ------------------------------ | -------- | ----- | ---------- |
| `document-parser-api` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `document-parser-api`

**Message:**

```text
docs(package-parser): Document the parser API with JSDoc.
```

### Iteration: Fix Docs Rendering

**Id:** `fix-docs-rendering`

**Status:** `READY`

**Purpose:** Correct where the plan was faulty, so the site stops rendering functions as types and starts rendering the documentation the site was meant to show.

**Description:** Two defects in instructions this plan authored, both found after delivery: types were derived without filtering on `kind`, and signature rendering ignored JSDoc entirely.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

1. **Stop hand-rolling the type filter.** In `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod].astro` and `.../[mod]/[type]/[ent].astro`, replace the `Object.values(declared).map(toDeclaredType)` sweeps with `getEntityTypes` from `@noodlestan/purrfiles-entities`, and use `getEntityFunctions` in place of the manual `toDeclaredFunction` mapping over `entry.data.functions`. Both helpers already exist and already filter on `kind`. This removes the phantom `Types` entry on `buildDocument`, `mdast`, and `parse`, and drops the stray duplicate on `config`.
2. **Render what the source documents.** Extend `$ART_MD_WEB/src/lib/signature.ts` so a function renders each parameter's `paramTags` description alongside its name and type, and appends `returnsTag` when present. Keep the existing kind-based `renderType` fallback unchanged.
3. **Check `types` on object members too**, so a member carrying a `description` shows it under its name.

Do not restructure components, add styling, or change route shapes.

**Validate** by running `npm run build` from `$ART_MD_WEB` and confirming: `dist/docs/art-md/parser/buildDocument/index.html` has no `Types` section; `dist/docs/art-md/parser/config/index.html` has exactly one type (`ParserConfig`); and parameter descriptions from iteration `document-parser-api` appear in the rendered signature.

**Changes:**

- Use `getEntityTypes` / `getEntityFunctions` in both docs pages.
- Render `paramTags` and `returnsTag` in `src/lib/signature.ts`.
- Render member descriptions on object type members.

**Dependencies:**

- Iteration: Document Parser API.
- Iteration: Add Docs Routes.

#### Commits:

| ID                   | Repository / Checkout / Branch        | Policy   | Hash  | Status     |
| -------------------- | ------------------------------------- | -------- | ----- | ---------- |
| `fix-docs-rendering` | Artificials / `$ARTIFICIALS` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `fix-docs-rendering`

**Message:**

```text
fix(art-md-web): Render types through canonical helpers and show JSDoc.
```

## Work

### Next

Execute Iteration: Document Parser API (`READY`) in `$ART_MD`, then Iteration: Fix Docs Rendering (`READY`) in `$ARTIFICIALS`. Both instructions are inlined; no delegation required. The six delivered iterations remain `DONE` and unpushed.

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
- Iteration 4 executed as commit `569a610` (not pushed): `$ART_MD_WEB/src/content.config.ts` exports `entities` and `packages`, `$ART_MD_WEB/src/lib/routes.ts` maps `@art-md/parser` → `/docs/art-md/parser`, and the full website build (`astro sync` + `astro build`, 4 pages) passes through the root `npm run ci` pre-commit hook.
- Iteration 5 executed as commit `b50f9a8` (not pushed): `/docs` lists packages from the `packages` collection, with module counts and links, and a Docs entry was added to the site navigation.
- Iteration 6 executed as commit `d186036` (not pushed): package, module, and entity routes render from the collections — 14 pages build; `dist/docs/art-md/parser/parse/module/parse/index.html` exists; the `config` module page lists `createDefaultParserConfig` and `ParserConfig`; the entities section hides for all four v1 modules; lint passes after build; pre-commit hook passes without `--no-verify`.

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
- **Hashes refreshed 2026-10-30** — the commit hashes recorded in this plan now match current `main` in `$ART_MD` (`b87253f`, `8e294dc`) and in `$ARTIFICIALS` (`569a610`).
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
- Generated content must be listed in both `.gitignore` and `.prettierignore`, and linted **after** it is regenerated: `src/data/meta.json` satisfies git but not the app-level `prettier . -c` that runs during the pre-commit hook. Lint steps in future instructions must run `lint:fix` → build/extract → `lint`.
- `$ART_MD` has no root `build` script; its canonical entry point is `npm run ci`, which builds every package via turbo (`^ci` → `build`) and then runs `extract`. Setting Up must name `npm run ci`, not `npm run build`.
- A linked cross-repo package that externalises `@purrception/*` TypeScript-source dependencies cannot be imported by plain `node`; verify such links through a bundler-aware runner (`npx tsx -e`) and assert only the required exports, not a full export list.
- In Astro 7 the build-mode data store resolves to `apps/art-md-web/node_modules/.astro/data-store.json`; `.astro/data-store.json` no longer exists, and `astro sync` declares collections in the generated `.astro/content.d.ts`.
- Astro app dependencies hoist into the checkout root, so shared-package paths in mandatory reading must resolve through `$ARTIFICIALS/node_modules`, not `$WORKSPACE/node_modules` — the workspace root installs only its own dev dependencies.
