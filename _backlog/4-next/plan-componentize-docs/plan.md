# Plan: Componentize Docs

**ID:** `componentize-docs`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** DRY docs rendering across Noodlestan Astro sites.

**Description:** Create an Astro components package for docs in the Noodlestan Web project, modeled on the package that already exists at `$NOODLESTAN_WEB/packages/astro-components`, so shared docs sections live once and every Noodlestan Astro site consumes them.

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

::READ `$NOODLESTAN_WEB/packages/astro-components/` (Reference) — Package structure, exports, and conventions to replicate.
::READ `$ART_MD_WEB/src/components/docs/` (Source) — The docs sections to extract.
::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification.
::READ `$WORKSPACE/_guide.md` (Guide) — Workspace operations and commit conventions.

## Scope

Package work happens in `$NOODLESTAN_WEB`; the consumer migration happens in `$PROJECT`.

### (Scope) Package: Docs Components (name TBD)

**Record:** `$NOODLESTAN_WEB/packages/{name}/_records/package.art` — New

**Role:** Owns shared Astro docs components for all Noodlestan Astro sites.

**Changes:**

- Create the package under `$NOODLESTAN_WEB/packages/` modeled on `$ASTRO_COMPONENTS` (peer `astro`, `components/`, `styles/`, `index.ts`, raw-TS entry).
- Move the docs sections from `$ART_MD_WEB/src/components/docs/` into it, parameterised so each site injects its own route helpers rather than hard-coding `/docs/api` hrefs.
- Consume `@purrtrait/astro-components` for code and JSDoc blocks instead of re-implementing them.
- Re-point `$ART_MD_WEB` at the package; rendered output stays byte-identical.

**Dependencies:**

- Plan: Astro Components (`@purrtrait/astro-components` must exist).

## Execution Context

Executed from `$WORKSPACE/`. Package work happens in `$NOODLESTAN_WEB` on branch `main`; the consumer migration in `$PROJECT` on branch `main`.

---

## Items:

Iterations not yet drafted.

## Work

### Next

Draft iterations: package scaffold → extract docs sections → re-point `$ART_MD_WEB`.

### Blockers

- None.

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

---

## Coordination

### Not In Scope

- **Publishing** — no npm release; `file:` links or workspace wiring only.
- **Other Astro sites** — beyond `$ART_MD_WEB`, migrations are follow-ups.
- **`@purrtrait/astro-components` changes** — consumed as-is.

### Evidence

- None yet.

### Decisions

- **Modeled on `@noodlestan/astro-components`** — same package shape and peer-dependency style as the existing package in `$NOODLESTAN_WEB/packages/`.
- **Routes injected, not hard-coded** — sites pass their href helpers, so `/docs/api` stays Art MD's own ground truth.

### Follow Ups

- Settle the package name (`@noodlestan/astro-docs` and friends) when drafting iterations.
- Migrate other Noodlestan Astro sites to the shared package.

### Feedback

- None yet.
