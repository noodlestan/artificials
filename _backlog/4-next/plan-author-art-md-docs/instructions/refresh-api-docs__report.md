# Sub-Agent REPORT (#producer)

**Plan:** `author-art-md-docs`

**Iteration Id:** `refresh-api-docs`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Iteration goal                                                                             | Result                                                                                                                                                                                                                              | Evidence                                                                                                                             |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Add five entries to `$ART_MD_WEB/meta-docs.config.mts` at the versions this plan published | One entry (`@art-md/parser` `0.0.7`) replaced by five: `primitives` `0.0.8`, `constructs` `0.0.8`, `parser` `0.0.8`, `serializer` `0.0.7`, `codec` `0.0.6`, in dependency order                                                     | `meta-docs.config.mts`; repo prettier reports it unchanged                                                                           |
| Run `npm run fetch-meta` and confirm the merged output carries all five packages           | All five fetched from the jsdelivr endpoint on the first run (no CDN lag, no retries): **50 entities** merged into `src/data/meta.json` (170,497 bytes)                                                                             | Fetch log: `Fetched @art-md/primitives@0.0.8: 9 entities` … `Fetched @art-md/codec@0.0.6: 1 entities`, `Merged 50 entities`          |
| `content.config.ts` and the collection schema need no change                               | **Proven false by verification** — merging five metas hard-failed with `Duplicate entity context of type module.` Minimal fix staged: `readMeta` keeps the first entity per `package/type/name` (the plan's own "first-match wins") | `npx astro sync` exit 1 before the fix, exit 0 after; error thrown from `@noodlestan/purrfiles-entities` `indexEntities`             |
| Package pages render for all five                                                          | Five routes built, each with its `<h1>@art-md/…</h1>` and module list                                                                                                                                                               | `dist/docs/api/art-md/{primitives,constructs,serializer,codec,parser}/index.html`                                                    |
| Cross-package `{@link pkg:module#Symbol}` targets render as anchors                        | The expected `{@link @art-md/primitives:context#ParseContext}` renders as an `<a>` in the page body; 8 further cross-package anchors render on serializer/codec pages                                                               | `<a href="/docs/api/art-md/primitives/parser/module/context#ParseContext">ParseContext</a>` inside `<div class="jsdoc-description">` |
| `npm run build` + `npm run lint` pass; no dependency or lockfile changes                   | Build green (75 pages), prettier clean; `git diff` empty for `apps/art-md-web/package.json` and `package-lock.json`; the commit carries neither file                                                                                | See Validation                                                                                                                       |

#### Files changed

| File (under `$PROJECT`)                 | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/art-md-web/meta-docs.config.mts`  | `packages`: 1 entry → 5 entries at the published versions.                                                                                                                                                                                                                                                                                                                                                                                               |
| `apps/art-md-web/src/content.config.ts` | `readMeta` now filters to the first entity per `package/type/name` before the collections consume it. **Staged because verification proved it necessary** (a "collection file" per the delegation's staging rule): `@art-md/primitives@0.0.8` ships two `module` entities named `context` (`src/parser/context`, `src/serializer/context`) and the meta index rejects duplicates, so the merge threw; the in-file comment names the extractor follow-up. |

No `.md` file was modified by the change itself.

### Commits

| ID                 | Hash      | Full hash                                  | Message                                                 | Policy                         |
| ------------------ | --------- | ------------------------------------------ | ------------------------------------------------------- | ------------------------------ |
| `refresh-api-docs` | `261cffb` | `261cffba98bb8cce5ec7743897f7148004ec30dc` | `build(art-md-web): Document all five art-md packages.` | `NOPUSH` — not pushed (`main`) |

### Validation

- `npm run fetch-meta` from `$ART_MD_WEB` — five fetches, first try, **no CDN lag observed**:
  - `@art-md/primitives@0.0.8` → 9, `@art-md/constructs@0.0.8` → 33, `@art-md/parser@0.0.8` → 4, `@art-md/serializer@0.0.7` → 3, `@art-md/codec@0.0.6` → 1; merged **50** (170,497 bytes).
  - Per-package counts from `src/data/meta.json`: **primitives 9, constructs 33, parser 4, serializer 3, codec 1** (50 total). After the duplicate filter the collection holds **32**: primitives 8, constructs 16, parser 4, serializer 3, codec 1.
- `npx astro sync` — exit 1 before the fix (`Duplicate entity context of type module.`, keyed on primitives' `context`), exit 0 after (`Synced content`, types generated).
- `npm run build` — green, **75 pages**; `npm run lint` (prettier `. -c`) — green ("All matched files use Prettier code style!").
- Pre-commit hook ran the whole-tree `npm run ci` — green (`0-clean`, `1-extract`, `2-ci`); never used `--no-verify`.
- All five routes exist in `dist/docs/api/art-md/{primitives,constructs,serializer,codec,parser}/index.html` with module lists: primitives 8, constructs 16, parser 4, serializer 3, codec 1.
- Qualified-link observation: `{@link @art-md/primitives:context#ParseContext}` (the one `revisit-parser` expected to render — `libs/parser/src/parse/parse.ts`, public source) renders as an anchor in the body of `/docs/api/art-md/parser/parse`. The other four parser qualified links live in `src/private/*`, which the extractor ignores, so they are absent from the meta and cannot render — **not treated as failures**, as instructed. With serializer and codec now merged, additional cross-package body anchors render: `@art-md/primitives:codec#ArtCodec`, `…:document#ArtDocument`, `…:serializer#SerializeResult`, `@art-md/constructs:serializer#ConstructSerializerFactory`, `@art-md/parser:config#ParserConfig`, `@art-md/parser:parse#parse`, `@art-md/serializer:serializer#serialize` (9 cross-package anchors in body copy total).
- Residual raw `{@link …}` strings in `dist/` (8 pages: codec, serializer, parser — module and entity pages) sit **only** inside `<meta name="description">`; every body `.jsdoc-description` resolves its links. Pre-existing, cosmetic, out of this iteration's scope.
- `git diff -- apps/art-md-web/package.json package-lock.json` empty before and after the commit; the commit contains exactly the two files above; no `.md` touched (so no prettier pass was needed for the change).

### Uncommitted files

None — `$PROJECT` working tree is clean; this report file is intentionally not committed.

## Blockers (if any)

None.

## Feedback

### For the planner

- **The instruction's "content.config.ts and the collection schema need no change" does not hold.** `@noodlestan/purrfiles-entities` indexes entities by `package/type/name` and _throws_ on a duplicate. Two of the five metas collide: `primitives` twice (`context` — already recorded in this plan's Feedback) and **`constructs` 17 times** (`factory` ×7, `FieldBlock` ×3, `FieldInline` ×3, `NaturalBlock` ×3, `SectionBlock` ×3, `Document` ×2, `NaturalExpression` ×2, `tags` ×2 — the nested-module layout the directory extractor emits). While only `parser` was pinned the site never hit this; merging five metas does. The staged fix is the plan's own recorded semantics — first-match wins, applied at the single `readMeta` choke point — and no dependency path existed anyway (`@noodlestan/purrfiles-entities` `0.0.1` is the newest release; dependency/lockfile changes are forbidden here).
- **Cost of first-match: the collection drops 18 of 50 entities** (1 primitives + 17 constructs), so constructs renders **16 of its 33 modules** — the nested ones (`src/factories/constructs/Document/factory`, `…/Tag/factory`, …) share the bare name `factory`, and the v1 entity id, module route, and meta index are all name-keyed, so each cannot get its own page. The `document-constructs` evidence "modules 33/33 authored" therefore shows as 16 on the site. Options for the architect: accept first-match now (current state), or a follow-up that keys entity ids/routes by module path (touches `content.config.ts`, `[mod].astro`, `routes.ts`), or the extractor follow-up that disambiguates names upstream (requires a republish, outside this plan).
- The CDN caution in the delegation did not materialise: every version fetched first try, and the duplicate exists in `$ART_MD/libs/primitives/dist/meta.json` too — published data, not a stale edge. No retry or wait was needed.
- The instruction's other assumptions held: routing helpers needed no change, no docs page needed edits, and no dependency or lockfile change was required.

### For the technical writers

- The ratified full-scoped form `{@link @art-md/pkg:module#Symbol}` resolves end to end across package boundaries — `parser → primitives`, `serializer → primitives/constructs`, `codec → parser/serializer/primitives` — so qualified links are now exercised on three packages, not one.
- The only raw `{@link …}` residue is the SEO meta description (the layout passes the raw JSDoc description into `<meta name="description">`); a follow-up could resolve or strip links there. Body rendering is already clean.

### For the crew

- Whole-tree `npm run ci` runs on the pre-commit hook and stayed green; `apps/art-md-web` builds in ~1.4 s and is turbo-cached. Nothing outside `apps/art-md-web/` was touched, and the commit stayed file-scoped.
