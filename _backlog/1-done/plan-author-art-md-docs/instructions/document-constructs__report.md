# Sub-Agent REPORT (#producer)

**Plan:** `author-art-md-docs`

**Iteration Id:** `document-constructs`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Iteration goal                                                           | Result                                                                                                                                                                                            | Evidence                                                                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Add extract script; generate `dist/meta.json`.                           | `libs/constructs/scripts/extract.ts` copied from `$PARSER` with `meta.package` `@art-md/constructs`; `extract` script + 3 devDependencies + tsconfig `scripts/` include                           | `npm run extract` → `Wrote : .../libs/constructs/dist/meta.json (entities: 33 size: 91579 bytes)`                |
| Author copy per the Authoring Rules; re-pin `@art-md/primitives` `0.0.8` | Module copy carries what/when, symbol copy stays behavioural, no repetition; 7 `factory/index.ts` barrels added so every module has a doc carrier; manifest re-pin landed with the release commit | `dist/meta.json`: **33/33 modules** carry a `description`; **44/50 declared symbols** (50/50 authored in source) |
| Bump `0.0.8`, changelog, lock; publish (user gate).                      | Version `0.0.8`, `CHANGELOG.md` entry, root lock refreshed with only constructs-related hunks; **publish NOT run** (NOPUSH + user gate)                                                           | `npm view @art-md/constructs version` → `0.0.7` (0.0.8 awaits the user)                                          |

Authored-copy counts, before vs after (from `dist/meta.json`):

| Metric                                     | Before                    | After                                                |
| ------------------------------------------ | ------------------------- | ---------------------------------------------------- |
| Modules with a `description`               | **0/33**                  | **33/33**                                            |
| Declared symbols with a description (meta) | **1/50** (`ConstructMap`) | **44/50**                                            |
| Declared symbols authored in source        | **1/50**                  | **50/50** (6 blocked by the extractor, see Feedback) |

#### Files changed

| File (under `$ART_MD`)                            | Change                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/constructs/scripts/extract.ts`              | New — extraction script copied from `$PARSER`, `meta.package` set to `@art-md/constructs`.                                                                                                                                                |
| `libs/constructs/package.json`                    | `extract` script entry; devDependencies `@noodlestan/purrfiles-extract` `0.0.1`, `@purrception/source-fs` `0.1.1`, `tsx` `4.23.15`; version `0.0.8`; `@art-md/primitives` re-pinned `0.0.8`.                                              |
| `libs/constructs/tsconfig.json`                   | `include` gains `scripts/` (as `$PARSER` and `primitives` do) so type-aware lint covers the script.                                                                                                                                       |
| `libs/constructs/src/**` (71 files)               | Module and symbol JSDoc authored per the Authoring Rules (one-liners).                                                                                                                                                                    |
| `libs/constructs/src/**/factory/index.ts` (7 new) | Barrels for the seven index-less `factory/` dirs — the extractor's module-doc carrier, without them those modules cannot carry a description; each parent `index.ts` now re-exports through them.                                         |
| `libs/constructs/CHANGELOG.md`                    | `0.0.8` entry: extraction, authored copy, primitives re-pin.                                                                                                                                                                              |
| `package-lock.json` (root)                        | Constructs devDependencies (commit 1); version `0.0.8` + re-pin, the three nested `@art-md/constructs@0.0.7` registry entries its exact-pinning dependents require, and the dropped nested `libs/constructs` primitives entry (commit 2). |

Not staged (verified, gitignored): `libs/constructs/dist/meta.json`.

### Commits

| ID                   | Hash      | Message                                                    | Policy                                           |
| -------------------- | --------- | ---------------------------------------------------------- | ------------------------------------------------ |
| `author-constructs`  | `d1d6602` | `docs(constructs): Add extraction and author module copy.` | `NOPUSH` — not pushed (4 ahead of `origin/main`) |
| `release-constructs` | `a378ff2` | `release(constructs): 0.0.8`                               | `NOPUSH` — not pushed                            |

### Validation

- `npm run ci` from `$ART_MD` — green (pre-commit `0-clean` + `1-ci`, 10/10 turbo tasks) on both commits; never used `--no-verify`.
- `dist/meta.json` exists and carries the authored copy (33/33 module descriptions).
- `npm pack --dry-run` from `libs/constructs` — lists `dist/meta.json` (91.6 kB), version `0.0.8`, 290 files, package size 48.6 kB.
- `npm ci --dry-run` — in sync with the refreshed lock before the release commit.
- All `.md` touched formatted with the repo's prettier (`prettier --check` clean).

### Authored copy (samples)

- `factories` module — "The construct registries and factories — reach for them when you need the union of construct types, or a record built from data instead of parsed from markdown."; `BlockContent` — "A block-level construct: any value of `BlockConstructMap`."
- `FieldBlock` module — "The FieldBlock construct — reach for it when content sits under a `**Name:**` field label: a labelled block of nested content with optional tags."; `createFieldBlock` — "Builds a `FieldBlock` from `data`, defaulting `children` to an empty list and omitting empty `tags`."
- `parser` module — "The parse side — the per-construct parsers and the document entry point that turn mdast into an `ArtDocument`; reach for them when you need the walk recomposed or seeded by hand."; `ConstructProcessor` — "The parse step that turns a node and visit context into a construct, or `null` when it does not apply."
- `serializer/tags` module — "Tag serialization — reach for them when a construct carrying `tags` is written back to markdown."; `tagsToMdast` — "Joins a construct's tags into a single leading-space text node."
- Existing copy kept as-is: `ConstructMap` — "Open registry of all constructs." (the one symbol that already complied).

### Publish (user gate — NOT executed)

```bash
cd $ART_MD/libs/constructs && npm publish   # then: npm view @art-md/constructs version  →  0.0.8
```

`publishConfig.access` is already `public`; `dist/` is built and carries `meta.json` (91.6 kB). If `dist/` was cleaned in the meantime, run `npm run build && npm run extract` first.

## Blockers (if any)

None.

## Feedback

### For the planner

- The re-pin `@art-md/primitives` `0.0.8` landed in the **release** commit (with the version bump and lock refresh), not the docs commit — the docs commit is extraction + copy only; the commit messages in the plan don't name the re-pin either way, so flagging the choice.
- The lock refresh for the re-pin has two constructs-related shapes: three new nested `@art-md/constructs@0.0.7` registry entries (`libs/parser`, `libs/serializer`, `libs/codec` exact-pin `0.0.7` while the workspace is now `0.0.8`) and the removed `libs/constructs/node_modules/@art-md/primitives` entry (the re-pin resolves to the workspace). Without the nested entries `npm ci` fails with `Missing: @art-md/constructs@0.0.7 from lock file` — same precedent as `release(primitives): 0.0.8`.
- The scale note's "every module gets a description" required a structural enabler: seven `factory/` directories had no `index.ts`, and the extractor only reads module docs from the entry file (`findIndexFile ?? findModuleEntryFile`). Added one barrel per factory dir and routed the parent module through it — no public-API change (`src/index.ts` exports unchanged). Worth stating this explicitly in future iterations that hit index-less dirs.

### For the technical writers

- Two upstream extraction gaps remain (identical to the primitives iteration's report): (1) `@purrception/lang-ts-extract` drops JSDoc on `interface` declarations — `BlockConstructMap` and `InlineConstructMap` are authored in source but absent from meta; (2) a typed arrow-function constant (`export const createFieldBlockParser: ConstructParserFactory = () => ({...})`) extracts as a `{ kind: 'ref' }` node with no `description` slot — the four `create*Parser` factories are authored in source but absent from meta. Fix upstream, or (separate decision) re-express them as `export function` declarations.
- Module-versus-symbol non-repetition held at 154-file scale: module index files carry the "reach for it when" copy, symbol one-liners stay behavioural; no module/symbol pair restates the other.
- Barrel `index.ts` files remain the module-doc carrier; the package root `src/index.ts` got a surface doc for readers but never reaches meta (not extracted as a module).

### For the crew

- `libs/constructs` now mirrors `$PARSER`'s extract setup minus `prepack`; adding `"prepack": "npm run extract"` later would make releases impossible to ship with stale meta (carried from the primitives iteration).
- `npm ls @art-md/primitives` after this iteration: nested `0.0.7` copies remain in `cli/bin`, `libs/codec`, `libs/parser`, `libs/serializer` (constructs' own nested copy is gone). Nested `@art-md/constructs@0.0.7` copies now sit in `libs/parser`, `libs/serializer`, `libs/codec` — they drain when those packages re-pin `0.0.8` in later iterations.
- Commit messages were used verbatim from the plan; `release(constructs): 0.0.8` has no trailing dot while the convention (and `release(parser): 0.0.7.`) expects one — same as the previous iteration, flagging for the planner.
