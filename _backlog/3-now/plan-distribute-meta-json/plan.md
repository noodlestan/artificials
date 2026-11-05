# Plan: Distribute Meta JSON

**ID:** `distribute-meta-json`

**Status:** `READY`

**Template:** `$DOMAINS/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Ship versioned `meta.json` with every `@art-md/parser` release and consume it at a pinned version fetched from the npm endpoint, retiring the workspace-relative sync script.

**Description:** `meta.json` is already inside the published package (`files` includes `dist`) but its freshness is accidental — nothing regenerates it at pack time, and the Art MD Website does not consume it from the registry: `apps/art-md-web/scripts/sync-meta.mjs` copies `../../../art-md/libs/parser/dist/meta.json` by relative path, so builds only work inside the full workspace. This plan guarantees the packaged meta matches the released sources (`prepack`), releases `@art-md/parser@0.0.7` carrying the re-authored `{@link}` targets, and replaces the sync script with a zero-dependency fetcher that downloads the pinned `dist/meta.json` from the npm CDN endpoint and merges the entities for the Astro collection — no cross-project dependencies added to the docs project. The `noodlestan/registry` endpoints will _advertise_ the npm-hosted meta rather than copy it; the registry remains reserved for artifacts that are not published to npm. Every repository keeps producing `dist/meta.json` under that same name for the shared local tool.

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
::READ `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` (Conventions) — Exact-pin model; the consumer pin follows it.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Commit message format.

## Scope

Two repositories: `$ART_MD` publishes, `$PROJECT` consumes. The registry advertisement is a follow-up outside both.

### (Scope) Package: Art MD Parser

**Record:** `$PARSER/_records/package.art`

**Role:** Owns and publishes the canonical `meta.json`.

**Changes:**

- Add a `prepack` script running `npm run extract` so the packed `dist/meta.json` is always regenerated from the sources being released — freshness by construction, not by habit.
- Release `@art-md/parser@0.0.7` (user `npm publish` gate) carrying the re-authored `{@link}` targets integrated in `9b065e3`.

**Dependencies:**

- None.

### (Scope) Application: Art MD Website

**Record:** `$ART_MD_WEB/_records/package.art`

**Role:** Consumes the published meta at pinned versions, fetched from the npm endpoint.

**Changes:**

- Add `meta-docs.config.mts` at the app root: an `endpoint` template (default `https://cdn.jsdelivr.net/npm/{package}@{version}/dist/meta.json`) and a list of `{ package, version }` entries — today one (`@art-md/parser` `0.0.7`); this file is the only place versions are pinned.
- Replace `scripts/sync-meta.mjs` with `scripts/fetch-meta.mjs`: zero runtime dependencies (built-in `fetch`), downloads each entry's `meta.json` from the endpoint, **merges all `entities` arrays into one collection** (the same operation every future multi-package docs site needs), and writes `src/data/meta.json` — so the build itself stays offline-capable after the fetch.
- Rewire the npm scripts: `extract` becomes `fetch-meta`; `dev` and `build` run it before Astro; delete `scripts/sync-meta.mjs` and the `src/data/` regeneration it owned (the directory stays gitignored as the fetch cache).
- **No `@art-md/parser` dependency is added** — the docs project documents packages it does not depend on.
- Verify: `npm run fetch-meta` downloads and merges; `npx astro sync`, `npm run build`, `npm run lint` green; rendered pages unchanged; `grep -rn sync-meta apps/` empty.

**Dependencies:**

- Iteration: Ship Fresh Meta (the pinned version must resolve a release that contains the re-authored links).

## Execution Context

Executed from `$WORKSPACE/`. Package work happens in `$ART_MD` on branch `main`; consumer work in `$PROJECT` on branch `main`. `ship-fresh-meta` runs in `$ART_MD` and cannot collide with anything. `fetch-pinned-meta` edits only the app's npm `scripts` block and scripts directory — no dependencies, no lockfile — so its overlap with Plan: Integrate Purrtrait and Shiki is limited to the same `package.json` `scripts` block; still execute the two serially to keep commits legible.

---

## Items:

| Iteration / Instructions                                           | Status  |
| ------------------------------------------------------------------ | ------- |
| Iteration: Ship Fresh Meta `./instructions/ship-fresh-meta.md`     | `READY` |
| Iteration: Fetch Pinned Meta `./instructions/fetch-pinned-meta.md` | `READY` |

### Iteration: Ship Fresh Meta

**Id:** `ship-fresh-meta`

**Status:** `READY`

**Purpose:** Make the published `meta.json` provably match the released sources.

**Description:** `prepack` regenerates the meta at pack time, and the release carrying the re-authored `{@link}` targets goes out as `0.0.7`.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/ship-fresh-meta.md`

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

### Iteration: Fetch Pinned Meta

**Id:** `fetch-pinned-meta`

**Status:** `READY`

**Purpose:** Download versioned meta from the npm endpoint and delete the workspace script.

**Description:** `$ART_MD_WEB` gets a config-pinned, zero-dependency fetcher: pinned versions live in `meta-docs.config.mts`, the script downloads each `dist/meta.json` from the npm CDN endpoint, merges the entities, and never resolves a sibling checkout again — with no `@art-md/*` dependencies added to the docs project.

**Instructions Mode:** `INSTRUCTIONS_SELF_CONTAINED_FILE`

**Instructions:** `./instructions/fetch-pinned-meta.md`

**Changes:**

- Add `meta-docs.config.mts` to `$ART_MD_WEB`: endpoint template (default `https://cdn.jsdelivr.net/npm/{package}@{version}/dist/meta.json`) plus `[{ package: '@art-md/parser', version: '0.0.7' }]` — the single source of version pins.
- Add `scripts/fetch-meta.mjs`: built-in `fetch` only (no dependencies), downloads every entry, concatenates the `entities` arrays (one merge path for N packages), writes `src/data/meta.json`.
- Rewire npm scripts: `extract` → `fetch-meta`, run before `dev`/`build`; delete `scripts/sync-meta.mjs`; `src/data/` stays as the gitignored fetch output; `content.config.ts` keeps reading the merged file.
- Verify: `npm run fetch-meta` downloads and merges; `npx astro sync`, `npm run build`, `npm run lint` from `$ART_MD_WEB` green; rendered docs unchanged; `grep -rn sync-meta apps/` empty; `git -C $PROJECT diff` shows no dependency change.

**Dependencies:**

- Iteration: Ship Fresh Meta.

#### Commits:

| ID                  | Repository / Checkout / Branch    | Policy   | Hash  | Status     |
| ------------------- | --------------------------------- | -------- | ----- | ---------- |
| `fetch-pinned-meta` | Artificials / `$PROJECT` / `main` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `fetch-pinned-meta`

**Message:**

```text
build(art-md-web): Fetch pinned meta from the npm endpoint.
```

## Work

### Next

Both iterations are `READY` with self-contained instructions: `./instructions/ship-fresh-meta.md` and `./instructions/fetch-pinned-meta.md`. Execution order: `ship-fresh-meta` (art-md repo — runs any time, pauses at the user's `npm publish` for `0.0.7`), then `fetch-pinned-meta` (needs that release on the registry; touches only the app's scripts block — no dependency or lockfile edits, so its overlap with Plan: Integrate Purrtrait and Shiki is one `package.json` section). Delegate via the delegator.

### Blockers

- `@art-md/parser` must publish `0.0.7` (iteration `ship-fresh-meta`) before `fetch-pinned-meta` runs — fetching `0.0.6` today would revert the docs to pre-`9b065e3` link targets.

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
- **`dist/meta.json` stays the local contract** — same name in every repo, consumed by the shared local tool; the config's version pins are the distribution contract. Two consumers, one generator.
- **Fetch from the npm endpoint, no cross-project dependencies** — the docs project documents packages it does not depend on; `meta-docs.config.mts` pins versions instead of `package.json`, and a zero-dependency `fetch()` script downloads and merges — adding five `@art-md/*` dependencies to the site would couple it to code it only reads data from.
- **The endpoint is a template in the config** — default `https://cdn.jsdelivr.net/npm/{package}@{version}/dist/meta.json`, swappable (unpkg, registry tarball, the registry repo) without touching the script.
- **Docs document releases** — the site's pin (`0.0.7`) says which API version it renders; a pin bump is a deliberate, reviewable diff.
- **Freshness by construction** — `prepack` regenerates the meta so a release can never ship stale documentation data.

### Follow Ups

- **Componentise the fetch script before the next website**: lift `fetch-meta` into a shared tool driven by a `meta-docs.config.mts` — the config becomes the only thing a new docs project (art-js, art-lib) needs — and have the tool hand its merged output straight to the meta service (`createMetaService`) instead of stopping at a JSON file.
- Registry endpoints advertise `meta.json` (pointer/descriptor to the npm-hosted file) once the registry checkout exists.
- Registry properly hosts artifacts that are not published to npm (the case that justifies it).
- art-js and art-lib publish and pin their meta the same way when their extraction lands.
- Consider diffing consecutive pinned metas as an API-surface check at release time.

### Feedback

- None yet.
