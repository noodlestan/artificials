# Sub-Agent REPORT (#producer)

**Plan:** `author-art-md-docs`

**Iteration Id:** `document-codec`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Iteration goal                                        | Result                                                                                                                                                                                                                                                    | Evidence                                                                                                                                                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add extract script; generate `dist/meta.json`.        | `libs/codec/scripts/extract.ts` copied from `$PARSER` with `meta.package` `@art-md/codec`; `extract` entry + 3 devDependencies; `tsconfig` gains `scripts/`. **Source restructure required first** — see Feedback: codec's flat `src/` yields 0 entities. | First run (flat layout): `Wrote : .../libs/codec/dist/meta.json (entities: 0 size: 20 bytes)`; after moving to `src/codec/`: `(entities: 1 size: 7769 bytes)` → `(entities: 1 size: 8831 bytes)` after authoring |
| Author copy per the Authoring Rules.                  | Module carries the round trip what/when (codec vs parser + serializer directly); symbols stay behavioural; 4 qualified cross-package links (full scoped form)                                                                                             | `dist/meta.json`: modules **0/1 → 1/1**, declared symbols **0/3 → 3/3** (`createArtCodec`, `ArtCodecConfig`, `PartialArtCodecConfig`) carry descriptions                                                         |
| Author copy per the Authoring Rules; re-pin all four. | `@art-md/primitives` `0.0.8`, `@art-md/constructs` `0.0.8`, `@art-md/parser` `0.0.8`, `@art-md/serializer` `0.0.7` re-pinned in the release commit (serializer pattern: re-pins ride the release commit)                                                  | `libs/codec/package.json`; `npm ls @art-md/primitives --all` exits 0                                                                                                                                             |
| Bump `0.0.6`, changelog, lock; publish (user gate).   | Version `0.0.6`, `CHANGELOG.md` entry, root lock refreshed (every hunk codec-caused); **publish NOT run** (NOPUSH + user gate)                                                                                                                            | `npm view @art-md/codec version` → `0.0.5` (0.0.6 awaits the user)                                                                                                                                               |

#### Files changed

| File (under `$ART_MD`)                                                     | Change                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/codec/scripts/extract.ts`                                            | New — extraction script copied from `$PARSER`, `meta.package` set to `@art-md/codec`.                                                                                                                                                           |
| `libs/codec/package.json`                                                  | `extract` script entry; devDependencies `@noodlestan/purrfiles-extract` `0.0.1`, `@purrception/source-fs` `0.1.1`, `tsx` `4.23.15` (commit 1); version `0.0.6` + re-pins of all four `@art-md/*` deps (commit 2).                               |
| `libs/codec/tsconfig.json`                                                 | `include` gains `scripts/` (as `$PARSER` does).                                                                                                                                                                                                 |
| `libs/codec/src/codec/{createArtCodec,types}.ts`, `createArtCodec.test.ts` | Moved from `src/` (git renames) so the directory-based extractor has a module directory to read; `createArtCodec.ts` import paths fixed to `../private/`.                                                                                       |
| `libs/codec/src/codec/index.ts`                                            | New barrel — module description (round trip what/when) plus the re-exports; the extraction entry file for the `codec` module.                                                                                                                   |
| `libs/codec/src/index.ts`                                                  | Re-pointed to `./codec/index.js`; package-surface JSDoc.                                                                                                                                                                                        |
| `libs/codec/CHANGELOG.md`                                                  | `0.0.6` entry: extraction + authored copy + dependency pins + source layout.                                                                                                                                                                    |
| `package-lock.json` (root)                                                 | Codec devDependencies (commit 1); `libs/codec` `0.0.6` + new pins, drained all 5 nested `libs/codec/node_modules/*` entries, added `cli/bin` and `tests/codec` registry-reaction entries for their exact `@art-md/codec@0.0.5` pins (commit 2). |

Not staged (verified, gitignored): `libs/codec/dist/meta.json`.

### Commits

| ID              | Hash      | Full hash                                  | Message                                               | Policy                                                     |
| --------------- | --------- | ------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------- |
| `author-codec`  | `3151454` | `31514540ee91569a95e6e69c1a67ace1397df1c6` | `docs(codec): Add extraction and author module copy.` | `NOPUSH` — not pushed (`main` ahead of `origin/main` by 4) |
| `release-codec` | `3d12397` | `3d123974654012a217212a76926c42b063b5f226` | `release(codec): 0.0.6`                               | `NOPUSH` — not pushed                                      |

### Validation

- `npm run ci` from `$ART_MD` — green before each commit and via the pre-commit hook on both commits (12/12 turbo tasks); never used `--no-verify`.
- `dist/meta.json` exists and carries the authored copy — modules 1/1, declared symbols 3/3 (7,769 → 8,831 bytes with authoring).
- `npm pack --dry-run` from `libs/codec` — lists `dist/meta.json` (9.3 kB), 20 files total, package size 303.1 kB, filename `art-md-codec-0.0.6.tgz`.
- `npm ci` (full re-install) in sync with the refreshed lock; `npm ls @art-md/primitives --all` exits 0.
- All `.md` touched formatted with the repo's prettier (`CHANGELOG.md` unchanged by `prettier --write`).

### Lock drain

- Nested copies inside `libs/codec`: **all 5 drained** (`@art-md/constructs@0.0.7`, `@art-md/parser@0.0.6`, `@art-md/primitives@0.0.7`, `@art-md/serializer@0.0.6`, `mdast-util-to-markdown@2.1.0` registry entries removed).
- Nested `@art-md/primitives@0.0.7` locations: **2 → 2**, but the residue moved: was (`cli/bin`, `libs/codec`), now (`cli/bin`, **`tests/codec`**). The delegator's expected end state ("only `cli/bin` left") is off by `tests/codec`: it pins `@art-md/codec: "0.0.5"` exactly, so `0.0.6` no longer satisfies the workspace link and npm falls back to the published `0.0.5` with its old nested deps. Fixing it means bumping `tests/codec`'s pin — another package, out of this iteration's scope, so untouched.
- Every lock hunk is codec-caused: `libs/codec` drain + version/deps; `cli/bin` reaction (pins `@art-md/codec` `0.0.5` and `@art-md/primitives` `0.0.7` exactly); `tests/codec` reaction (pins `@art-md/codec` `0.0.5` exactly). No unrelated resolution changed.

### Authored copy (samples)

- `codec` module — "The codec — one object that runs the Art MD round trip: markdown in, an {@link @art-md/primitives:document#ArtDocument} out, markdown back. Reach for `createArtCodec` when a document must travel both directions with the default construct registries already wired; call {@link @art-md/parser:parse#parse} and {@link @art-md/serializer:serializer#serialize} directly when only one half of the trip is needed, or when each side is configured on its own."
- `createArtCodec` — "Creates an {@link @art-md/primitives:codec#ArtCodec} from an optional partial config — parser and serializer fall back to the default construct registries, and the factory index is built lazily on first lookup."
- `ArtCodecConfig` — "The codec's full configuration — a {@link @art-md/parser:config#ParserConfig}, a {@link @art-md/serializer:config#SerializerConfig}, and the construct factory entries."; `PartialArtCodecConfig` — "A partial codec config; every omitted field falls back to the defaults from `@art-md/constructs`."
- All 4 cross-package links use the full scoped form; targets verified present in the published metas of primitives, parser, and serializer before writing.

### Publish (user gate — NOT executed)

```bash
cd $ART_MD/libs/codec && npm publish   # then: npm view @art-md/codec version  →  0.0.6
```

`publishConfig.access` is already `public`; `dist/` is built and carries `meta.json`. If `dist/` was cleaned in the meantime, run `npm run build && npm run extract` first.

### Uncommitted files

None — `$ART_MD` working tree is clean; this report file is intentionally not committed.

## Blockers (if any)

None.

## Feedback

### For the planner

- **The copied script extracts 0 entities from codec as-shipped.** `createModuleEntityExtractor` is a _directory_ extractor: the root dir is skipped (`!relative` guard) and codec's only subdirectory is `private/` (ignored), so flat `src/*.ts` files are never matched. Verified by running the exact copy first (`entities: 0`). Fix applied, following the constructs barrel precedent (source adjusted so extraction works): moved `createArtCodec.ts`, `types.ts`, and the test into `src/codec/` and added `src/codec/index.ts` as the module entry — this is a source restructure beyond the instruction's literal "copy and run", flagged here for ratification. Nothing else changed about the package's public surface (same exports, `src/index.ts` entry unchanged, `npm run ci` green).
- Codec ends up with a **single module** (`codec`) — the instruction's plural "module descriptions" over-promises for a 3-file facade; the one module description carries the whole round-trip what/when.
- The lock-drain expectation in the instruction ("only `cli/bin` left") needs updating to (`cli/bin`, `tests/codec`) unless `tests/codec`'s exact `@art-md/codec@0.0.5` pin is bumped in a follow-up (it is out of this plan's scope).

### For the technical writers

- All 3 declared symbols reach `dist/meta.json`, so 3/3 authoring is visible end to end; the module↔symbol non-repetition rule is exercised in the other direction too (module says _when_, symbols say _what_).
- `src/index.ts` (package root) is not extracted by the directory extractor — its JSDoc is for editors only, consistent with the other four packages.

### For the crew

- `libs/codec` mirrors `$PARSER`'s extract setup minus `prepack`; only `@art-md/parser` re-runs extract on pack today, so a stale `dist/meta.json` can ship for the other four packages (carried forward from `document-serializer`).
