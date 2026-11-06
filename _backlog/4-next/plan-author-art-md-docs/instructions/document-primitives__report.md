# Sub-Agent REPORT (#producer)

**Plan:** `author-art-md-docs`

**Iteration Id:** `document-primitives`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Iteration goal                                                          | Result                                                                                                                                    | Evidence                                                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Add extract script + `extract` script entry; generate `dist/meta.json`. | `libs/primitives/scripts/extract.ts` copied from `$PARSER` with `meta.package` `@art-md/primitives`; `extract` script + 3 devDependencies | `npm run extract` → `Wrote : .../dist/meta.json (entities: 9 size: 42983 bytes)` |
| Author copy per the Authoring Rules.                                    | 9 module descriptions + 25 symbol descriptions authored as one-liners; module = what/when, symbol = what it is, no repetition             | `dist/meta.json`: 9/9 modules carry a `description`; 25/30 declared symbols      |
| Bump `0.0.8`, changelog, lock; publish (user gate).                     | Version `0.0.8`, `CHANGELOG.md` entry, root lock refreshed; **publish NOT run** (NOPUSH + user gate)                                      | `npm view @art-md/primitives version` → `0.0.7` (0.0.8 awaits the user)          |

#### Files changed

| File (under `$ART_MD`)               | Change                                                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/primitives/scripts/extract.ts` | New — extraction script copied from `$PARSER`, `meta.package` set to `@art-md/primitives`.                                                              |
| `libs/primitives/package.json`       | `extract` script entry; devDependencies `@noodlestan/purrfiles-extract` `0.0.1`, `@purrception/source-fs` `0.1.1`, `tsx` `4.23.15`; version `0.0.8`.    |
| `libs/primitives/tsconfig.json`      | `include` gains `scripts/` (as `$PARSER` does) so ESLint type-aware lint covers the script.                                                             |
| `libs/primitives/src/**` (20 files)  | Module and symbol JSDoc authored per the Authoring Rules (one-liners).                                                                                  |
| `libs/primitives/CHANGELOG.md`       | `0.0.8` entry: extraction + authored copy.                                                                                                              |
| `package-lock.json` (root)           | Primitives devDependencies (commit 1); version `0.0.8` + the `@art-md/primitives@0.0.7` nested entries its exact-pinning dependents require (commit 2). |

Not staged (verified, gitignored): `libs/primitives/dist/meta.json`.

### Commits

| ID                   | Hash      | Message                                                    | Policy                                           |
| -------------------- | --------- | ---------------------------------------------------------- | ------------------------------------------------ |
| `author-primitives`  | `7dc5ad5` | `docs(primitives): Add extraction and author module copy.` | `NOPUSH` — not pushed (2 ahead of `origin/main`) |
| `release-primitives` | `f14a377` | `release(primitives): 0.0.8`                               | `NOPUSH` — not pushed                            |

### Validation

- `npm run ci` from `$ART_MD` — green (pre-commit `0-clean` + `1-ci`, 9/9 turbo tasks) on both commits; never used `--no-verify`.
- `dist/meta.json` exists and carries the authored copy (9/9 module descriptions).
- `npm pack --dry-run` from `libs/primitives` — lists `dist/meta.json` (43.0kB), 75 files total, package size 15.8 kB.
- `npm ci --dry-run` — in sync with the refreshed lock.
- All `.md` touched formatted with the repo's prettier (`prettier --check` clean).

### Authored copy (samples)

- `codec` module — "The codec contract — reach for it when a caller must parse and serialize Art MD without depending on the parser or serializer packages directly."; `ArtCodec` — "Parses markdown to an `ArtDocument` and serializes it back, over a named construct registry."
- `document` module — "The document root — reach for it when you need an `ArtDocument` to build on rather than to parse one."; `createArtDocument` — "Builds an `ArtDocument`, defaulting to an empty child list when no data is given."
- `parser/context` module — "The parse and visit contexts a walk carries, plus the factories that build them — one parse context per document, one visit context per node visit."; `ParseContext` — "Identifies the document being parsed by its `uri`."
- `source` module — "Read and write Art MD through a content source with a codec, keeping the parsed document cached between calls."; `createArtDocumentSource` — "Wraps a content source in a document source: parse on read, serialize on write, cache in between."
- Existing copy corrected: `ConstructBase` — "The shape every construct implements: a discriminator plus an optional source position." (was the typo `Base type toMdastemented by every construct.`).

### Publish (user gate — NOT executed)

```bash
cd $ART_MD/libs/primitives && npm publish   # then: npm view @art-md/primitives version  →  0.0.8
```

`publishConfig.access` is already `public`; `dist/` is built and carries `meta.json`. If `dist/` was cleaned in the meantime, run `npm run build && npm run extract` first.

## Blockers (if any)

None.

## Feedback

### For the planner

- The lock refresh cannot be a single version line: the five exact-pinning dependents (`cli/bin`, `libs/codec`, `libs/constructs`, `libs/parser`, `libs/serializer` at `0.0.7`) make npm add nested `@art-md/primitives@0.0.7` registry entries, and without them `npm ci` fails with `Missing: @art-md/primitives@0.0.7 from lock file`. Kept them — they are all `@art-md/primitives`-related, so nothing unrelated needed reverting. Precedent: `release(parser): 0.0.7.` (`6502b22`) shipped the same shape.
- Consider saying "lock diff must be primitives-only" rather than "only the version change" in later release iterations; the literal reading breaks `npm ci`.

### For the technical writers

- `@purrception/lang-ts-extract` drops JSDoc on `interface` declarations (`extractTypeFromDeclaration` returns `extractInterfaceDeclaration(...)` without `description`). Five primitives interfaces are authored in source but absent from `dist/meta.json`: `ArtCodec`, `ParseResult`, `SerializeResult`, `ArtContentSource`, `ArtDocumentSource`. Either fix upstream, or express those contracts as type aliases (API-shape change — needs an explicit decision).
- Barrel `index.ts` files are the module-doc carrier (file-level comment above the first export); the package root `src/index.ts` is not extracted as a module, so its copy never reaches meta.

### For the crew

- `libs/primitives` now mirrors `$PARSER`'s extract setup minus `prepack`; adding `"prepack": "npm run extract"` later would make releases impossible to ship with stale meta.
- Commit messages were used verbatim from the plan; `release(primitives): 0.0.8` has no trailing dot while the convention (and `release(parser): 0.0.7.`) expects one.
