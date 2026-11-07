# Plan: Author Art MD Docs

**ID:** `author-art-md-docs`

**Status:** `DONE`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Author JSDoc-driven documentation for all five public Art MD packages and publish it — including revisiting the already-documented parser once its dependencies can be linked — then extend the Art MD Website to document every package and add the site's root docs.

**Description:** Today only `@art-md/parser` runs extraction, so only `@art-md/parser` is documented. This plan takes the remaining four public packages — `@art-md/primitives`, `@art-md/constructs`, `@art-md/serializer`, `@art-md/codec` — through extraction and authored copy, revisits `parser` third in line (after `primitives` and `constructs` publish, so cross-package `{@link}` targets finally exist to link to, and so the parser's copy can be adjusted against the new rules), refreshes the Art MD Website to render all five packages, and finishes with the site's root docs. Every package iteration ends in a published version with a changelog, a bumped `package.json`, an updated `package-lock.json`, and its dependencies re-pinned to the versions published earlier in this plan. All iterations carry inlined instructions.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                      | Purpose                                          |
| ------------- | ---------------------------------- | ------------------------------------------------ |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                        |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone.           |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | The website that documents the packages.         |
| `$ART_MD`     | `$WORKSPACE/checkouts/art-md`      | Source project — all five packages live here.    |
| `$PARSER`     | `$ART_MD/libs/parser`              | The extraction script to copy; documented first. |

## Summary

Give every public Art MD package an extraction pass and authored JSDoc, publishing each with fresh versions and updated inter-package pins; then point the Art MD Website at all five metas and write the site's getting-started, usage, and integrations pages.

## Context

### Upstream Work

| Kind      | Path                                                               | Role                                    |
| --------- | ------------------------------------------------------------------ | --------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md` | Phase 4 coordination; Follow Ups entry. |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification.
::READ `$ART_MD/_guide.md` (Guide) — Extraction monorepo layout, setup, and verification.
::READ `$PARSER/scripts/extract.ts` (Source) — The extraction script every other package copies (`createModuleEntityExtractor`, `ignore: ['private', 'test']`, writes `dist/meta.json`).
::READ `$ART_MD_WEB/src/content.config.ts` (Source) — Single-meta consumer this plan generalises to five.
::READ `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` (Conventions) — Exact-pin model for every dependency bump.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Commit message format.

## Authoring Rules

These rules govern every copy change in this plan. They are restated in each iteration's instructions.

- **Docs are based on the parsed JSDoc** — the extractor's output is the starting point; authoring adjusts, never replaces, the data.
- **Modules with few exports get a one-liner** — a module exporting one or two functions/types does not earn a paragraph.
- **Module and symbol descriptions never repeat each other** — the module description explains _what these things are for and when to use them_; the function/type description explains _what this one thing is_. Example for art-md: `parse` is the main entry point; the other functions are exposed so consumers can recompose the parser if needed — that "what/when" lives on the module, not restated on every function.
- **Cross-package links use the qualified form** — once a target package is documented, `{@link pkg:module#Symbol}`; targets with no docs page stay unqualified and render as plain text.

## Scope

Five packages in `$ART_MD` are documented and published; the website in `$PROJECT` consumes them all.

### (Scope) Packages: Art MD Public API

**Record:** `$ART_MD/libs/{package}/_records/package.art` (each)

**Role:** The documented, published API surface.

**Changes:**

- Add the extraction script (copied from `$PARSER/scripts/extract.ts`, `meta.package` set per package) to `primitives`, `constructs`, `serializer`, `codec`.
- Apply the Authoring Rules to each package's module and symbol JSDoc.
- Each iteration: new version (next after the previous one: `primitives` `0.0.8`, `constructs` `0.0.8`, `parser` `0.0.8`, `serializer` `0.0.7`, `codec` `0.0.6`), `CHANGELOG.md` entry, `package.json` bump, root `package-lock.json` refreshed, dependencies re-pinned to the versions this plan just published, `npm publish` (user gate).
- The dependency graph dictates the order and is satisfied by it: `primitives` (no deps) → `constructs` (deps `primitives`) → `parser` (deps `primitives`, `constructs`) → `serializer` (deps `primitives`, `constructs`) → `codec` (deps all four).

**Dependencies:**

- Plan: Distribute Meta JSON — `parser` `0.0.7` with `prepack` must ship first; `parser`'s own revisit here is `0.0.8`.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Documents all five packages and hosts the site's root docs.

**Changes:**

- Add five entries to `meta-docs.config.mts` (the fetcher from Plan: Distribute Meta JSON) at the versions this plan published; `npm run fetch-meta` downloads and merges all five `entities` arrays into the collection `content.config.ts` already reads.
- The routing helpers (`packageParts`, `packageHref`, `entityHref`) are already package-aware; no `@art-md/*` dependencies are added to the site.
- Author `docs/getting-started`, `docs/usage`, `docs/integrations` — the integrations page links `https://github.com/noodlestan/art-js` and `https://github.com/noodlestan/art-lib` by GitHub URL (neither has docs yet).

**Dependencies:**

- All five package iterations.

## Execution Context

Executed from `$WORKSPACE/`. Package work happens in `$ART_MD` on branch `main`; website work in `$PROJECT` on branch `main`. The package iterations live in `$ART_MD` and cannot collide with other plans. The two website iterations edit `meta-docs.config.mts` and pages — no dependencies, no lockfile — so their overlap with Plan: Integrate Purrtrait and Shiki (which edits dependencies) is only commit ordering in the same repo.

---

## Items:

| Iteration / Instructions       | Status |
| ------------------------------ | ------ |
| Iteration: Document Primitives | `DONE` |
| Iteration: Document Constructs | `DONE` |
| Iteration: Revisit Parser      | `DONE` |
| Iteration: Document Serializer | `DONE` |
| Iteration: Document Codec      | `DONE` |
| Iteration: Refresh API Docs    | `DONE` |
| Iteration: Write Root Docs     | `DONE` |

### Iteration: Document Primitives

**Id:** `document-primitives`

**Status:** `DONE`

**Purpose:** First extraction pass — foundational types become documented.

**Description:** `@art-md/primitives` gains the extraction script and authored copy, then publishes.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Copy `$PARSER/scripts/extract.ts` into `$ART_MD/libs/primitives/scripts/extract.ts` with `meta.package` set to `@art-md/primitives`; add the `extract` script and its dependencies (`@noodlestan/purrfiles-extract` from the workspace, `@purrception/source-fs`, `tsx`) to the package manifest, following how `$PARSER` declares them. Run it and confirm `dist/meta.json` is written. Apply the Authoring Rules to `primitives`' module and symbol JSDoc — foundational packages tend toward the one-liner rule. `primitives` has no Art MD dependencies, so nothing to re-pin. Bump to `0.0.8`, write the `CHANGELOG.md` entry, refresh the root `package-lock.json`, stop and hand the version to the user for `npm publish`, and confirm with `npm view @art-md/primitives version`.

**Report:** `./instructions/document-primitives__report.md`

**Changes:**

- Add extract script + `extract` script entry; generate `dist/meta.json`.
- Author copy per the Authoring Rules.
- Bump `0.0.8`, changelog, lock; publish (user gate).

**Dependencies:**

- None.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------- | ------------------------------ | -------- | --------- | ----------- |
| `author-primitives`  | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `7dc5ad5` | `COMMITTED` |
| `release-primitives` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `f14a377` | `COMMITTED` |

##### Commit: `author-primitives`

**Message:**

```text
docs(primitives): Add extraction and author module copy.
```

##### Commit: `release-primitives`

**Message:**

```text
release(primitives): 0.0.8
```

### Iteration: Document Constructs

**Id:** `document-constructs`

**Status:** `DONE`

**Purpose:** The largest public library gets extraction and authored copy.

**Description:** `@art-md/constructs` (154 source files) follows the same pass, re-pinning its `primitives` dependency.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Copy the extraction script as in the previous iteration with `meta.package` set to `@art-md/constructs`; run it and confirm `dist/meta.json`. Apply the Authoring Rules — with 154 files this is where the module-versus-symbol non-repetition rule earns its keep: module descriptions say what the constructs are for and when to reach for them; individual factory and type descriptions stay on their own behaviour. In the package manifest, re-pin `@art-md/primitives` to `0.0.8` (published in the previous iteration). Bump `constructs` to `0.0.8`, changelog, refresh the root lock, stop for the user's `npm publish`, confirm with `npm view`.

**Report:** `./instructions/document-constructs__report.md`

**Changes:**

- Add extract script; generate `dist/meta.json`.
- Author copy per the Authoring Rules; re-pin `@art-md/primitives` `0.0.8`.
- Bump `0.0.8`, changelog, lock; publish (user gate).

**Dependencies:**

- Iteration: Document Primitives.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------- | ------------------------------ | -------- | --------- | ----------- |
| `author-constructs`  | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `d1d6602` | `COMMITTED` |
| `release-constructs` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `a378ff2` | `COMMITTED` |

##### Commit: `author-constructs`

**Message:**

```text
docs(constructs): Add extraction and author module copy.
```

##### Commit: `release-constructs`

**Message:**

```text
release(constructs): 0.0.8
```

### Iteration: Revisit Parser

**Id:** `revisit-parser`

**Status:** `DONE`

**Purpose:** Link the parser to its now-documented dependencies and adjust its copy against the Authoring Rules.

**Description:** Third in line by design: `primitives` and `constructs` are published, so the parser's cross-package `{@link}` targets exist, and the parser's own copy can be reconciled with the rules.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Re-author the parser's cross-package links to the qualified form now that targets exist: `{@link ParseContext}` and `{@link ArtDocument}` become `{@link primitives:<owning-module>#ParseContext}`-style targets (discover the owning module from `@art-md/primitives`' `dist/meta.json`; the same for anything living in `constructs`). In-package targets already use `entity#symbol` from the corrective iteration — keep them. Apply the Authoring Rules to the parser's own copy, using the canonical example: the module description carries "what/when" — `parse` is the main entry point, the other functions are exposed so consumers can recompose the parser if needed — and the per-function descriptions do not repeat it. Re-pin `@art-md/primitives` and `@art-md/constructs` to `0.0.8`. Bump `parser` to `0.0.8` (after Distribute Meta JSON's `0.0.7`), changelog, refresh the lock, stop for the user's `npm publish`, confirm with `npm view`, then re-run `npm run extract` so `dist/meta.json` carries the new links.

**Report:** `./instructions/revisit-parser__report.md`

**Changes:**

- Qualify cross-package `{@link}` targets; adjust copy per the Authoring Rules.
- Re-pin `primitives` and `constructs` `0.0.8`; regenerate meta.
- Bump `0.0.8`, changelog, lock; publish (user gate).

**Dependencies:**

- Iteration: Document Constructs.
- Plan: Distribute Meta JSON (`parser` `0.0.7` shipped with `prepack`).

#### Commits:

| ID               | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| ---------------- | ------------------------------ | -------- | --------- | ----------- |
| `revisit-parser` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `6abf01c` | `COMMITTED` |
| `release-parser` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `9a70c03` | `COMMITTED` |

##### Commit: `revisit-parser`

**Message:**

```text
docs(parser): Qualify cross-package links; align copy with authoring rules.
```

##### Commit: `release-parser`

**Message:**

```text
release(parser): 0.0.8
```

### Iteration: Document Serializer

**Id:** `document-serializer`

**Status:** `DONE`

**Purpose:** Extraction and authored copy for the AST-to-markdown serializer.

**Description:** `@art-md/serializer` follows the established pass.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Copy the extraction script with `meta.package` set to `@art-md/serializer`; run it. Apply the Authoring Rules — the serializer's modules explain when a consumer serializes back to markdown versus parsing; symbol descriptions stay behavioural. Re-pin `@art-md/primitives` and `@art-md/constructs` to `0.0.8`. Bump to `0.0.7`, changelog, refresh the lock, stop for the user's `npm publish`, confirm with `npm view`.

**Report:** `./instructions/document-serializer__report.md`

**Changes:**

- Add extract script; generate `dist/meta.json`.
- Author copy per the Authoring Rules; re-pin `primitives` and `constructs` `0.0.8`.
- Bump `0.0.7`, changelog, lock; publish (user gate).

**Dependencies:**

- Iteration: Revisit Parser.

#### Commits:

| ID                   | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| -------------------- | ------------------------------ | -------- | --------- | ----------- |
| `author-serializer`  | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `79ef0bf` | `COMMITTED` |
| `release-serializer` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `262a60b` | `COMMITTED` |

##### Commit: `author-serializer`

**Message:**

```text
docs(serializer): Add extraction and author module copy.
```

##### Commit: `release-serializer`

**Message:**

```text
release(serializer): 0.0.7
```

### Iteration: Document Codec

**Id:** `document-codec`

**Status:** `DONE`

**Purpose:** Extraction and authored copy for the codec, re-pinning every Art MD dependency.

**Description:** `@art-md/codec` depends on all four previously published packages — this iteration re-pins all of them.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Copy the extraction script with `meta.package` set to `@art-md/codec`; run it. Apply the Authoring Rules — the codec's module descriptions explain the parse-and-serialize round trip and when to use it over calling parser and serializer directly. Re-pin all four dependencies to the versions this plan published: `@art-md/primitives` `0.0.8`, `@art-md/constructs` `0.0.8`, `@art-md/parser` `0.0.8`, `@art-md/serializer` `0.0.7`. Bump `codec` to `0.0.6`, changelog, refresh the lock, stop for the user's `npm publish`, confirm with `npm view`.

**Report:** `./instructions/document-codec__report.md`

**Changes:**

- Add extract script; generate `dist/meta.json`.
- Author copy per the Authoring Rules; re-pin all four Art MD dependencies.
- Bump `0.0.6`, changelog, lock; publish (user gate).

**Dependencies:**

- Iteration: Document Serializer.

#### Commits:

| ID              | Repository / Checkout / Branch | Policy   | Hash      | Status      |
| --------------- | ------------------------------ | -------- | --------- | ----------- |
| `author-codec`  | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `3151454` | `COMMITTED` |
| `release-codec` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | `3d12397` | `COMMITTED` |

##### Commit: `author-codec`

**Message:**

```text
docs(codec): Add extraction and author module copy.
```

##### Commit: `release-codec`

**Message:**

```text
release(codec): 0.0.6
```

### Iteration: Refresh API Docs

**Id:** `refresh-api-docs`

**Status:** `DONE`

**Purpose:** Point the Art MD Website at all five packages' metas.

**Description:** The consumer generalises from one pinned meta to five merged entity arrays.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Add five entries to `$ART_MD_WEB/meta-docs.config.mts` with the versions this plan published (`primitives` `0.0.8`, `constructs` `0.0.8`, `parser` `0.0.8`, `serializer` `0.0.7`, `codec` `0.0.6`) — the fetcher downloads each from the npm endpoint and merges the `entities` arrays, so `content.config.ts` and the collection schema need no change. Run `npm run fetch-meta` and confirm the merged output contains entities from all five packages. Verify package pages render for all five (`/docs/api/art-md/primitives`, `/constructs`, `/serializer`, `/codec`, plus the existing `parser`), cross-package `{@link pkg:module#Symbol}` targets render as anchors, and `npm run build` + `npm run lint` pass. No dependency or lockfile changes; keep commits ordered against the other plans touching this repo.

**Report:** `./instructions/refresh-api-docs__report.md`

**Changes:**

- Pin five `@art-md/*` packages; merge five metas in `content.config.ts`.
- Verify all five package documentations render with working cross-package links.

**Dependencies:**

- Iteration: Document Codec.
- Plan: Distribute Meta JSON (`fetch-pinned-meta` landed the fetch-and-merge pattern this plan extends to five packages).

#### Commits:

| ID                 | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ------------------ | --------------------------------- | -------- | --------- | ----------- |
| `refresh-api-docs` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `261cffb` | `COMMITTED` |

##### Commit: `refresh-api-docs`

**Message:**

```text
build(art-md-web): Document all five art-md packages.
```

### Iteration: Write Root Docs

**Id:** `write-root-docs`

**Status:** `DONE`

**Purpose:** Give the site its human-facing docs: getting started, usage, integrations.

**Description:** Three root pages authored alongside the generated API reference.

**Instructions Mode:** `INSTRUCTIONS_INLINED_IN_ITERATION`

**Instructions:**

Author three pages under `$ART_MD_WEB/src/pages/docs/`, following the existing page and layout conventions: `getting-started` (install the packages, first parse), `usage` (parse/serialize round trip, when to use codec versus parser + serializer), and `integrations`. The integrations page links the sibling projects by GitHub URL — `https://github.com/noodlestan/art-js` and `https://github.com/noodlestan/art-lib` — noting that neither has documentation yet. Cross-link each root page to the generated API reference. Verify with the full docs build (`lint:fix` → `astro sync` → `build` → `lint`) and confirm the three routes render.

**Report:** `./instructions/write-root-docs__report.md`

**Changes:**

- Author `docs/getting-started`, `docs/usage`, `docs/integrations` pages.
- Link art-js and art-lib by GitHub URL (no docs yet for either).

**Dependencies:**

- Iteration: Refresh API Docs.

#### Commits:

| ID                | Repository / Checkout / Branch    | Policy   | Hash      | Status      |
| ----------------- | --------------------------------- | -------- | --------- | ----------- |
| `write-root-docs` | Artificials / `$PROJECT` / `main` | `NOPUSH` | `b65bf8c` | `COMMITTED` |

##### Commit: `write-root-docs`

**Message:**

```text
docs(art-md-web): Add getting started, usage, and integrations pages.
```

## Work

### Next

All seven iterations are `DONE` — plan complete: `document-primitives` (`7dc5ad5` + `f14a377`, `0.0.8`) → `document-constructs` (`d1d6602` + `a378ff2`, `0.0.8`) → `revisit-parser` (`6abf01c` + `9a70c03`, `0.0.8`) → `document-serializer` (`79ef0bf` + `262a60b`, `0.0.7`) → `document-codec` (`3151454` + `3d12397`, `0.0.6`) → `refresh-api-docs` (`261cffb`) → `write-root-docs` (`b65bf8c`). All five packages published and documented; the site serves the API reference for all five plus the three root docs pages (78 pages). Two deviations await the architect's ratification (Feedback: codec source restructure; `content.config.ts` first-match dedupe with the constructs 16/33 trade-off); lock-drain residue (`cli/bin`, `tests/codec`) is out of scope and parked (`3226fc1`).

### Blockers

- None — both upstream plans are `DONE` (Plan: Distribute Meta JSON shipped `parser` with `prepack`; Plan: Integrate Purrtrait and Shiki finished all nine iterations).

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$ART_MD/_guide.md` and `$PROJECT/_guide.md`)

Run `npm ci` from the `$ART_MD` and `$PROJECT` roots.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the message following the rules defined there.

### Verifying Completion

**Purpose:** Confirm each package publishes with fresh meta and the site renders every package.

**Instructions:** (From `$ART_MD/_guide.md` and `$PROJECT/_guide.md`)

Per package: `npm run ci` from `$ART_MD` passes, `dist/meta.json` exists and contains the authored copy, `npm pack --dry-run` lists it, and `npm view <package> version` resolves after the user's publish. For the website: `npx astro sync` → `npm run build` → `npm run lint` from `$ART_MD_WEB`, with all five package routes rendering and cross-package links resolving.

---

## Coordination

### Not In Scope

- **`@art-md/bin`** — a CLI; `--help` is its documentation, not meta.
- **`@noodlestan/purrfiles-*`** — extraction infrastructure, not Art MD API surface.
- **`libs/codec-tests`** — test scaffold without a manifest.
- **art-js and art-lib documentation** — linked by URL only; their docs are their own projects.

### Evidence

- `document-primitives` (`7dc5ad5`, `f14a377`) — extract script copied from `$PARSER` (`meta.package: @art-md/primitives`, `tsconfig` `scripts/` include), `extract` entry + devDependencies (the instruction's "`@noodlestan/purrfiles-extract` from the workspace" was stale: pinned exact `0.0.1` from npm, as `$PARSER` does), authored copy per the Authoring Rules — 9/9 modules and 25/30 declared symbols carry one-liner descriptions with module "what/when" kept off the symbol level, plus the `toMdastemented` typo fixed in source. Release `0.0.8` (version + CHANGELOG + lock, every lock hunk primitives-related). Published and confirmed: `npm view @art-md/primitives version` → `0.0.8`; `npm pack --dry-run` lists `dist/meta.json` (43 kB); `npm run ci` green on both commits. Report: `./instructions/document-primitives__report.md`.
- `document-constructs` (`d1d6602`, `a378ff2`) — extract script and devDependencies copied from the primitives pattern (`meta.package: @art-md/constructs`), 7 `factory/index.ts` barrels added so index-less factory modules can carry copy at all; authored per the Authoring Rules across 154 source files: modules **0/33 → 33/33**, declared symbols in meta **1/50 → 44/50** (50/50 authored in source — the 6 gaps are extractor limits, see Feedback); `@art-md/primitives` re-pinned `0.0.8`. Release `0.0.8` (version + CHANGELOG + lock, constructs-related hunks only). Published and confirmed: `npm view @art-md/constructs version` → `0.0.8`; `npm pack --dry-run` lists `dist/meta.json` (91.6 kB, 290 files); `npm run ci` green on both commits; `npm ci --dry-run` in sync. Report: `./instructions/document-constructs__report.md`.
- `revisit-parser` (`6abf01c`, `9a70c03`) — 5 cross-package links qualified to the full scoped-token form (`{@link @art-md/primitives:context#ParseContext}` ×3, `…:document#ArtDocument}`, `…:context#ParserVisitContext}`; owning modules discovered from primitives' meta; 0 constructs targets existed; the 6 in-package `entity#symbol` links kept). Copy reconciled with the Authoring Rules: canonical what/when on `src/index.ts`, module↔symbol repetition removed across 9 files, every parser module compressed to one paragraph. Re-pinned `@art-md/primitives` and `@art-md/constructs` `0.0.8`; release `0.0.8` (parser hunks only, `npm ci` in sync). Published and confirmed: `npm view @art-md/parser version` → `0.0.8`; `npm pack --dry-run` lists `dist/meta.json` (16.5 kB) with `prepack` re-running extract; `npm run ci` green on both commits (10/10 tasks). Report: `./instructions/revisit-parser__report.md`.
- `document-serializer` (`79ef0bf`, `262a60b`) — extract script copied with `meta.package: @art-md/serializer`; authored per the Authoring Rules: modules **0/3 → 3/3**, declared symbols **0/5 → 5/5** (meta 8,835 → 10,178 B), modules carry the serialize-vs-parse what/when while symbols stay behavioural, 3 qualified `@art-md/primitives:` / `@art-md/constructs:` links. Re-pinned `@art-md/primitives` and `@art-md/constructs` `0.0.8`; release `0.0.7` (version + CHANGELOG + lock, every hunk serializer-caused — including the two reaction hunks under `libs/codec`, precedented by `a378ff2`; `npm ci` in sync, `npm ls` exits 0). Published and confirmed: `npm view @art-md/serializer version` → `0.0.7`; `npm pack --dry-run` lists `dist/meta.json` (10.2 kB, 24 files); `npm run ci` green on both commits (11/11 tasks). Report: `./instructions/document-serializer__report.md`.
- `document-codec` (`3151454`, `3d12397`) — extract script copied with `meta.package: @art-md/codec`; **flat `src/` yields 0 entities** (the extractor is directory-based), so `createArtCodec.ts`, `types.ts` and the test moved into `src/codec/` behind a new `src/codec/index.ts` entry (constructs-barrel precedent) — then modules **0/1 → 1/1**, symbols **0/3 → 3/3**, meta 7,769 → 8,831 B, 4 qualified full-scoped links verified against the published metas. Re-pinned all four Art MD deps (`primitives`/`constructs`/`parser` `0.0.8`, `serializer` `0.0.7`); release `0.0.6` (version + CHANGELOG + lock, every hunk codec-caused; all 5 `libs/codec/node_modules/*` entries drained). Published and confirmed: `npm view @art-md/codec version` → `0.0.6`; `npm pack --dry-run` lists `dist/meta.json` (9.3 kB, 20 files); `npm run ci` green on both commits (12/12 tasks); `npm ci` in sync, `npm ls` exits 0. Report: `./instructions/document-codec__report.md`.
- `refresh-api-docs` (`261cffb`) — `meta-docs.config.mts` now pins all five packages (parser `0.0.8` replaces its stale `0.0.7` entry); `npm run fetch-meta` merged five metas first try (no CDN lag): **50 entities** (primitives 9, constructs 33, parser 4, serializer 3, codec 1) → **32 after the collection's dedupe** (8/16/4/3/1). All five package routes exist in `dist/` with `<h1>` + module lists; the qualified `{@link @art-md/primitives:context#ParseContext}` renders as an anchor on `/docs/api/art-md/parser/parse` plus **8 more cross-package anchors** (serializer→primitives/constructs, codec→parser/serializer/primitives); the other four parser qualified links sit in `private/` sources the extractor ignores (as documented). `astro sync` / `build` (75 pages) / `lint` green; `git diff` empty on the manifest and lockfile. Report: `./instructions/refresh-api-docs__report.md`.
- `write-root-docs` (`b65bf8c`) — three pages authored (`src/pages/docs/{getting-started,usage,integrations}.astro`, 154 lines): install table + first-parse with highlighted code, the parse/serialize round trip with the codec-vs-parser+serializer guidance, and integrations linking `noodlestan/art-js` + `noodlestan/art-lib` by GitHub URL with the no-docs-yet note; every `/docs/api/...` cross-link resolves to an existing `dist` file; the documented examples were executed live. Build 75 → **78 pages**; `lint:fix` → `astro sync` → `build` → `lint` all green, manifest and lockfile untouched, commit stages exactly the three pages. Report: `./instructions/write-root-docs__report.md`.

### Decisions

- **Order is dependency-driven** — `primitives` → `constructs` → `parser` → `serializer` → `codec` means every iteration only re-pins versions that earlier iterations published; `codec` sits last because it depends on all four.
- **Parser is revisited third, not last** — cross-package links need `primitives` and `constructs` live, and the copy rules should be applied to the flagship package before the remaining ones set precedent.
- **All instructions inlined** — the iterations are short, ordered, release-shaped sequences; separate files would add ceremony without adding delegation value.
- **Two commits per package iteration** — the authored docs land separately from the release commit, so `release(pkg): X` always contains exactly the version bump, changelog, and lock refresh.
- **Docs document releases** — every website pin names the exact version whose meta it renders.

### Follow Ups

- art-js and art-lib get their own documentation projects (linked from `docs/integrations`).
- Registry endpoints advertise the published metas (carried from Plan: Distribute Meta JSON).
- Consider an API-surface diff (consecutive metas) as a release check.

### Feedback

- Nested @art-md registry entries in the lock are transient — track their drain with `npm ls @art-md/primitives`: **2 remaining** after `document-codec`, but the residue **moved** to (`cli/bin`, `tests/codec`) — codec's own nested copies are all drained, and `tests/codec` pins `@art-md/codec: "0.0.5"` exactly (out of this plan's scope; expect an `invalid` marker there once `0.0.6` installs). Was 3 after `revisit-parser`, 5 at `document-primitives`; parked as `3226fc1`. The plan's "0 after document-codec" target assumed `cli/bin` was codec-caused — it is not; both remainders are out of scope.
- `document-codec`'s source restructure (flat `src/` → `src/codec/` + `index.ts`, files and test moved) is the one deviation **pending the architect's ratification**: the directory-based extractor cannot see a flat layout, the constructs-barrel precedent applies, and the content is already published as `0.0.6` — a rejection implies a corrected release plus a `refresh-api-docs` pin edit.
- `refresh-api-docs` disproved the instruction's "no change to `content.config.ts`": merging five metas hard-failed with `Duplicate entity context of type module` (primitives `context` ×2, constructs 17 bare-name collisions — the duplicates the plan already flagged). Fix: first-match dedupe at `readMeta` (no dependency or lockfile change was possible; `purrfiles-entities@0.0.1` is latest). **Trade-off pending ratification:** constructs renders 16 of its 33 modules, because nested modules share bare names under the v1 name-keyed id/route/index schemes — resolving that needs keyed ids upstream (purrfiles follow-up), not this plan.
- Residual raw `{@link …}` appears only in `<meta name="description">` (pre-existing SEO-meta cosmetic); page bodies are clean.
- `document-constructs`' 6 meta gaps are extractor limits, not authoring gaps: 2 interfaces and 4 typed arrow-const parsers are documented in source but never reach `dist/meta.json` (44/50) — the fix belongs in `@noodlestan/purrfiles-extract`, not this plan's copy.
- Scoped-token correction (ratified by the architect): qualified links must use the **full scoped package name** — `{@link @art-md/primitives:context#Symbol}` — never the `primitives:` shorthand the instruction wrote; the resolver matches `e.package === pkg` with full scoped strings and purrfiles-entities' own tests assert that form. The shorthand must not reappear in instructions.
- `@art-md/primitives`'s meta lists the name `context` twice — first-match wins, so bare-name fallback lookup is ambiguous; extractor note for the purrfiles follow-up.
- Only 1 of the 5 qualified links renders in docs today: the other four live in private/test sources the extractor ignores — source hygiene, no action in this plan.
