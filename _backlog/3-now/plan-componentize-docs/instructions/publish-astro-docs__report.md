# Sub-Agent REPORT (#producer)

**Plan:** `componentize-docs`

**Iteration Id:** `publish-astro-docs`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Iteration goal: retire the plan's one remaining `file:` link — publish `@noodlestan/astro-docs` as `0.0.1`, swap the consumer to the exact pin, return the workspace `file:` count to zero, and clear the discharged parking-lot item. Executed in two phases: phase 1 prepared the release up to the user `npm publish` gate (`6763271`, plus `b2a0a79` completing its record); this phase did the pin swap, the verification pass, and the parking-lot clearance. All goals met; every commit is policy **NOPUSH** and none was pushed.

| Goal                                                                                                 | Result | Evidence                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1: `LICENSE-MIT` shipped, record flipped to published with `Deployment` entry, tarball proven  | DONE   | `6763271`; `npm pack --dry-run` → 14 files, only `src`, `LICENSE-MIT`, `README.md`, `CHANGELOG.md`, `package.json`                                                                                |
| User gate: `npm publish`, then `npm view @noodlestan/astro-docs version`                             | DONE   | `npm view` → `0.0.1`; tarball `https://registry.npmjs.org/@noodlestan/astro-docs/-/astro-docs-0.0.1.tgz` (re-confirmed this run)                                                                  |
| `apps/art-md-web/package.json`: `file:../../../noodlestan-web/packages/astro-docs` → exact `"0.0.1"` | DONE   | manifest reads `"@noodlestan/astro-docs": "0.0.1"`                                                                                                                                                |
| `npm install` refreshes the lock to registry resolution                                              | DONE   | lock entry `resolved: https://registry.npmjs.org/@noodlestan/astro-docs/-/astro-docs-0.0.1.tgz` + `integrity`; bare `npm install` kept the stale link, explicit install reified it — see Feedback |
| `node_modules/@noodlestan/astro-docs` is NOT a symlink                                               | DONE   | `readlink` → `NOT-A-SYMLINK`; real directory, `package.json` version `0.0.1`                                                                                                                      |
| `npm ls @noodlestan/astro-docs` resolves from the registry (no `->` arrow)                           | DONE   | `└── @noodlestan/astro-docs@0.0.1` — no arrow on the package                                                                                                                                      |
| Workspace-wide `file:` sweep across all manifests → zero                                             | DONE   | 83 `package.json` under `$WORKSPACE/checkouts/*/` (excluding `node_modules`, `dist`) → **0** `file:` entries                                                                                      |
| Docs build green from `$ART_MD_WEB` (`lint:fix` → `astro sync` → `build` → `lint`, lint last)        | DONE   | prettier clean; types generated; 15 pages built; prettier clean again                                                                                                                             |
| Remove the discharged parking-lot item                                                               | DONE   | `$PROJECT/_backlog/_parking-lot.md` `FOLLOW-UPS` no longer lists publishing `@noodlestan/astro-docs`; section now `- None current.`                                                               |
| Commit `pin-astro-docs` on `main` in `$PROJECT`, NOPUSH, only the three prescribed paths             | DONE   | `ca59d55` — staged exactly `apps/art-md-web/package.json`, `package-lock.json`, `_backlog/_parking-lot.md`; **not pushed**; no `--no-verify`                                                      |

**Verification:**

- `npm view @noodlestan/astro-docs version` → `0.0.1` (re-confirmed this run — no indexing lag).
- `readlink node_modules/@noodlestan/astro-docs` → not a symlink; reading its `package.json` → `0.0.1`.
- `npm ls @noodlestan/astro-docs` → `apps-art-md-web@0.0.2 -> ./apps/art-md-web` → `@noodlestan/astro-docs@0.0.1`, **no `->` arrow** on the package; the lock's `node_modules/@noodlestan/astro-docs` entry carries a registry `resolved` + `integrity`, and zero `noodlestan-web` references remain in `package-lock.json`.
- `file:` sweep: 83 `package.json` manifests under `checkouts/*/` (excluding `node_modules`, `dist`) → **0** `file:` entries. (A lockfile-wide grep additionally surfaces one pre-existing `file:` in `$WORKSPACE/checkouts/purrfect/package-lock.json` — a lockfile, not a manifest, in an unrelated checkout outside this plan's scope.)
- Docs build from `$ART_MD_WEB`: `npm run lint:fix` → `All matched files use Prettier code style!`; `npx astro sync` → types generated (after `Re-optimizing dependencies because lockfile has changed`); `npm run build` → **15 pages built**; `npm run lint` → clean. The two `Could not resolve link for "ParseContext"` warnings are pre-existing properties of the meta content (documented in `$PROJECT/_backlog/3-now/plan-distribute-meta-json/instructions/fetch-pinned-meta__report.md`), not caused by the pin.
- Pre-commit hook in `$PROJECT` (`0-clean` → `1-extract` → `2-ci`, whole-tree `npm run ci`) green, without `--no-verify`.
- `git -C $PROJECT status --porcelain` → only this untracked report; `origin/main..main` left ahead — NOPUSH honoured.

#### Files changed

Phase 1, commit **`6763271`** — `release(astro-docs): 0.0.1.` — `$NOODLESTAN_WEB`, staged exactly two paths:

- `packages/astro-docs/LICENSE-MIT` — **new**, copied verbatim from `packages/astro-components/LICENSE-MIT` (required by the manifest `files` array).
- `packages/astro-docs/_records/package.art` — `**Published:**` `false` → `true`; added `**Deployment:** NPM Package Deployment: Astro Docs`.

Phase 1 follow-up, commit **`b2a0a79`** — `records(astro-docs): Complete the Files list and add the npm deployment record.` — `$NOODLESTAN_WEB`: completes the record's `Files:` list and adds `_records/npm-deployment.art`. This resolves **both** phase-1 worker notes (the record-vs-manifest `Files:` drift and the dangling `Deployment` reference); they are cited here rather than re-logged as follow-ups.

Phase 2, commit **`ca59d55`** — `build(art-md-web): Pin @noodlestan/astro-docs from npm.` — `$PROJECT` @ `94ecbef`, staged exactly three paths:

- `apps/art-md-web/package.json` — `@noodlestan/astro-docs` `file:../../../noodlestan-web/packages/astro-docs` → `0.0.1`.
- `package-lock.json` — the entry now resolves the registry tarball with `integrity`; the `../noodlestan-web/packages/astro-docs` link entries are gone.
- `_backlog/_parking-lot.md` — the discharged `FOLLOW-UPS` item "Publish `@noodlestan/astro-docs` to npm …" removed (section now `- None current.`).

This report (untracked by design; reports are not committed with delivered work) — `$PROJECT/_backlog/3-now/plan-componentize-docs/instructions/publish-astro-docs__report.md`.

## Blockers (if any)

None.

## Feedback

### For the planner

- The phase split worked cleanly: stopping at "hand to the user for `npm publish`" left no ambiguity, and this half executed from the plan's inlined instructions alone. The report template's `COMPLETED` / `BLOCKER` binary does not express a gate hand-back, so phase 1 had to record `COMPLETED — first half only`; consider allowing an explicit `GATE`/`PARTIAL` outcome for split iterations.
- A bare `npm install` did **not** re-resolve the changed spec: after the `file:` → `0.0.1` swap it reported "up to date" while leaving both the `node_modules` symlink and the lock's `link: true` entry in place. Only `npm install @noodlestan/astro-docs@0.0.1 --save-exact -w apps-art-md-web` reified the registry tarball. Pin-swap steps should name an explicit install command — the silent-staleness edge `retire-file-links` recorded for `npm ci` also applies to `npm install`.

### For the technical writers

- Both phase-1 record notes are resolved by `b2a0a79` (`records(astro-docs): Complete the Files list and add the npm deployment record.`): the record's `Files:` list now matches the manifest `files` array, and `_records/npm-deployment.art` exists so the new `Deployment` reference no longer dangles. No action remains on either.
- "Mirroring the model's record" needed a judgement call: `@noodlestan/astro-components`'s own `package.art` says `NPM Package Deployment: Noodlestan Common Components`, which does not match its `npm-deployment.art` heading (`Noodlestan Astro Components`) — a known defect already flagged in `plan-noodlestan-astro-components` (line 572). The field shape was adapted to this package's own heading (`NPM Package Deployment: Astro Docs`), consistent with every other package record in the workspace.

### For the crew

- `npm pack --dry-run` output ends with the tarball filename (`noodlestan-astro-docs-0.0.1.tgz`) but writes nothing — the tree stayed clean.
- The `lefthook` pre-commit hook runs the full `0-clean → 1-extract → 2-ci` chain with no cache; commits in `$PROJECT` re-run the whole docs build and prettier over the whole tree (which is why this report is prettier-formatted even though it stays uncommitted).
- The concurrent `$PROJECT` `@types/node` WIP noted in phase 1 landed as `94ecbef` while this half ran; staging stayed file-scoped and swept none of it, and no unrelated file is left modified in either tree.
