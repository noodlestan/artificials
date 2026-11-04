# Plan: In-Code Symbol Links

**ID:** `in-code-symbol-links`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Link declared identifiers inside rendered code to their docs anchors.

**Description:** `CodeBlock.astro` renders serialized declarations as highlighted code, but identifiers that name documented symbols stay plain tokens. This plan makes those tokens link to the `/docs/api/...#symbol` anchors the docs already emit on headings and members, so a reader can jump from a usage in a signature to the symbol's own entry. Token-level linking was deferred with Plan: Astro Components and is the in-code half of the symbol-anchor work this plan's predecessor left open.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                      | Purpose                                            |
| ------------- | ---------------------------------- | -------------------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                          |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone.             |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | The docs consumer that wires the links.            |
| `$PURRTRAIT`  | `$WORKSPACE/checkouts/purrtrait`   | `@purrtrait/astro-components` and `code-renderer`. |
| `$PURRFILES`  | `$WORKSPACE/checkouts/purrfiles`   | Entity model the symbol targets resolve against.   |

## Summary

Resolve identifiers inside rendered declaration code to documented symbols and emit them as anchors on the existing `/docs/api/...#symbol` routes, extending the Purrtrait code path where token links do not exist yet.

## Context

### Upstream Work

| Kind      | Path                                                                 | Role                                                                                           |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md`   | Phase 4 (Docs) coordinates this plan.                                                          |
| Plan      | `$PROJECT/_backlog/3-now/plan-integrate-purrtrait-and-shiki/plan.md` | Delivered `CodeBlock.astro`, the resolver, and `#symbol` anchors; deferred in-code links here. |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment.
::READ `$ART_MD_WEB/_guide.md` (Guide) — Rendering stack and the `{@link …}` resolver.
::READ `$ART_MD_WEB/src/lib/meta.ts` (Source) — `createDocsResolveLink`; the resolution pattern to reuse for code tokens.
::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — Route helpers and the `#symbol` fragment form.
::READ `$PURRTRAIT/libs/astro-components/` (Source) — `CodeBlock.astro`, where tokens would carry links.
::READ `$PURRTRAIT/libs/code-renderer/` (Source) — Declaration serialization producing the token nodes.
::READ `$DOMAINS/plans/definitions/index.art` (Definitions) — Plan and iteration definitions for drafting.

## Scope

Two resources: the renderers in `$PURRTRAIT` gain token-level links where they are missing, and the consumer in `$PROJECT` wires them to docs routes. Per Plan: Integrate Purrtrait and Shiki's decisions, rendering gaps belong upstream in the purrtrait packages — never as a local helper in the website.

### (Scope) Package: Astro Components

**Record:** `$PURRTRAIT/libs/astro-components/_records/package.art`

**Role:** Renders declaration code tokens as links when the caller supplies a resolver.

**Changes:**

- Extend `CodeBlock.astro` (with `@purrtrait/code-renderer` where the token stream is produced) so identifiers can render as anchors instead of plain highlighted text.

**Dependencies:**

- Plan: Integrate Purrtrait and Shiki — `DONE`; the published renderer releases are pinned exact in the website.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Resolves code tokens to docs anchors.

**Changes:**

- Pass a resolver built like `createDocsResolveLink` into `CodeBlock.astro` so identifiers naming documented symbols link to `/docs/api/...#symbol`; undocumented or cross-package symbols stay plain text.
- Verify against the anchors the docs already emit (`id` on function and type headings, `Type.member` ids).

**Dependencies:**

- The `Package: Astro Components` change above.

## Execution Context

Executed from `$WORKSPACE/`. Renderer work happens in `$PURRTRAIT` on branch `main`; website work in `$PROJECT` on branch `main`.

---

## Work

### Next

Draft only — no iterations, instructions, or commit blueprints yet. Next: contextualise and draft the iterations with `write-plan` (renderer capability first, consumer wiring second), then delegate.

## Coordination

### Not In Scope

- **Symbol-level extraction upstream** — targets still resolve as entities today; `{@link …}` expression work stays with the purrfiles extraction model (see Plan: Non-Module Entities).
- **Links outside rendered code** — descriptions already resolve through `JsDocBlock.astro`.

### Follow Ups

- Once `{@link …}` targets can name symbols directly, reconcile the resolver so code links and description links share one target model.
- Render the same anchors in the shared package after Plan: Componentize Docs lands.
