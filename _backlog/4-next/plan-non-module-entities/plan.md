# Plan: Non-Module Entities

**ID:** `non-module-entities`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Document `components` and `props` entities alongside `module` entities.

**Description:** Only `module` entities exist today: `ENTITY_TYPES = ['module']` in `@noodlestan/purrfiles-entities`, one extractor (`createModuleEntityExtractor`) in `@noodlestan/purrfiles-extract`, and routes in the Art MD Website that render modules with their functions and types. This plan extends the entity model and the extraction to `components` and `props`, re-runs extraction so the meta carries them, and gives the website routes and sections that render them at the reference granularity. Both packages are published, so the model change ships as released versions the website pins exact.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                        | Purpose                                         |
| ------------- | ------------------------------------ | ----------------------------------------------- |
| `$WORKSPACE`  | Current working directory            | Workspace root directory.                       |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials`   | This plan's backlog and the milestone.          |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`           | The website that renders the new entity kinds.  |
| `$PURRFILES`  | `$WORKSPACE/checkouts/purrfiles`     | Entity model and extraction packages.           |
| `$ENTITIES`   | `$PURRFILES/libs/purrfiles-entities` | `ENTITY_TYPES` and the meta service.            |
| `$EXTRACT`    | `$PURRFILES/cli/purrfiles-extract`   | Entity extractors.                              |
| `$ART_MD`     | `$WORKSPACE/checkouts/art-md`        | Extraction source that regenerates `meta.json`. |
| `$NO_COMPLY`  | `$WORKSPACE/checkouts/no-comply`     | Reference granularity per entity kind.          |

## Summary

Add `components` and `props` entity kinds to the purrfiles model and extractors, publish both packages, regenerate the meta, and render the new kinds in the Art MD Website with their own routes and sections.

## Context

### Upstream Work

| Kind      | Path                                                                  | Role                                                                                                |
| --------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md`    | Phase 4 (Docs) coordinates this plan.                                                               |
| Plan      | `$PROJECT/_backlog/1-done/plan-integrate-purrtrait-and-shiki/plan.md` | Delivered the rendering stack; recorded `components` and `props` as deliberately out of scope (v1). |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment.
::READ `$ART_MD_WEB/_guide.md` (Guide) — Documentation rendering stack and package layout.
::READ `$ENTITIES/src/constants.ts` (Source) — `ENTITY_TYPES = ['module']`, the gate to widen.
::READ `$EXTRACT/src/entities/Module/createModuleEntityExtractor.ts` (Source) — The extractor pattern the new kinds copy.
::READ `$ART_MD/libs/parser/scripts/extract.ts` (Source) — Where the extractors are composed into `meta.json`.
::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/pages/ApiEntityPage/ApiEntityPage.tsx` (Reference) — The per-entity-kind granularity being matched.

## Scope

The model and extractors change in `$PURRFILES`, extraction re-runs in `$ART_MD`, and the website renders the result.

### (Scope) Package: Purrfiles Entities

**Record:** `$ENTITIES/_records/package.art`

**Role:** Owns the entity types and meta service queries.

**Changes:**

- Widen `ENTITY_TYPES` and the entity model with `components` and `props` kinds, keeping `module` behaviour unchanged.
- Extend the meta service queries and `{@link …}` expression resolution so the new kinds address and resolve.

**Dependencies:**

- Plan: Integrate Purrtrait and Shiki — `DONE`; the consumer this model feeds is in place.

### (Scope) Package: Purrfiles Extract

**Record:** `$EXTRACT/_records/package.art`

**Role:** Extracts the new entity kinds from TypeScript source.

**Changes:**

- Add extractors for `components` and `props` following `createModuleEntityExtractor`, composed alongside it.

**Dependencies:**

- The `Package: Purrfiles Entities` change above (the model it emits).

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Renders the new entity kinds.

**Changes:**

- Add routes and docs sections for `components` and `props` entities using the existing `CodeBlock.astro` / `JsDocBlock.astro` path.
- Pin the new purrfiles releases exact and re-run extraction.

**Dependencies:**

- Both purrfiles package releases, and `$ART_MD` re-running extraction with the new extractors so the meta carries the new kinds.

## Execution Context

Executed from `$WORKSPACE/`. Model and extractor work happens in `$PURRFILES` on branch `main`; extraction in `$ART_MD` on branch `main`; website work in `$PROJECT` on branch `main`. Both purrfiles packages are published `0.0.1`, so each change lands as a versioned release the consumers re-pin.

---

## Work

### Next

Draft only — no iterations, instructions, or commit blueprints yet. Next: contextualise and draft the iterations with `write-plan` (model first, extractors second, meta re-run third, rendering last), then delegate.

## Coordination

### Not In Scope

- **Entity kinds beyond `components` and `props`** — the reference renders more kinds; only these two are in scope here.
- **In-code links** — token links inside rendered code are Plan: In-Code Symbol Links.

### Follow Ups

- The moved purrfiles packages still declare `repository.url` `github.com/noodlestan/art-md.git` with their old `directory` — correct it with this plan's release (published-content invariant; carried from Plan: Integrate Purrtrait and Shiki).
- `libs/purrfiles-entities/package.json` `files` omits `CHANGELOG.md` while siblings include it — add it when releasing (carried from Plan: Integrate Purrtrait and Shiki).
- A purrfiles-only clone fails `createModuleEntityExtractor.test.ts` (reaches `$ART_MD/libs/parser/src`) — vendor a fixture when this plan touches the extract package.
