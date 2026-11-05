# Plan: Docs Sidebar

**ID:** `docs-sidebar`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Give the docs section persistent navigation.

**Description:** Docs pages carry breadcrumbs (`DocsBreadcrumbs.astro`) but no section navigation. This plan adds a sidebar listing the documented packages, their modules, and the entities under them across every `/docs/api` route, highlighting the active entity. The sidebar is visible on all pages except the home page and the about page — the scope carried from Plan: Art MD Docs.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                      | Purpose                                |
| ------------- | ---------------------------------- | -------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.              |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone. |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | The website that gains the sidebar.    |
| `$NO_COMPLY`  | `$WORKSPACE/checkouts/no-comply`   | Reference API navigation granularity.  |

## Summary

Add a docs sidebar component rendered from the entity collection, wire it into the docs layouts with the active entity highlighted, and keep it off the home and about pages.

## Context

### Upstream Work

| Kind      | Path                                                                  | Role                                                                                            |
| --------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md`    | Phase 4 (Docs) coordinates this plan.                                                           |
| Plan      | `$PROJECT/_backlog/1-done/plan-integrate-purrtrait-and-shiki/plan.md` | Delivered the rendering stack and route helpers the sidebar navigates; navigation was deferred. |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment.
::READ `$ART_MD_WEB/_guide.md` (Guide) — Documentation rendering stack and package layout.
::READ `$ART_MD_WEB/src/layouts/PageLayout.astro` (Source) — Layout every docs page renders through.
::READ `$ART_MD_WEB/src/components/docs/DocsBreadcrumbs.astro` (Source) — Existing nav trail and the route helpers it consumes.
::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — Route helpers sidebar links resolve through.
::READ `$ART_MD_WEB/src/content.config.ts` (Source) — The collection the sidebar tree is built from.
::READ `$PROJECT/_backlog/1-done/plan-art-md-docs/plan.md` (Plan) — Where the sidebar was deferred (visible on all pages except homepage and about).

## Scope

Website work happens in `$PROJECT`.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Hosts the docs sidebar.

**Changes:**

- Add a sidebar component under `src/components/docs/` listing packages, modules, and their entities from the shipped collection, built with the `src/lib/routes.ts` helpers.
- Render it from the docs layout(s) with the active package/module/entity highlighted from the current route; hide it on the home page and the about page.
- Keep breadcrumbs — the sidebar complements, not replaces, the nav trail.
- Style it with the existing Purrtrait consumer styles in `src/styles/global.css` so light and dark themes stay consistent.

**Dependencies:**

- Plan: Integrate Purrtrait and Shiki — `DONE`; the routes, collection consumers, and rendering stack the sidebar navigates are in place.
- Plan: Componentize Docs — coordinate so the sidebar lands on the same side of the extraction (moved with the docs sections, or added to the shared package).

## Execution Context

Executed from `$WORKSPACE/`. Website work happens in `$PROJECT` on branch `main`.

---

## Work

### Next

Draft only — no iterations, instructions, or commit blueprints yet. Next: contextualise and draft the iterations with `write-plan`, then delegate.

## Coordination

### Not In Scope

- **Sidebar outside the docs section** — home and about keep their current navigation.
- **Collapse/expand behaviour beyond the active highlight** — refine later if readers ask for it.

### Follow Ups

- Migrate the sidebar into the shared docs package once Plan: Componentize Docs lands.
- In-code and in-sidebar links to symbols share the anchor work — Plan: In-Code Symbol Links.
