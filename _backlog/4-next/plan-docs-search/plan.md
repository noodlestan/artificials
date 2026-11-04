# Plan: Docs Search

**ID:** `docs-search`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Let readers search the documented entities from the docs section.

**Description:** The docs index lists packages with no search — deferred by Plan: Art MD Docs. This plan adds a search surface over the entities the meta already carries: packages, modules, functions, and types filter as the reader types, and every hit links to its existing `/docs/api/...` route. Search reads the same entity model the pages render (`@noodlestan/purrfiles-entities` over the Astro collection), so results and rendered pages cannot drift.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                      | Purpose                                      |
| ------------- | ---------------------------------- | -------------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                    |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone.       |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | The website that gains search.               |
| `$PURRFILES`  | `$WORKSPACE/checkouts/purrfiles`   | Entity model and query service search reads. |
| `$NO_COMPLY`  | `$WORKSPACE/checkouts/no-comply`   | Reference search interaction (ApiIndexPage). |

## Summary

Add entity search to the docs index and the `/docs/api` pages, filtering the shipped collection client-side and routing hits through the existing route helpers.

## Context

### Upstream Work

| Kind      | Path                                                                 | Role                                                                                     |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md`   | Phase 4 (Docs) coordinates this plan.                                                    |
| Plan      | `$PROJECT/_backlog/3-now/plan-integrate-purrtrait-and-shiki/plan.md` | Delivered the rendering stack and meta queries this plan builds on; search was deferred. |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment.
::READ `$ART_MD_WEB/_guide.md` (Guide) — Documentation rendering stack and package layout.
::READ `$ART_MD_WEB/src/content.config.ts` (Source) — The collection the search reads.
::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — Route helpers search hits resolve through.
::READ `$ART_MD_WEB/src/lib/meta.ts` (Source) — Meta service queries over the entities.
::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/pages/ApiIndexPage/fields/APISearchField.tsx` (Reference) — The search interaction being matched.
::READ `$PROJECT/_backlog/1-done/plan-art-md-docs/plan.md` (Plan) — Where search was deferred, and the open question of where its interactions live.

## Scope

Website work happens in `$PROJECT`. Search is client-side over the data the site already ships.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Hosts search over the documented entities.

**Changes:**

- Add a search field to the docs index and the `/docs/api` pages that filters packages, modules, functions, and types as the reader types.
- Link every hit through the `src/lib/routes.ts` helpers so results land on existing `/docs/api/...` routes — no new routes.
- Read entities through the existing collection and `@noodlestan/purrfiles-entities` queries — no second index, no new data source.
- Decide during planning where the interactions live: site-local components versus a shared Solid package (open question carried by Plan: Art MD Docs).

**Dependencies:**

- Plan: Integrate Purrtrait and Shiki — `DONE`; the meta model, resolver, and rendering stack this search reads are in place.
- Plan: Componentize Docs — coordinate so the search UI lands on the same side of the extraction (moved with the docs sections, or added to the shared package).

## Execution Context

Executed from `$WORKSPACE/`. Website work happens in `$PROJECT` on branch `main`.

---

## Work

### Next

Draft only — no iterations, instructions, or commit blueprints yet. Next: contextualise and draft the iterations with `write-plan`, then delegate.

## Coordination

### Not In Scope

- **A search backend** — client-side filtering over the shipped collection only.
- **Docs pages outside `/docs`** — home and about keep their current navigation.

### Follow Ups

- Extract the shared entity-search interactions into a Solid package (`@purrtrait/solid-search`, or Noodlestan Purrtrait "solids components") — carried from Plan: Art MD Docs.
- Meta availability moves to the config-pinned endpoint fetch — Plan: Distribute Meta JSON; search keeps reading the collection.
