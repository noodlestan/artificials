# Sub-Agent REPORT (#producer)

**Plan:** `componentize-docs`

**Iteration Id:** `extract-docs-sections`

**Outcome:** `COMPLETED`

## Evidence

### Changes

Iteration goal: move the five docs sections into `@noodlestan/astro-docs` with their JSDoc surface intact and the breadcrumbs route-injected, then re-point the Art MD Website at the package with byte-identical rendered output — two commits, one per repository. All goals met under the amended (user-ratified) Step 5 gate.

| Goal                                                                              | Result          | Evidence                                                                                                        |
| --------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| Five sections moved into the package with barrel exports                          | DONE — commit A | `a406701` (10 files); `$NOODLESTAN_WEB` `npm run ci` green 3/3 (prettier + eslint + tsc, fixture build, test)   |
| `DocsBreadcrumbs` route-injected; no route literal survives in the package        | DONE            | `grep -rn "'/docs" $PACKAGE/src` → no matches                                                                   |
| `DocsResolveLink` defined in the package (`src/types.ts`) and re-exported         | DONE — commit A | identical shape to the app's `src/lib/meta.ts`; imported by three sections                                      |
| Fixture renders `DocsBreadcrumbs` (sample route-helper props) + `EntitiesSection` | DONE — commit A | fixture `test/astro/src/pages/index.astro`; fixture build renders both components                               |
| App re-pointed: three pages + PageLayout + docs style block removed + `file:` dep | DONE — commit B | `03b51d1` (12 files); `grep -rn "components/docs" $ART_MD_WEB/src` → no matches                                 |
| Byte-identical rendered output (amended normalization)                            | DONE            | `diff -r /tmp/docs-before-normalized /tmp/after` → **empty** (15/15 files aligned), re-confirmed after commit B |
| JSDoc surface intact (params, members, `{@link}` anchors)                         | DONE            | count parity below                                                                                              |
| Commit A `extract-docs-sections` (Noodlestan Web, NOPUSH)                         | DONE            | `a406701` — created, **not pushed** (`main...origin/main [ahead 2]`)                                            |
| Commit B `repoint-art-md-docs` (Artificials, NOPUSH)                              | DONE            | `03b51d1` — created, **not pushed** (`main...origin/main [ahead 6]`)                                            |

#### Files changed

Commit **`a406701`** — `build(astro-docs): Add the docs sections extracted from art-md-web.` — `$NOODLESTAN_WEB` @ `077f840`, staged exactly `$PACKAGE/**` (10 files):

- `packages/astro-docs/src/components/DocsBreadcrumbs.astro` — moved from `$ART_MD_WEB/src/components/docs/`; routes import removed; props now `docsRoot`, `apiRoot`, `packageHref`, `moduleHref` + `pkg`/`mod`/`type`/`ent`.
- `packages/astro-docs/src/components/EntitiesSection.astro`, `EntitySummary.astro`, `FunctionsSection.astro`, `TypesSection.astro` — moved; `../../lib/meta` type import replaced with `../types`.
- `packages/astro-docs/src/types.ts` — new; `DocsResolveLink` with identical shape to the app's.
- `packages/astro-docs/src/astro.d.ts` — new; `*.astro` module declaration copied from `@noodlestan/astro-components`, required for `tsc --noEmit` once the barrel exports `.astro` files.
- `packages/astro-docs/src/components/index.ts` — exports the five components by name; `src/index.ts` re-exports `./components` and `./types`.
- `packages/astro-docs/test/astro/src/pages/index.astro` — fixture extended (delegator directive): renders `DocsBreadcrumbs` with all four injected route-helper props and `EntitiesSection` with one dummy `{ href, label }` entry.
- `$NOODLESTAN_WEB/package-lock.json` — unchanged (nothing to stage).

Commit **`03b51d1`** — `refactor(art-md-web): Consume \`@noodlestan/astro-docs\`.`—`$PROJECT`@`40ec03f`, staged exactly the prescribed 12 entries:

- `apps/art-md-web/src/pages/docs/api/[ns]/[pkg].astro`, `[ns]/[pkg]/[mod].astro`, `[ns]/[pkg]/[mod]/[type]/[ent].astro` — import the five components from `@noodlestan/astro-docs`; breadcrumbs receive `docsRoot="/docs"`, `apiRoot="/docs/api"` (the ratified literal), `packageHref`, `moduleHref`.
- `apps/art-md-web/src/layouts/PageLayout.astro` — `import '@noodlestan/astro-docs/global.css';` after the `@noodlestan/astro-components/global.css` import.
- `apps/art-md-web/src/styles/global.css` — Purrtrait docs block removed (−57 lines).
- `apps/art-md-web/src/components/docs/` — five source files deleted (directory gone).
- `apps/art-md-web/package.json` — exactly one dependency added: `"@noodlestan/astro-docs": "file:../../../noodlestan-web/packages/astro-docs"`.
- `package-lock.json` — +24 / −0, the `file:` link only (see the concurrency note below).

**Amended gate result (Step 5 item 1, ratified 2026-11-06):** both sides normalized with the instruction's `normalize()` (dot-tolerant `/_astro/[^"]*\.(css|js)`, `data-astro-cid-*` → `CID`, `<style>…</style>` stripped) — `diff -r /tmp/docs-before-normalized /tmp/after` → **exit 0, zero differences** (15 vs 15 files), reproduced after both commits against the hook-rebuilt `dist`.

**Three-class decomposition kept as waiver evidence** (raw pre-amendment comparison, same trees):

| Normalization                                   | Differing files | Artifact                      |
| ----------------------------------------------- | --------------- | ----------------------------- |
| Original instruction `sed`                      | 15/15           | `/tmp/docs-diff.txt`          |
| Original `sed` + `data-astro-cid-*` stripped    | 15/15           | `/tmp/docs-diff-b.txt`        |
| + `<style>` blocks + `/_astro/*` links stripped | 0/15            | visible markup byte-identical |

The three ratified classes, as observed: (a) scope hash `data-astro-cid-4oibqiwd` → `data-astro-cid-viwm2ulo` on the breadcrumbs nav + its inline selector (9 pages; path-derived per `CompileOptions.normalizedFilename`); (b) `/_astro/SiteFooter.DVDVQMIr.css` → `SiteFooter.Bf9RkarT.css` (15 pages; the old pattern missed dotted basenames); (c) docs styles moved from the external chunk into inline `<style>` (15 pages; package stylesheet under the `inlineStylesheets: 'auto'` threshold).

**JSDoc coverage (Step 5 item 2):**

- Params parity: `meta.json` nodes carrying a `paramTags` key = 4; with non-empty `paramTags` = 3 — `buildDocument.buildDocument` (3), `mdast.isBlockType` (1), `parse.parse` (2); rendered `jsdoc-params` blocks in `dist` = 6 = 3 functions × 2 render sites (module page + entity page). Parity holds.
- `ParserConfig` member descriptions render: `<li id="ParserConfig.defaultConstruct">`, `<li id="ParserConfig.constructs">` with descriptions on `dist/docs/api/art-md/parser/config/module/config/index.html`.
- `{@link ParserConfig}` renders as `/docs/api/...` anchors: `href="/docs/api/art-md/parser/config/module/config#ParserConfig"` (4 anchors from the config module description).

**Grep gates (Step 5 item 3):** `grep -rn "'/docs" $NOODLESTAN_WEB/packages/astro-docs/src` → none; `grep -rn "components/docs" $ART_MD_WEB/src` → none.

**Execution notes:**

- Step 5 sequence ran green before committing: `npm run lint:fix` → `npx astro sync` → `npm run build` (15 pages, fetch-meta OK) → `npm run lint`; both pre-commit hooks ran the full `npm run ci` trees (all green).
- A concurrent third-party change appeared in `$PROJECT` at 01:02 (root `package.json` + mirrored lockfile lines adding devDependency `"@types/node": "24.13.0"` — not produced by any command of this iteration; my `npm install` at 00:20 touched only the +24 lockfile lines). It is outside the Commit B staging list, so the lockfile was staged surgically: index = `HEAD + file: link` (+24/−0, hash-object + `update-index`), leaving the working tree untouched; neither commit contains any `@types/node` line (verified with `git show`).
- Cross-repository moves use plain `mv` + per-repo staging (`git mv` cannot cross repositories).

**Uncommitted files after both commits:**

- `$NOODLESTAN_WEB` — clean.
- `$PROJECT`:
  - `_backlog/3-now/plan-componentize-docs/instructions/extract-docs-sections.md` — the delegator's amended instruction (theirs; authoritative, untouched by this worker).
  - `package.json` (root) + `package-lock.json` — the third-party `@types/node` WIP described above (theirs; both left unstaged for their owner).
  - `_backlog/3-now/plan-componentize-docs/instructions/extract-docs-sections__report.md` — this report (untracked by design; reports are not committed with delivered work).

## Blockers (if any)

None — the original byte-gate blocker was resolved by the user-ratified Step 5 amendment (evidence above); both commits were then created and left unpushed per NOPUSH.

## Feedback

### For the planner

- The amendment worked as intended: the three observed classes are exactly what the new `normalize()` collapses; the gate is now empty on repeated runs. Consider recording the pre-amendment decomposition (15/15 → 0/15) as plan Evidence next to the ratified waiver so the acceptance criterion stays auditable.
- Ordering note: the directive had me re-run Step 5 before the Step 3 commit (the instruction's original order puts Commit A first). Outcome is identical; worth aligning the step text with the "verify before either commit" gate if you re-delegate similarly.
- The `@types/node` WIP in `$PROJECT` root manifests still needs its own commit by whoever introduced it — Commit B intentionally excludes it.

### For the technical writers

- The rewritten Step 5 item 1 is precise and executable as written; the `normalize()` function needs no interpretation. One subtlety for future readers: the baseline tree must be path-aligned with the after tree (`dist/` prefix on both sides) or `diff -r` reports "Only in" noise rather than real deltas.
- The Step 4.2 literal is now self-explanatory (why `DOCS_ROOT` cannot be imported) — no ambiguity left for a fresh worker.

### For the crew

- Consuming the package needs no `astro.config`/`noExternal` change: Vite bundles the `file:`-linked raw-TS package as-is (build green without touching `astro.config.mjs`).
- The package requires `src/astro.d.ts` for `tsc --noEmit` once barrels export `.astro` files; it ships in commit A as part of the model's shape.
- Editing `.md`/CSS then running the root hook: `prettier . -c` covers the whole tree including untracked reports, so format every `.md` you touch first; removing the global.css block needs one `npm run lint:fix` (trailing newline) before `npm run lint` passes.
- When a workspace lockfile carries concurrent edits from another session, stage it surgically (reconstruct `HEAD + your hunks`, `git hash-object -w` + `git update-index --cacheinfo`) instead of `git add`, to keep the committed manifests internally consistent.
