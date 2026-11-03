# Plan: Distribute Meta JSON

**ID:** `distribute-meta-json`

**Status:** `DRAFT`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Ship versioned `meta.json` with every `@art-md/parser` release and consume it as a pinned dependency, retiring the workspace-relative sync script.

**Description:** `meta.json` is already inside the published package (`files` includes `dist`) but its freshness is accidental — nothing regenerates it at pack time, and the Art MD Website does not read it from the registry: `apps/art-md-web/scripts/sync-meta.mjs` copies `../../../art-md/libs/parser/dist/meta.json` by relative path, so builds only work inside the full workspace. This plan guarantees the packaged meta matches the released sources (`prepack`), releases `@art-md/parser@0.0.7` carrying the re-authored `{@link}` targets, and switches `$ART_MD_WEB` to an exact-pinned dependency read straight from `node_modules`, deleting the sync script. The `noodlestan/registry` endpoints will _advertise_ the npm-hosted meta rather than copy it; the registry remains reserved for artifacts that are not published to npm. Every repository keeps producing `dist/meta.json` under that same name for the shared local tool.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

| Variable      | Resolved Path                      | Purpose                                        |
| ------------- | ---------------------------------- | ---------------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                      |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone.         |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | Consumer to rewire.                            |
| `$ART_MD`     | `$WORKSPACE/checkouts/art-md`      | Source project — ships the meta.               |
| `$PARSER`     | `$ART_MD/libs/parser`              | Package whose `dist/meta.json` is distributed. |

## Summary

Guarantee `@art-md/parser` publishes a fresh `dist/meta.json`, release it, and make the Art MD Website consume that exact version from the registry instead of a relative-path copy — one versioned channel for every site that documents an npm-published project.

## Context

### Upstream Work

| Kind      | Path                                                               | Role                                    |
| --------- | ------------------------------------------------------------------ | --------------------------------------- |
| Milestone | `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md` | Phase 4 coordination; Follow Ups entry. |

### Knowledge

::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification.
::READ `$ART_MD/_guide.md` (Guide) — Extraction monorepo layout, setup, and verification.
::READ `$ART_MD_WEB/scripts/sync-meta.mjs` (Source) — The throwaway sync this plan deletes.
::READ `$ART_MD_WEB/src/content.config.ts` (Source) — Where `meta.json` is read today.
::READ `$PARSER/package.json` (Source) — `files` (already includes `dist`) and the scripts needing `prepack`.
::READ `$WORKSPACE/checkouts/management/_ops/packages/policy.md` (Conventions) — Exact-pin model; the consumer pin follows it.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Commit message format.

## Scope

Two repositories: `$ART_MD` publishes, `$PROJECT` consumes. The registry advertisement is a follow-up outside both.

### (Scope) Package: Art MD Parser

**Record:** `$PARSER/_records/package.art`

**Role:** Owns and publishes the canonical `meta.json`.

**Changes:**

- Add a `prepack` script running `npm run extract` so the packed `dist/meta.json` is always regenerated from the sources being released — freshness by construction, not by habit.
- Release `@art-md/parser@0.0.7` (user `npm publish` gate) carrying the re-authored `{@link}` targets integrated in `9feb113`.

**Dependencies:**

- None.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Consumes the published meta at a pinned version.

**Changes:**

- Declare `@purrtrait`-style exact pin on `@art-md/parser` (`0.0.7`) in `$ART_MD_WEB/package.json` dependencies.
- Read the meta from the dependency — `content.config.ts` imports `@art-md/parser/dist/meta.json` directly instead of reading `./data/meta.json`.
- Delete `scripts/sync-meta.mjs`, the `extract` script, and the `data/` artifact; `dev`, `build`, and `ci` no longer touch sibling checkouts.
- Verify: clean-clone-equivalent build (`rm -rf` any local data first is unnecessary once the import is in place) — `npx astro sync`, `npm run build`, `npm run lint` green; rendered pages unchanged; `grep -rn sync-meta` empty.

**Dependencies:**

- Iteration: Ship Fresh Meta (the pin must resolve a release that contains the re-authored links).

## Execution Context

Executed from `$WORKSPACE/`. Package work happens in `$ART_MD` on branch `main`; consumer work in `$PROJECT` on branch `main`. The two iterations of this plan both touch release/deploy sequencing — execute in order, and serialize against Plan: Integrate Purrtrait and Shiki, whose remaining iterations edit the same `$ART_MD_WEB/package.json` and lockfile.

---

## Items:

| Iteration / Instructions       | Status  |
| ------------------------------ | ------- |
| Iteration: Ship Fresh Meta     | `DRAFT` |
| Iteration: Consume Pinned Meta | `DRAFT` |

### Iteration: Ship Fresh Meta

**Id:** `ship-fresh-meta`

**Status:** `DRAFT`

**Purpose:** Make the published `meta.json` provably match the released sources.

**Description:** `prepack` regenerates the meta at pack time, and the release carrying the re-authored `{@link}` targets goes out as `0.0.7`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add `"prepack": "npm run extract"` to `$PARSER/package.json`.
- Run `npm pack --dry-run` and confirm `dist/meta.json` is listed; run `npm run extract` and confirm the packed content contains `config#ParserConfig` targets.
- Bump to `0.0.7`, commit `release(parser)`, stop and hand the version to the user for `npm publish`; confirm with `npm view @art-md/parser version`.

**Dependencies:**

- None.

#### Commits:

| ID                | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------- | ------------------------------ | -------- | ----- | ---------- |
| `ship-fresh-meta` | Art MD / `$ART_MD` / `main`    | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `ship-fresh-meta`

**Message:**

```text
release(parser): Regenerate meta on prepack and release 0.0.7.
```

### Iteration: Consume Pinned Meta

**Id:** `consume-pinned-meta`

**Status:** `DRAFT`

**Purpose:** Read versioned meta from the registry dependency and delete the workspace script.

**Description:** `$ART_MD_WEB` pins `@art-md/parser` exactly, imports the JSON from the package, and never resolves a sibling checkout again.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Changes:**

- Add `"@art-md/parser": "0.0.7"` to `$ART_MD_WEB/package.json` dependencies (exact, per policy).
- Rewrite `$ART_MD_WEB/src/content.config.ts` to import `@art-md/parser/dist/meta.json` (the package has no `exports` map, so the subpath resolves) instead of `readFileSync('./data/meta.json')`.
- Delete `apps/art-md-web/scripts/sync-meta.mjs` and the `extract` script entry; remove `&& npm run extract` from `dev` and `build`; delete `src/data/`.
- Verify: `npx astro sync`, `npm run build`, `npm run lint` from `$ART_MD_WEB` green; rendered docs unchanged; `grep -rn "sync-meta\|src/data/meta" apps/` empty; `git -C $PROJECT diff` shows no other dependency change.

**Dependencies:**

- Iteration: Ship Fresh Meta.

#### Commits:

| ID                    | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| --------------------- | --------------------------------- | -------- | ----- | ---------- |
| `consume-pinned-meta` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `consume-pinned-meta`

**Message:**

```text
build(art-md-web): Read meta from the pinned `@art-md/parser`.
```

## Work

### Next

Draft the two iterations above into instructions once the sequencing window is right: serialize with Plan: Integrate Purrtrait and Shiki (both edit `$ART_MD_WEB/package.json` and the lockfile). The `npm publish` gate sits inside `ship-fresh-meta`.

### Blockers

- `@art-md/parser` must publish `0.0.7` (iteration `ship-fresh-meta`) before `consume-pinned-meta` runs — pinning `0.0.6` today would revert the docs to pre-`9feb113` link targets.

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

**Purpose:** Confirm the packaged meta is fresh and the consumer builds without sibling checkouts.

**Instructions:** (From `$PARSER` and `$PROJECT/_guide.md`)

From `$PARSER`: `npm pack --dry-run` lists `dist/meta.json` containing the current `{@link}` targets, and `npm run ci` passes. From `$ART_MD_WEB`: `npx astro sync` → `npm run build` → `npm run lint` pass with no reference to `sync-meta` or `src/data`.

---

## Coordination

### Not In Scope

- **The registry repository itself** — endpoints _advertise_ the npm-hosted meta; no copy is stored there.
- **`dist/meta.json` contract for the shared local tool** — every repo keeps producing it under that name; untouched.
- **Other projects' meta** — art-js and art-lib adopt this pattern when their extraction lands.
- **Publishing the registry advertisement** — tracked as a Follow Up; no checkout exists yet.

### Evidence

- None yet.

### Decisions

- **Option A: meta ships inside the npm package** — versioned by semver, served by the registry (and unpkg) as a side effect; no new infrastructure, no duplicated artifact.
- **The registry advertises, never copies** — endpoints point at the npm-hosted meta; the registry is reserved for artifacts that are not published to npm.
- **`dist/meta.json` stays the local contract** — same name in every repo, consumed by the shared local tool; the pinned dependency is the distribution contract. Two consumers, one generator.
- **Docs document releases** — the site's pin (`0.0.7`) says which API version it renders; a pin bump is a deliberate, reviewable diff.
- **Freshness by construction** — `prepack` regenerates the meta so a release can never ship stale documentation data.

### Follow Ups

- Registry endpoints advertise `meta.json` (pointer/descriptor to the npm-hosted file) once the registry checkout exists.
- Registry properly hosts artifacts that are not published to npm (the case that justifies it).
- art-js and art-lib publish and pin their meta the same way when their extraction lands.
- Consider diffing consecutive pinned metas as an API-surface check at release time.

### Feedback

- None yet.
