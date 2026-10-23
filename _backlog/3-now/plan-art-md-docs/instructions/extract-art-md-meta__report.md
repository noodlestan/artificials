# Sub-Agent REPORT (#producer)

**Plan:** `art-md-docs`

**Iteration Id:** `extract-art-md-meta`

**Outcome:** `BLOCKER`

## Evidence

### Changes

| Goal                                                     | Outcome                                                                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Wire the extractor into `@art-md/parser`                 | `$PACKAGE/scripts/extract.ts` added and runs the module extractor over `src/`.                              |
| Produce the first real `dist/meta.json`                  | Generated successfully; contains Module `parse` with `helpers` including `parse`.                           |
| Run the root `extract` script through package extraction | `$ART_MD` delegates to workspaces; extraction succeeds when dependency `dist/` output exists.               |
| Verify the monorepo                                      | Package lint/build/test:ci and root `ci` all pass; blocked only by the repository pre-commit hook sequence. |

#### Files changed

- `$PACKAGE/scripts/extract.ts` — New extraction entry point: runs `createModuleEntityExtractor` over `src/` and writes `{ entities }` to `dist/meta.json`.
- `$PACKAGE/package.json` — Added `extract` script after `test:watch`; added `@noodlestan/purrfiles-extract`, `@purrception/lang-ts-extract`, `@purrception/source-fs`, and `tsx` dev dependencies.
- `$PACKAGE/tsconfig.json` — Added `scripts/` to `include`.
- `$ART_MD/package.json` — Replaced the placeholder `extract` script with `npm run extract --workspaces --if-present`.
- `$ART_MD/package-lock.json` — Recorded the new parser workspace dependencies.

### Verification

| Command                                                               | Result                                                                              |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `npx turbo run build --filter=@noodlestan/purrfiles-extract`          | Passed; built `@noodlestan/purrfiles-entities` and `@noodlestan/purrfiles-extract`. |
| `npm run extract` from `$ART_MD` (with dependency `dist/`)            | Passed; wrote 5 entities to `$PACKAGE/dist/meta.json`.                              |
| Module `parse` assertion                                              | Passed; Module `parse` present with 3 helper entries including `parse`.             |
| `npm run lint:fix`, `npm run lint` from `$PACKAGE`                    | Passed (prettier, eslint, `tsc --noEmit`).                                          |
| `npm run build` from `$PACKAGE`                                       | Passed.                                                                             |
| `npm run test:ci` from `$PACKAGE`                                     | Passed; 6 files / 19 tests; 100% coverage.                                          |
| `npm run ci` from `$ART_MD`                                           | Passed; 9 turbo tasks successful, including codec fixture tests.                    |
| `git commit -m "build(parser): Add purrception metadata extraction."` | **Failed in pre-commit hook** at `1-extract`.                                       |

## Blockers (if any)

**Commit is blocked by the repository pre-commit hook.**

`lefthook.yml` runs, in order, `0-clean` (`npm run clean`), `1-extract` (`npm run extract`), and `2-ci` (`npm run ci`).

- `0-clean` runs `turbo run build:clean`, which removes every package `dist/`, including `node_modules/@noodlestan/purrfiles-extract/dist`.
- `1-extract` then runs the new root `extract` script before any package is rebuilt, so `tsx` cannot resolve the extracted package entry point:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'$ART_MD/node_modules/@noodlestan/purrfiles-extract/dist/index.mjs'
imported from '$PACKAGE/scripts/extract.ts'
```

- Reproduced deterministically: `npm run clean` followed by `npm run extract` fails with the same error. Running the build first makes `npm run extract` pass.

The instruction prescribes the exact root script `"extract": "npm run extract --workspaces --if-present"` and forbids adding an `extract` task to `turbo.json`, so the hook cannot be satisfied without either:

1. Building the extractor dependencies before extraction (e.g. a root `preextract`/`extract` build step, or turbo guidance), or
2. Changing the `lefthook.yml` command order so `1-extract` runs after a build.

Both options fall outside the declared iteration scope, and the worker contract forbids `--no-verify` and out-of-scope edits. Work is staged but **not committed**; commit policy was `NOPUSH`, so nothing was pushed.

### Secondary finding

`## Verifying Completion` instructs `npm run build` from `$ART_MD`, but the root package has no `build` script. The equivalent `npx turbo run build --filter=@noodlestan/purrfiles-extract` was used instead.

## Feedback

### For the planner

- The iteration's root `extract` script conflicts with the repository pre-commit hook: `0-clean` deletes the extractor `dist/` that extraction imports. Plan for extraction to build its dependencies (or for the hook to build before extracting).
- The root `build` command referenced in `## Verifying Completion` does not exist; specify the turbo command or add a root `build` script.

### For the technical writers

- `$NO_COMPLY` is used under `## Mandatory Reading` but is not declared in the instruction's `## Path Variables` table; it resolves to `$WORKSPACE/checkouts/no-comply`.
- The instruction's `$WORKSPACE/node_modules/@noodlestan/conventions-*` paths do not exist; the packages are installed under `$ART_MD/node_modules/`.

### For the crew

- Formatting and test gates pass; only the pre-commit orchestration needs correction to unblock the commit.
