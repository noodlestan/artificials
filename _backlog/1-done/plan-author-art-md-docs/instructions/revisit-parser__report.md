# Sub-Agent REPORT (#producer)

**Plan:** `author-art-md-docs`

**Iteration Id:** `revisit-parser`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Iteration goal                                                                | Result                                                                                                                                                                                                                                                 | Evidence                                                                                                                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Qualify cross-package `{@link}` targets; adjust copy per the Authoring Rules. | **5** cross-package links re-authored to the qualified `pkg:module#Symbol` form; **6** in-package `entity#symbol` links kept; **2** no-docs-page targets left unqualified; module/symbol repetition removed across 10 files per the canonical example. | `grep -rn "{@link" libs/parser/src` — no unqualified `ParseContext`/`ArtDocument`/`ParserVisitContext` left; `dist/meta.json` carries the qualified target. |
| Re-pin `primitives` and `constructs` `0.0.8`; regenerate meta.                | Manifest pins `@art-md/primitives` `0.0.8` + `@art-md/constructs` `0.0.8`; both now resolve to the workspace links — parser's nested registry copies drained to **0**; `dist/meta.json` regenerated (16.5 kB, 4 entities).                             | `npm ls` — `@art-md/parser@0.0.8` → `primitives@0.0.8 deduped -> ./libs/primitives`, `constructs@0.0.8 deduped -> ./libs/constructs`; exits clean.          |
| Bump `0.0.8`, changelog, lock; publish (user gate).                           | Version `0.0.8`, `CHANGELOG.md` entry, root lock refreshed with parser hunks only; **publish NOT run** (NOPUSH + user gate).                                                                                                                           | `npm view @art-md/parser version` → `0.0.7` (0.0.8 awaits the user); `primitives`/`constructs` → `0.0.8`.                                                   |

#### Files changed

| File (under `$ART_MD`)                                  | Change                                                                                                                                                                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/parser/src/index.ts`                              | Root surface doc now carries the canonical what/when: "`parse` is the main entry point; the config factory and the config type are exposed so consumers can recompose the parser if needed."                         |
| `libs/parser/src/parse/index.ts`                        | Module description keeps entry-point what/when + the `config#createDefaultParserConfig` link; dropped the signature ordering and the implementation flow that `parse`'s own description repeats.                     |
| `libs/parser/src/parse/parse.ts`                        | 2× `{@link ParseContext}` → `{@link @art-md/primitives:context#ParseContext}`.                                                                                                                                       |
| `libs/parser/src/config/index.ts`                       | Two paragraphs → one: what the module owns, when to use factory vs literal, construct-agnostic note.                                                                                                                 |
| `libs/parser/src/config/createDefaultParserConfig.ts`   | Dropped the when-to-use sentences — the `config` module carries them; keeps the wiring behaviour and the member links.                                                                                               |
| `libs/parser/src/config/types.ts`                       | Dropped the "never names a concrete construct" restatement — the `config` module carries it.                                                                                                                         |
| `libs/parser/src/buildDocument/index.ts`                | Dropped the visit-loop algorithm summary — `buildDocument`'s own description carries it; keeps purpose + not-exported-when.                                                                                          |
| `libs/parser/src/mdast/index.ts`                        | Compressed to one paragraph; "consulted after constructs have had their chance to claim" stated once, on the module.                                                                                                 |
| `libs/parser/src/mdast/isBlockType.ts`                  | Dropped the when-sentence (module carries it) and the block-type enumeration (duplicates `BLOCK_TYPES` membership).                                                                                                  |
| `libs/parser/src/mdast/constants.ts`                    | Dropped "Used to draw the block/phrasing boundary" (module's collective purpose); keeps membership semantics + external mdast URL link.                                                                              |
| `libs/parser/src/private/types.ts`                      | `{@link https://www.npmjs.com/package/@art-md/primitives\|ParserVisitContext}` → `{@link @art-md/primitives:context#ParserVisitContext}`; `{@link ArtDocument}` → `{@link @art-md/primitives:document#ArtDocument}`. |
| `libs/parser/src/private/createDocumentVisitContext.ts` | `{@link ParseContext}` → `{@link @art-md/primitives:context#ParseContext}`; `{@link DocumentVisitContext}` kept unqualified (no docs page — `private/` is extractor-ignored).                                        |
| `libs/parser/package.json`                              | Version `0.0.7` → `0.0.8`; `@art-md/primitives` and `@art-md/constructs` re-pinned `0.0.8` (exact pins).                                                                                                             |
| `libs/parser/CHANGELOG.md`                              | `0.0.8` entry: qualified cross-package links, authoring-rules alignment, dependency re-pins.                                                                                                                         |
| `package-lock.json` (root)                              | `libs/parser` version + both pins, and the removal of its two nested `0.0.7` registry entries (`libs/parser/node_modules/@art-md/{constructs,primitives}`) — parser now resolves to the workspace packages.          |

Not staged (verified, gitignored): `libs/parser/dist/meta.json`.

### Qualified links (5)

Owning modules discovered from `@art-md/primitives`' `dist/meta.json` (declared symbol → module):

| Source link                                             | Was                          | Now                                                     |
| ------------------------------------------------------- | ---------------------------- | ------------------------------------------------------- |
| `libs/parser/src/parse/parse.ts` (×2)                   | `{@link ParseContext}`       | `{@link @art-md/primitives:context#ParseContext}`       |
| `libs/parser/src/private/createDocumentVisitContext.ts` | `{@link ParseContext}`       | `{@link @art-md/primitives:context#ParseContext}`       |
| `libs/parser/src/private/types.ts`                      | `{@link ArtDocument}`        | `{@link @art-md/primitives:document#ArtDocument}`       |
| `libs/parser/src/private/types.ts`                      | npm URL `ParserVisitContext` | `{@link @art-md/primitives:context#ParserVisitContext}` |

- `ParseContext` / `ParserVisitContext` are declared at `src/parser/context/types.ts` → module `context`; `ArtDocument` at `src/document/types.ts` → module `document`.
- **Nothing in the parser links to `constructs` symbols** — no `{@link}` target lived there, so nothing to qualify on that side.
- Kept as-is: 6 in-package `entity#symbol` links (`config#…` ×5, `mdast#BLOCK_TYPES` ×1), 2 `{@link DocumentVisitContext}` (no docs page), 1 external mdast URL.

**Deviation from the instruction's literal example — flagged for the planner:** the instruction writes the shorthand `{@link primitives:<owning-module>#…}`; I authored the full scoped form `{@link @art-md/primitives:…#…}` because `@noodlestan/purrfiles-entities@0.0.1` parses expressions as `[pkg:][type:]name` and matches `pkg` against `entity.package`, which is the full scoped name (its own test suite asserts `resolveEntityExpression('@art-md/parser:parse')`). The short `primitives:` token never matches, so `resolveLink` would log `Could not resolve link for "primitives:context#ParseContext"` and the docs would fall back to plain text — defeating this iteration's purpose and the refresh iteration's "render as anchors" check.

### Commits

| ID               | Hash      | Message                                                                       | Policy                                           |
| ---------------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------ |
| `revisit-parser` | `6abf01c` | `docs(parser): Qualify cross-package links; align copy with authoring rules.` | `NOPUSH` — not pushed (6 ahead of `origin/main`) |
| `release-parser` | `9a70c03` | `release(parser): 0.0.8`                                                      | `NOPUSH` — not pushed                            |

### Validation

- `npm run ci` from `$ART_MD` — green on both commits (pre-commit `0-clean` + `1-ci`, 10/10 turbo tasks, parser coverage 100%); never used `--no-verify`.
- `dist/meta.json` regenerated and carries the qualified target: `{@link @art-md/primitives:context#ParseContext}` (extracted `parse` description); no unqualified `ParseContext`/`ArtDocument`/npm-URL targets remain in source or meta.
- `npm pack --dry-run` from `libs/parser` — lists `dist/meta.json` (16.5 kB) and `CHANGELOG.md`; version `0.0.8`, 45 files, package size 34.4 kB; `prepack` ran `npm run extract` as part of the dry run.
- `npm ci` run after the lock refresh — tree matches the lock; `npm ci --dry-run` in sync; `npm ls @art-md/primitives` and `npm ls @art-md/constructs` exit clean (no `ELSPROBLEMS`).
- All `.md` touched formatted with the repo's prettier first.

### Copy changes (samples)

- Root `src/index.ts` (canonical carrier): "`parse` is the main entry point; the config factory and the config type are exposed so consumers can recompose the parser if needed."
- `parse` module: "Owns `parse` — the main entry point: reach for it to turn raw markdown into an `ArtDocument`. Its default context comes from `config#createDefaultParserConfig`." — signature ordering and the visit flow stay on `parse`'s own description.
- `config` module keeps the when ("callers wanting standard behaviour use the factory, callers building a custom parser construct a literal"); `createDefaultParserConfig` no longer repeats it.
- `mdast` module keeps "consulted by `buildDocument` after construct parsers have had their chance to claim a node"; `isBlockType` no longer repeats it.

### Lock drain

- `npm ls @art-md/primitives` nested `0.0.7` copies: **before 5 on disk** (`cli/bin`, `libs/codec`, `libs/constructs` stale, `libs/parser`, `libs/serializer`) → **after 3** (`cli/bin`, `libs/codec`, `libs/serializer`); **`libs/parser` now has 0 nested copies** (both deps `deduped -> ./libs/primitives` / `./libs/constructs`). Remaining 3 drain with `serializer` and `codec` (and `bin`) in their iterations.
- Lock diff: 3 insertions, 26 deletions, every hunk under `libs/parser`.

### Publish (user gate — NOT executed)

```bash
cd $ART_MD/libs/parser && npm publish   # then: npm view @art-md/parser version  →  0.0.8
```

`publishConfig.access` is already `public`, and `prepack: npm run extract` regenerates `dist/meta.json` at publish time, so a separate post-publish `npm run extract` is covered by `prepack` (run it anyway only if you want the local file touched explicitly).

## Blockers (if any)

None.

## Feedback

### For the planner

- **Link-token form:** the instruction's `{@link primitives:…#…}` shorthand does not resolve — `purrfiles-entities` matches `pkg` against the full scoped `entity.package` (see the deviation note above for the evidence). I authored the scoped form so the links actually link; if the short form is the intended long-term spelling, that is a `purrfiles-entities` resolver change (`matchExpression` pkg branch), best landed before `refresh-api-docs` verifies anchors.
- **Ahead of `refresh-api-docs`:** `createMetaService` → `indexEntities` throws `Duplicate entity {name} of type module` on duplicates within one package. `@art-md/primitives`' meta has `context` ×2 (`src/parser/context`, `src/serializer/context`) and `@art-md/constructs`' has `factory` ×7 plus `Document`/`FieldBlock`/… ×2 — merging all five metas will throw before any link resolves. Not fixable from this iteration; worth a plan item (dedupe keys, or module namespacing in extraction).
- The re-pin landed in the **release** commit (with version, changelog, lock) — same choice as `document-constructs`.
- `release(parser): 0.0.8` used verbatim from the plan (no trailing dot) — same note as the previous two iterations.

### For the technical writers

- Non-repetition was applied by territory: **when-to-use** lives on the module, **signature and behaviour** on the symbol, **implementation flow** on the symbol. The one-liner rule (few exports) compressed every parser module to a single paragraph; no module/symbol pair restates the other now.
- The canonical example's carrier is the package root `src/index.ts`, which never reaches meta (not extracted as a module) — the rendered `parse` module page carries the "main entry point" what/when for site readers.
- Only the first JSDoc block of `parse` (the first overload) reaches `dist/meta.json`; the second overload's qualified link exists in source but not in meta — an extractor limit of the same class as `document-constructs`' gaps.
- `{@link DocumentVisitContext}` stays unqualified by rule: `private/` and `test/` are extractor-ignored, so the target has no docs page and renders as plain text.

### For the crew

- `npm install` alone left the parser's stale nested `@art-md/{primitives,constructs}@0.0.7` dirs on disk (they showed as `invalid` in `npm ls`); `npm ci` pruned them. Run `npm ci` after lock-draining re-pins before trusting `npm ls` counts.
- `prepack` (`npm run extract`) means the publish itself regenerates meta with the new links — no manual extract is required after the user's publish.
- Both commits pre-committed through the root hook (`0-clean` + `1-ci`) with the tree formatted; report file intentionally not committed.
