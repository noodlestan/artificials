# Sub-Agent REPORT (#producer)

**Plan:** `distribute-meta-json`

**Iteration Id:** `fetch-pinned-meta`

**Outcome:** `COMPLETED`

## Evidence

### Changes

The goal state — `meta-docs.config.mts` as the single source of version pins, a zero-dependency `scripts/fetch-meta.mjs` that downloads the pinned `dist/meta.json` from the npm CDN endpoint and merges the entities, npm scripts rewired, and the sibling-checkout sync deleted — is fully present in `$ART_MD_WEB` and verified. All four steps executed as prescribed; the single prescribed commit was created on `main` in `$PROJECT` and **not pushed** (`NOPUSH`).

| Goal (from instruction)                                                                                    | Status   | Evidence                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Step 1 — `meta-docs.config.mts` pins `@art-md/parser` `0.0.7` over the endpoint template                   | Achieved | File created verbatim; pin agrees with `$PARSER/package.json` (`0.0.7`) and `npm view @art-md/parser version` (`0.0.7`) — no blocker                                          |
| Step 2 — `scripts/fetch-meta.mjs` zero-dependency fetch + merge keeping the `{ entities }` output contract | Achieved | Built-in `fetch` + `node:` builtins only; imports `../meta-docs.config.mts` (loads natively, no conversion); asserts `entities`, `flatMap` merge, writes `src/data/meta.json` |
| Step 3 — rewire npm scripts (`extract` → `fetch-meta`, before `dev`/`build`), delete the sync              | Achieved | `git show` diff of `package.json` touches the `scripts` block only (3 lines: `dev`, `extract`→`fetch-meta`, `build`); `scripts/sync-meta.mjs` deleted (14 lines removed)      |
| Step 4 — verify (fetch, sync, build, lint, greps) and commit `fetch-pinned-meta` verbatim, policy `NOPUSH` | Achieved | All commands green (see Verification); commit `d128ff8` with the verbatim message, created on `main`, **not pushed**                                                          |
| `grep -rn "sync-meta" $ART_MD_WEB` empty; `src/data` stays gitignored                                      | Achieved | `grep -rn "sync-meta" apps/` → no matches (exit 1); `git status --porcelain apps/art-md-web/src/data` → empty                                                                 |

#### Files changed

- `$ART_MD_WEB/meta-docs.config.mts` — **new**: `metaDocs` config with the endpoint template `https://cdn.jsdelivr.net/npm/{package}@{version}/dist/meta.json` and one pin `[{ package: '@art-md/parser', version: '0.0.7' }]`.
- `$ART_MD_WEB/scripts/fetch-meta.mjs` — **new**: imports the config (`import { metaDocs } from '../meta-docs.config.mts'` — Node's native type stripping loads it on the repo's Node v24.15.0), substitutes `{package}`/`{version}` raw into the endpoint, `fetch`es each entry (throws with URL + status on `!response.ok` → non-zero exit so the build fails loudly), asserts an `entities` array, merges with `metas.flatMap(meta => meta.entities)`, resolves `src/data/meta.json` via `fileURLToPath(new URL('../src/data/meta.json', import.meta.url))`, `mkdir`s, writes `JSON.stringify({ entities }, null, 2)`, and logs one line per fetched package plus a final merged-count/byte line. Mirrors `sync-meta.mjs`'s imports and logging style; zero dependencies.
- `$ART_MD_WEB/scripts/sync-meta.mjs` — **deleted**: the workspace-relative copy of `../../../art-md/libs/parser/dist/meta.json`.
- `$ART_MD_WEB/package.json` — **`scripts` block only**: `"dev": "npm run fetch-meta && astro dev"`, `"extract"` renamed in place to `"fetch-meta": "node scripts/fetch-meta.mjs"`, `"build": "npm run fetch-meta && astro build"`. No dependency, version, or lockfile change (proved by `git show d128ff8 -- apps/art-md-web/package.json` and the commit stat: 4 files, 40 insertions, 17 deletions, no lockfile).
- `$ART_MD_WEB/_guide.md` — **modified but intentionally NOT staged** (commit rule allows only the four files above): the package-layout entry for `scripts/` now documents `fetch-meta.mjs` instead of the deleted `sync-meta.mjs`, which is what makes the mandated `grep -rn "sync-meta" apps/` empty. Left uncommitted — see Deviations.

### Verification

Executed by this worker from the instruction's Operating Instructions and Steps:

- **Setting Up:** `npm ci` from `$PROJECT` root — success (0 vulnerabilities).
- **Pin guard (Step 1):** `$PARSER/package.json` → `0.0.7`; `npm view @art-md/parser version` → `0.0.7` — agree, so no blocker on fetching a pre-re-authored release.
- **Step 4 run sequence, from `$ART_MD_WEB`:**
  - `npm run fetch-meta` — `Fetched @art-md/parser@0.0.7: 4 entities from https://cdn.jsdelivr.net/npm/@art-md/parser@0.0.7/dist/meta.json` then `Merged 4 entities into …/src/data/meta.json (17362 bytes)` — pass.
  - `npm run lint:fix` — formatted the two new files (app config: tabs); `npx astro sync` — content synced, types generated — pass.
  - `npm run build` — `fetch-meta` ran inside the build, then 15 static pages built — pass. (Two `Could not resolve link for "ParseContext"` warnings appear; they are pre-existing properties of the meta content — the build input is byte-identical to the previous sync output, as proved below — not caused by this iteration.)
  - `npm run lint` — `All matched files use Prettier code style!` (runs after build, as prescribed) — pass.
- **Confirmations:**
  - `node -e "const m=require('./src/data/meta.json'); console.log(m.entities.length)"` → **`4`** — pass.
  - `grep -rn "sync-meta" $ART_MD_WEB` and `grep -rn "sync-meta" $PROJECT/apps/` → **no matches** (exit 1); `scripts/sync-meta.mjs` deleted — pass.
  - `git -C $PROJECT status --porcelain apps/art-md-web/src/data` → **empty** (fetched file stays gitignored as the cache) — pass.
  - **Rendered pages unchanged:** `cmp $ART_MD_WEB/src/data/meta.json $ART_MD/libs/parser/dist/meta.json` → **exit 0 (byte-identical)** — the fetched file is exactly what the old sync copied, so the build input and the rendered pages are unchanged.
  - **No dependency diff:** `git show d128ff8 --stat` lists only `meta-docs.config.mts`, `package.json`, `fetch-meta.mjs`, `sync-meta.mjs`; the `package.json` hunk is the three `scripts`-block lines only — no dependency or version line touched.
- **Commit:** `d128ff8af003d1b1d3ceed0d444c0f0a03215426` on `main` in `$PROJECT`, message verbatim `build(art-md-web): Fetch pinned meta from the npm endpoint.` Pre-commit hook (lefthook → `npm run clean`, `npm run extract`, `npm run ci`) all green (`0-clean` ✔, `1-extract` ✔, `2-ci` ✔ — whole-tree root prettier check + turbo `ci` including the app's build/lint/test). **Not pushed** per `NOPUSH`; `git status -sb` → `main…origin/main [ahead 2]`.
- **Final Verification checklist (instruction):** commit created and not pushed per policy ✔; config pins `@art-md/parser` `0.0.7` and `fetch-meta.mjs` imports it (`.mts` loads on the repo's Node without conversion) ✔; `grep -rn "sync-meta" apps/` empty and `scripts/sync-meta.mjs` deleted ✔; `package.json` diff touches the `scripts` block only ✔; docs build passes end-to-end with `src/data/meta.json` produced by the fetch, rendered pages unchanged ✔; Verifying Completion step executed ✔.
- **Uncommitted files:** `M apps/art-md-web/_guide.md` (required by the grep verification, forbidden in the commit by the staging rule — see Deviations) and this report file (never committed with the work).

### Deviations

1. **`$ART_MD_WEB/_guide.md` edited but left uncommitted.** The instruction mandates `grep -rn "sync-meta" $ART_MD_WEB` → nothing, yet the commit rule stages only the four prescribed files ("Nothing else may be staged"). The guide's package-layout line still referenced the deleted `sync-meta.mjs`, so the two requirements collide unless the guide edit stays out of the commit. Resolution: made the one-line doc fix (line 17 now documents `fetch-meta.mjs` downloading the pinned `dist/meta.json` from the npm endpoint), verified grep-empty, and staged only the four prescribed files. **Integrator action:** fold `apps/art-md-web/_guide.md` into a follow-up docs commit (or instruct a follow-up iteration); it is formatted and pre-commit-clean.

## Blockers (if any)

None. Outcome is `COMPLETED`; the single deviation above is documented for the delegator's integration.

## Feedback

Not requested — the delegation prompt contained no `DIRECTIVE FEEDBACK:`.
