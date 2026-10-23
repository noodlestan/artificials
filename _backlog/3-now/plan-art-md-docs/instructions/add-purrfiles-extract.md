# Instructions: `add-purrfiles-extract`

**Plan:** `art-md-docs`

**Iteration Id:** `add-purrfiles-extract`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-md-docs/instructions/add-purrfiles-extract__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-purrfiles-extract`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                     | Purpose                  |
| ------------ | --------------------------------- | ------------------------ |
| `$WORKSPACE` | Current working directory         | Workspace root directory |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md`     | Art MD checkout          |
| `$PACKAGE`   | `$ART_MD/cli/purrfiles-extract`   | Package to create        |
| `$ENTITIES`  | `$ART_MD/libs/purrfiles-entities` | Entity model dependency  |
| `$NO_COMPLY` | `$WORKSPACE/checkouts/no-comply`  | Reference implementation |
| `$REFERENCE` | `$NO_COMPLY/cli/meta-extract`     | Module extractor to port |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-purrfiles-extract`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create `@noodlestan/purrfiles-extract` under `$ART_MD/cli/`: a Node/TypeScript package that extracts generic `Module` entities from a source tree. It must consume `@noodlestan/purrfiles-entities`, support directories without `index.ts`, and prove that `$ART_MD/libs/parser/src/parse/` yields Module `parse` with helper `parse`.

## Mandatory Reading

- `$ART_MD/_guide.md` — repository layout, conventions, operating instructions.
- `$ART_MD/libs/parser/_guide.md` — package guide format.
- `$ART_MD/libs/parser/package.json` — package.json, exports, and scripts pattern.
- `$ART_MD/libs/parser/build.config.mjs` — esbuild configuration pattern.
- `$ART_MD/libs/parser/tsconfig.json`, `$ART_MD/libs/parser/tsconfig.build.json` — TypeScript configuration pattern.
- `$ART_MD/libs/parser/vitest.config.ts` — test configuration pattern.
- `$ART_MD/libs/parser/_records/package.art`, `$ART_MD/libs/parser/_records/npm-deployment.art` — record format.
- `$ENTITIES/src/entities/Module/types.ts` — `ModuleEntityFiles`, `ModuleEntityPartial`, `ModuleEntityData`.
- `$ENTITIES/src/entities/Module/createModuleEntityPartial.ts` — partial factory.
- `$REFERENCE/package.json`, `$REFERENCE/build.config.mjs`, `$REFERENCE/tsconfig.json`, `$REFERENCE/tsconfig.build.json`, `$REFERENCE/vitest.config.ts` — package configuration to adapt.
- `$REFERENCE/src/index.ts`, `$REFERENCE/src/entities/index.ts` — export surface.
- `$REFERENCE/src/entities/Module/` — Module matcher, extractor, resolver to port.
- `$REFERENCE/src/utils/` — `findIndexFile`, `findHelperFiles`, `findTypesFile`.
- `$NO_COMPLY/node_modules/@purrception/source-fs/dist/esm/` — `DirectoryExtractContext`, `extractEntitiesFromFileSystem`, `defineDirectoryExtractor` types.
- `$WORKSPACE/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.
- `$WORKSPACE/node_modules/@noodlestan/conventions-unit-tests/art/index.md` — unit test conventions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$ART_MD/_guide.md`)

Run from the `$ART_MD` root:

```bash
npm ci # to install dependencies.
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms that the package is complete, builds, and passes tests.

**Instructions:** (From `$ART_MD/_guide.md` and `$ART_MD/libs/parser/_guide.md`)

Run from `$ENTITIES`:

```bash
npm run build # ensures the dist types consumed by this package exist
```

Run from `$PACKAGE`:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # prettier, eslint, tsc --noEmit
npm run build # produces dist/
npm run test:ci # runs tests with coverage
```

Then run from `$ART_MD`:

```bash
npm run ci # lint, test and build across the monorepo
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

Create the extraction package by porting `$REFERENCE` and adding a same-name module entry fallback for directories without `index.ts`.

- Step 1 / 5 — Scaffold package, configuration, and records
- Step 2 / 5 — Add the Module extractor
- Step 3 / 5 — Add file resolution with same-name fallback
- Step 4 / 5 — Add exports and tests
- Step 5 / 5 — Commit `add-purrfiles-extract`

## Steps

### Step `1 / 5` — Scaffold package, configuration, and records

Create the package at `$PACKAGE` with the same tooling shape as `$ART_MD/libs/parser`.

Preparation:

1. Create the directories `$PACKAGE/_records/`, `$PACKAGE/src/entities/Module/private/`, and `$PACKAGE/src/utils/helpers/`.
2. Copy `$ART_MD/libs/parser/.eslintrc.cjs`, `$ART_MD/libs/parser/.npmignore`, `$ART_MD/libs/parser/.prettierignore`, and `$ART_MD/libs/parser/LICENSE-MIT` into `$PACKAGE/`.

Create `$PACKAGE/package.json`:

```json
{
  "name": "@noodlestan/purrfiles-extract",
  "version": "0.0.1",
  "description": "Purrception extraction tools for TypeScript source trees.",
  "keywords": ["cli", "metadata", "extraction", "purrception", "entities", "typescript"],
  "author": "Noodlestan Collective",
  "license": "MIT",
  "private": false,
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/noodlestan/art-md.git",
    "directory": "cli/purrfiles-extract/"
  },
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  },
  "files": ["dist", "LICENSE-MIT", "README.md"],
  "scripts": {
    "dev": "esbuild-cli-watch",
    "lint": "prettier . -c && eslint . && tsc --noEmit",
    "lint:fix": "prettier . -c --write && eslint . --fix",
    "build": "esbuild-cli",
    "build:clean": "rm -rf dist",
    "test": "vitest run",
    "test:ci": "vitest run --coverage",
    "test:watch": "vitest",
    "ci": "npm run lint && npm run build && npm run test:ci"
  },
  "dependencies": {
    "@noodlestan/purrfiles-entities": "*",
    "@purrception/lang-ts-extract": "^0.1.0",
    "@purrception/primitives": "^0.1.0",
    "@purrception/source-fs": "^0.1.0"
  },
  "devDependencies": {
    "vitest": "4.1.8"
  }
}
```

Create `$PACKAGE/build.config.mjs`:

```js
import { readFileSync } from 'node:fs';

import { postBuildPlugin } from '@noodlestan/esbuild/plugins';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

export default {
  common: {
    bundle: true,
    tsconfig: 'tsconfig.build.json',
    entryPoints: ['src/index.ts'],
    external: [
      '@noodlestan/purrfiles-entities',
      '@purrception/lang-ts-extract',
      '@purrception/primitives',
      '@purrception/source-fs',
    ],
    define: { __BUILD_VERSION__: JSON.stringify(version) },
  },
  esm: {
    plugins: [
      postBuildPlugin({
        command: 'tsc',
        args: ['--project', 'tsconfig.build.json', '--emitDeclarationOnly'],
        target: 'esm',
      }),
    ],
  },
};
```

Create `$PACKAGE/tsconfig.json`:

```json
{
  "extends": "@noodlestan/tsconfig/esbuild/tsconfig.json",
  "compilerOptions": {
    "noPropertyAccessFromIndexSignature": false,
    "noUncheckedIndexedAccess": false
  },
  "include": ["src/", "**/*.config.ts"],
  "exclude": ["**/node_modules/", "**/dist/", "**/coverage/"]
}
```

Create `$PACKAGE/tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": "src/",
    "outDir": "dist/"
  },
  "include": ["src/"],
  "exclude": ["**/*.test.ts"]
}
```

Create `$PACKAGE/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      exclude: ['src/index.ts'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 70,
        statements: 90,
      },
    },
  },
});
```

Create `$PACKAGE/_records/package.art`:

```art
# Module

## Package: Purrfiles Extract

**Purpose:** Purrception extraction tools for TypeScript source trees.

**Description:** Generic module entity extraction built on @purrception and @noodlestan/purrfiles-entities.

**Owner:** Project: Noodlestan Purrception

**Author:** Noodlestan Collective

**Path:** `cli/purrfiles-extract/`

**Canonical Name:** `@noodlestan/purrfiles-extract`

**Published:** `false`

**Private:** `false`

**Keywords:**

- cli
- metadata
- extraction
- purrception
- entities
- typescript

**Deployment:** NPM Package Deployment: Purrfiles Extract

**Files:**

- `dist`
- `LICENSE-MIT`
- `README.md`

**Language:** Typescript

**Engines:**

- Node: `>= 22`

**PackageManager:** `npm@10.2.3`

**PackageFile:** `package.json`

**Dependencies:**

- Runtime:
  - `@noodlestan/purrfiles-entities`
  - `@purrception/lang-ts-extract` @ `^0.1.0`
  - `@purrception/primitives` @ `^0.1.0`
  - `@purrception/source-fs` @ `^0.1.0`

**License:** License: Noodlestan 2026 MIT
```

Create `$PACKAGE/_records/npm-deployment.art`:

```art
# Module

## NPM Package Deployment: Purrfiles Extract

**Owner:** Package: Purrfiles Extract

**Status:** `PLANNED`

**Build:** Deployment Build: NPM Command

**Deploy:** Deployment Command: NPM Package CLI

**Canonical Name:** `@noodlestan/purrfiles-extract`

**Registry:** `https://registry.npmjs.org`

**Access:** `public`
```

Create `$PACKAGE/_guide.md` with the package purpose, layout (`_records/`, `src/`), records management, conventions link to `$ART_MD/_guide.md`, and operating instructions for Setting Up and Verifying Step (same commands as the parser guide). Create `$PACKAGE/README.md` with the package name, purpose, public API summary, and a minimal extraction example.

Finally, run from `$ART_MD`:

```bash
npm install # registers the new workspace and links @noodlestan/purrfiles-extract
```

Expected outcome: `$PACKAGE` exists, is listed as a workspace, and `node_modules/@noodlestan/purrfiles-extract` resolves to it.

### Step `2 / 5` — Add the Module extractor

Port `$REFERENCE/src/entities/Module/` to `$PACKAGE/src/entities/Module/`:

- `createModuleEntityExtractor.ts`
- `private/index.ts`
- `private/entityMatcher.ts`
- `private/entityExtractor.ts`
- `private/fileResolver.ts`

Replace every `@no-comply/meta` import with `@noodlestan/purrfiles-entities`. Keep the factory signature and behaviour:

```ts
import type {
  ModuleEntityData,
  ModuleEntityFiles,
  ModuleEntityPartial,
} from '@noodlestan/purrfiles-entities';
import { type DirectoryExtractorFactory, defineDirectoryExtractor } from '@purrception/source-fs';

import { entityExtractor, entityMatcher, fileResolver } from './private/index.js';

export const createModuleEntityExtractor: DirectoryExtractorFactory<
  ModuleEntityPartial,
  ModuleEntityFiles,
  ModuleEntityData
> = (options = {}) => {
  return defineDirectoryExtractor({
    match: options.matcher ?? entityMatcher,
    resolve: options.resolver ?? fileResolver,
    extract: entityExtractor,
    skipSubDirs: false,
  });
};
```

`entityMatcher` must keep the module matcher `ctx.dirMeta.relative.match(/^([^/]+)$/)`, read `ctx.fsContext.meta['package']`, and build the partial with `createEntityPartial('module', name, packageName)` and `createModuleEntityPartial(partial, ctx.dirMeta.path)`.

`entityExtractor` must keep the same flow: `createEntityExtractContext`, `createProgramFilesContext`, `createProgram`, `extractDocs(files.index)`, `extractFunctions(files.helpers)`, `extractTypes(files.types)`, `extractImportedSymbols`, `indexDeclaredSymbols`, and return the entity with `helpers` and `symbols`.

Create `$PACKAGE/src/entities/Module/index.ts` exporting `createModuleEntityExtractor.js`.

### Step `3 / 5` — Add file resolution with same-name fallback

Create `$PACKAGE/src/utils/helpers/findIndexFile.ts` (same as reference):

```ts
import type { DirectoryExtractContext } from '@purrception/source-fs';

export function findIndexFile(ctx: DirectoryExtractContext): string | undefined {
  return ctx.dirMeta.files.find(f => f.startsWith('index'));
}
```

Create `$PACKAGE/src/utils/helpers/findTypesFile.ts` (same as reference):

```ts
import type { DirectoryExtractContext } from '@purrception/source-fs';

export function findTypesFile(ctx: DirectoryExtractContext): string | undefined {
  return ctx.dirMeta.files.find(f => f === 'types.ts');
}
```

Create `$PACKAGE/src/utils/helpers/findModuleEntryFile.ts`:

```ts
import path from 'node:path';

import type { DirectoryExtractContext } from '@purrception/source-fs';

const NON_ENTRY = ['index.ts', 'types.ts', 'constants.ts'];

export function findModuleEntryFile(ctx: DirectoryExtractContext): string | undefined {
  const dirName = path.basename(ctx.dirMeta.path);

  return ctx.dirMeta.files.find(file => {
    if (file.includes('/') || file.includes('\\')) {
      return false;
    }
    if (file.endsWith('.test.ts')) {
      return false;
    }
    if (NON_ENTRY.includes(file)) {
      return false;
    }
    return file.replace(/\.tsx?$/, '') === dirName;
  });
}
```

Create `$PACKAGE/src/utils/helpers/findHelperFiles.ts`:

```ts
import path from 'node:path';

import type { DirectoryExtractContext } from '@purrception/source-fs';

import { findIndexFile } from './findIndexFile.js';
import { findModuleEntryFile } from './findModuleEntryFile.js';

const NON_HELPER = ['index.ts', 'types.ts', 'constants.ts'];

export async function findHelperFiles(ctx: DirectoryExtractContext): Promise<string[]> {
  const files: string[] = [];

  if (ctx.hasDir('helpers')) {
    const helperFiles = (await ctx.readDir('helpers')).files.filter(f => !NON_HELPER.includes(f));
    files.push(...helperFiles.map(f => path.join('helpers', f)));
  }

  if (!findIndexFile(ctx)) {
    const entry = findModuleEntryFile(ctx);
    if (entry && !files.includes(entry)) {
      files.push(entry);
    }
  }

  return files;
}
```

Create `$PACKAGE/src/utils/helpers/index.ts` exporting `findHelperFiles.js`, `findIndexFile.js`, `findModuleEntryFile.js`, `findTypesFile.js`. Create `$PACKAGE/src/utils/index.ts` exporting `./helpers/index.js`.

Update `$PACKAGE/src/entities/Module/private/fileResolver.ts` to prefer `index.ts` and fall back to the same-name entry:

```ts
import type { ModuleEntityFiles, ModuleEntityPartial } from '@noodlestan/purrfiles-entities';
import type { EntityFileResolver } from '@purrception/source-fs';

import {
  findHelperFiles,
  findIndexFile,
  findModuleEntryFile,
  findTypesFile,
} from '../../../utils/index.js';

export const fileResolver: EntityFileResolver<
  ModuleEntityPartial,
  ModuleEntityFiles
> = async ctx => {
  const index = findIndexFile(ctx) ?? findModuleEntryFile(ctx);
  const types = findTypesFile(ctx);
  const helpers = await findHelperFiles(ctx);

  if (!index) {
    return;
  }

  return {
    index,
    types,
    helpers,
  };
};
```

Expected outcome: `src/parse/` resolves `parse.ts` as both entry and helper even though it has no `index.ts`.

### Step `4 / 5` — Add exports and tests

Create `$PACKAGE/src/entities/index.ts`:

```ts
export * from './Module/index.js';
```

Create `$PACKAGE/src/index.ts`:

```ts
export * from './entities/index.js';
export * from './utils/index.js';
```

Add `$PACKAGE/src/entities/Module/private/fileResolver.test.ts` with a mocked context:

```ts
import type { DirectoryExtractContext } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import { fileResolver } from './fileResolver.js';

const ctx = {
  dirMeta: {
    path: '/repo/src/parse',
    relative: 'parse',
    files: ['parse.ts', 'parse.test.ts', 'types.ts'],
    dirs: [],
  },
  hasDir: () => false,
} as unknown as DirectoryExtractContext;

describe('fileResolver', () => {
  it('WHEN the directory has no index file THEN uses the same-name file as entry and helper', async () => {
    const files = await fileResolver(ctx, {
      type: 'module',
      name: 'parse',
      package: '@art-md/parser',
      module: undefined,
      path: '/repo/src/parse',
    });

    expect(files).toEqual({
      index: 'parse.ts',
      types: 'types.ts',
      helpers: ['parse.ts'],
    });
  });
});
```

Add `$PACKAGE/src/createModuleEntityExtractor.test.ts` to prove the real parser source extracts Module `parse`:

```ts
import type { ModuleEntityData } from '@noodlestan/purrfiles-entities';
import { extractEntitiesFromFileSystem } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import { createModuleEntityExtractor } from './entities/index.js';

describe('createModuleEntityExtractor', () => {
  it('WHEN extracting the parser source THEN yields Module parse with helper parse', async () => {
    const extracted = await extractEntitiesFromFileSystem({
      rootDir: '../../libs/parser/src/',
      extractors: [createModuleEntityExtractor()],
      meta: { package: '@art-md/parser' },
    });

    const entities = extracted.map(({ entity }) => entity as ModuleEntityData);
    const parse = entities.find(entity => entity.name === 'parse');

    expect(parse).toBeDefined();
    expect(parse?.type).toBe('module');
    expect(parse?.helpers).toContain('parse');
    expect(parse?.symbols.declared).toHaveProperty('parse');
  });
});
```

Adjust the test path if the package test working directory differs; it MUST resolve to `$ART_MD/libs/parser/src/`.

Expected outcome: `npm run test:ci` passes and coverage meets the configured thresholds.

### Step `5 / 5` — Commit `add-purrfiles-extract`

---

#### Commit: `add-purrfiles-extract`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(purrfiles-extract): Add generic module entity extractor.
```

---

## Final Verification

**Instructions:**

- Verify that `$PACKAGE` has `package.json`, `build.config.mjs`, `tsconfig.json`, `tsconfig.build.json`, `vitest.config.ts`, `_guide.md`, `README.md`, and both records.
- Verify that `$PACKAGE/src/index.ts` exports `createModuleEntityExtractor` and the resolver utilities.
- Verify that `fileResolver` prefers `index.ts` and falls back to a same-name entry, and that the entry is included in helpers only in the fallback case.
- Verify that the extraction test resolves Module `parse` with helper `parse` from `$ART_MD/libs/parser/src/parse/`.
- Verify that commits have been executed and not pushed, according to the commit policy.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
