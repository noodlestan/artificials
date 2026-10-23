# Instructions: `add-purrfiles-entities`

**Plan:** `art-md-docs`

**Iteration Id:** `add-purrfiles-entities`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-md-docs/instructions/add-purrfiles-entities__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-purrfiles-entities`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                     | Purpose                          |
| ------------ | --------------------------------- | -------------------------------- |
| `$WORKSPACE` | Current working directory         | Workspace root directory         |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md`     | Art MD checkout                  |
| `$PACKAGE`   | `$ART_MD/libs/purrfiles-entities` | Package to create                |
| `$NO_COMPLY` | `$WORKSPACE/checkouts/no-comply`  | Reference implementation         |
| `$REFERENCE` | `$NO_COMPLY/libs/meta`            | Entity model and service to port |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-purrfiles-entities`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create `@noodlestan/purrfiles-entities` under `$ART_MD/libs/`: a browser-safe package that exports the generic purrception entity model, the `Module` entity type, entity helpers, and a framework-agnostic meta service. The package must not import `solid-js`, `typescript`, `node:fs`, or any extractor package.

## Mandatory Reading

- `$ART_MD/_guide.md` — repository layout, conventions, operating instructions.
- `$ART_MD/libs/parser/_guide.md` — package guide format.
- `$ART_MD/libs/parser/package.json` — package.json, exports, and scripts pattern.
- `$ART_MD/libs/parser/build.config.mjs` — esbuild configuration pattern.
- `$ART_MD/libs/parser/tsconfig.json`, `$ART_MD/libs/parser/tsconfig.build.json` — TypeScript configuration pattern.
- `$ART_MD/libs/parser/vitest.config.ts` — test configuration pattern.
- `$ART_MD/libs/parser/_records/package.art`, `$ART_MD/libs/parser/_records/npm-deployment.art` — record format.
- `$REFERENCE/package.json`, `$REFERENCE/build.config.mjs`, `$REFERENCE/tsconfig.json`, `$REFERENCE/tsconfig.build.json`, `$REFERENCE/vitest.config.ts` — package configuration to adapt.
- `$REFERENCE/src/index.ts`, `$REFERENCE/src/types.ts`, `$REFERENCE/src/constants.ts` — public exports, service types, entity type list.
- `$REFERENCE/src/createNoComplyMetaService.ts` — service to port.
- `$REFERENCE/src/entities/types.ts`, `$REFERENCE/src/entities/index.ts` — generic entity types and export surface.
- `$REFERENCE/src/entities/Module/` — the `Module` entity type to port.
- `$REFERENCE/src/entities/helpers/` — `getEntityTypes` and `getEntityFunctions`.
- `$REFERENCE/src/private/index.ts`, `$REFERENCE/src/private/types.ts`, `$REFERENCE/src/private/indexEntities.ts`, `$REFERENCE/src/private/resolveEntityExpressionParts.ts` — indexing and expression parsing.
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

Create the browser-safe entities package by porting and generalising `$REFERENCE`. The package exposes generic entity data, the `Module` entity type, entity helpers, and a meta service.

- Step 1 / 6 — Scaffold package, configuration, and records
- Step 2 / 6 — Add entity types and helpers
- Step 3 / 6 — Add indexing and expression resolution
- Step 4 / 6 — Add the meta service
- Step 5 / 6 — Add exports and unit tests
- Step 6 / 6 — Commit `add-purrfiles-entities`

## Steps

### Step `1 / 6` — Scaffold package, configuration, and records

Create the package at `$PACKAGE` with the same tooling shape as `$ART_MD/libs/parser`.

Preparation:

1. Create the directories `$PACKAGE/_records/`, `$PACKAGE/src/entities/helpers/`, and `$PACKAGE/src/private/`.
2. Copy `$ART_MD/libs/parser/.eslintrc.cjs`, `$ART_MD/libs/parser/.npmignore`, `$ART_MD/libs/parser/.prettierignore`, and `$ART_MD/libs/parser/LICENSE-MIT` into `$PACKAGE/`.

Create `$PACKAGE/package.json`:

```json
{
  "name": "@noodlestan/purrfiles-entities",
  "version": "0.0.1",
  "description": "Purrception entity types and a framework-agnostic meta service.",
  "keywords": ["library", "metadata", "purrception", "entities", "typescript"],
  "author": "Noodlestan Collective",
  "license": "MIT",
  "private": false,
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/noodlestan/art-md.git",
    "directory": "libs/purrfiles-entities/"
  },
  "type": "module",
  "sideEffects": false,
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
    "@purrception/lang-ts": "^0.1.0",
    "@purrception/primitives": "^0.1.0"
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
    external: ['@purrception/lang-ts', '@purrception/primitives'],
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

## Package: Purrfiles Entities

**Purpose:** Purrception entity types and a framework-agnostic meta service.

**Description:** Browser-safe entity model and query service shared by docs consumers.

**Owner:** Project: Noodlestan Purrception

**Author:** Noodlestan Collective

**Path:** `libs/purrfiles-entities/`

**Canonical Name:** `@noodlestan/purrfiles-entities`

**Published:** `false`

**Private:** `false`

**Keywords:**

- library
- metadata
- purrception
- entities
- typescript

**Deployment:** NPM Package Deployment: Purrfiles Entities

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
  - `@purrception/lang-ts` @ `^0.1.0`
  - `@purrception/primitives` @ `^0.1.0`

**License:** License: Noodlestan 2026 MIT
```

Create `$PACKAGE/_records/npm-deployment.art`:

```art
# Module

## NPM Package Deployment: Purrfiles Entities

**Owner:** Package: Purrfiles Entities

**Status:** `PLANNED`

**Build:** Deployment Build: NPM Command

**Deploy:** Deployment Command: NPM Package CLI

**Canonical Name:** `@noodlestan/purrfiles-entities`

**Registry:** `https://registry.npmjs.org`

**Access:** `public`
```

Create `$PACKAGE/_guide.md` with: package purpose, layout (`_records/`, `src/`), records management, conventions link to `$ART_MD/_guide.md`, and operating instructions for Setting Up and Verifying Step (same commands as the parser guide). Create `$PACKAGE/README.md` with the package name, purpose, public API summary, and a minimal usage example for `createMetaService`.

Finally, run from `$ART_MD`:

```bash
npm install # registers the new workspace and links @noodlestan/purrfiles-entities
```

Expected outcome: `$PACKAGE` exists, is listed as a workspace, and `node_modules/@noodlestan/purrfiles-entities` resolves to it.

### Step `2 / 6` — Add entity types and helpers

Create `$PACKAGE/src/entities/types.ts`:

```ts
import type { EntityDataBase, EntityDataBasePartial } from '@purrception/primitives';

export type PurrfilesEntityPartial<T extends string = string> = EntityDataBasePartial<T> & {
  module: string | undefined;
  path: string;
};

export type PurrfilesEntityData = EntityDataBase & PurrfilesEntityPartial;
```

Create the `Module` entity type by porting `$REFERENCE/src/entities/Module/` with these renames:

- `NoComplyEntityPartial` → `PurrfilesEntityPartial`
- `NoComplyEntityData` → `PurrfilesEntityData`
- Keep `ModuleEntityFiles`, `ModuleEntityPartial`, `ModuleEntityData`, and `createModuleEntityPartial` unchanged in behaviour.

Create `$PACKAGE/src/entities/Module/index.ts` exporting `createModuleEntityPartial.js`, `./types.js`.

Port `$REFERENCE/src/entities/helpers/getEntityTypes.ts` and `getEntityFunctions.ts`. Replace `NoComplyEntityData` with `PurrfilesEntityData`; keep the `Filter` behaviour and JSDoc types.

Create `$PACKAGE/src/entities/helpers/index.ts` exporting both helpers.

Create `$PACKAGE/src/entities/index.ts`:

```ts
export * from './helpers/index.js';
export * from './Module/index.js';
export * from './types.js';
```

Create `$PACKAGE/src/constants.ts`:

```ts
export const ENTITY_TYPES: string[] = ['module'];
```

Expected outcome: the entity model exposes `PurrfilesEntityData` with `symbols.declared` carrying both type and function declarations, and the `Module` type with `helpers`.

### Step `3 / 6` — Add indexing and expression resolution

Create `$PACKAGE/src/private/types.ts`:

```ts
export type ResolvedExpression = {
  pkg?: string;
  type?: string;
  name: string;
};
```

Port `$REFERENCE/src/private/indexEntities.ts` unchanged, replacing `NoComplyEntityData` with `PurrfilesEntityData`.

Port `$REFERENCE/src/private/resolveEntityExpressionParts.ts` unchanged. It imports `ENTITY_TYPES` from `../constants.js`; keep that path.

Create `$PACKAGE/src/private/index.ts`:

```ts
export * from './indexEntities.js';
export * from './resolveEntityExpressionParts.js';
export * from './types.js';
```

Do NOT port the search implementation (`buildSearchEntityRecords`, `searchEntityRecords`, `private/private/*`), symbol-import resolution (`matchEntityByImport`, `resolveSymbolImport`), or search constants. Search is out of scope for v1.

### Step `4 / 6` — Add the meta service

Create `$PACKAGE/src/types.ts`:

```ts
import type { ModuleEntityData, PurrfilesEntityData } from './entities/index.js';

export type PurrfilesMetaOptions = {
  makeEntityHref?: (entity: PurrfilesEntityData, symbol?: string) => string;
};

export type PurrfilesMetaAPI = {
  getEntities(): PurrfilesEntityData[];
  getEntityMaybe<T extends PurrfilesEntityData>(
    pkg: string,
    type: string,
    name: string,
  ): T | undefined;
  getEntity<T extends PurrfilesEntityData>(pkg: string, type: string, name: string): T;
  getPackageNames(): string[];
  hasPackage(pkg: string): boolean;
  getPackageModuleNames(pkg: string): string[];
  packageHasModule(pkg: string, mod: string): boolean;
  getModuleMaybe(pkg: string, mod: string): ModuleEntityData | undefined;
  getModuleEntities(pkg: string, mod: string): PurrfilesEntityData[];
  resolveEntityExpression(expression: string): PurrfilesEntityData | undefined;
  resolveLink(text: string): [displayName: string, href: string] | undefined;
};
```

Port `$REFERENCE/src/createNoComplyMetaService.ts` to `$PACKAGE/src/createMetaService.ts` with these changes:

- Rename `createNoComplyMetaService` → `createMetaService`.
- Replace `NoComplyEntityData` → `PurrfilesEntityData`.
- Remove `searchEntities` and the `searchRecords` setup.
- Remove `resolveSymbolEntity` and its imports.
- Remove `getModuleSubModuleNames`.
- Keep `getEntities`, `getEntityMaybe`, `getEntity`, `getPackageNames`, `hasPackage`, `getPackageModuleNames`, `packageHasModule`, `getModuleMaybe`, `getModuleEntities`, `resolveEntityExpression`, and `resolveLink`.
- Keep `matchExpression` and the `resolveLink` behaviour exactly as in the reference.

Expected outcome: `createMetaService(entities, options?)` returns an object that satisfies `PurrfilesMetaAPI`.

### Step `5 / 6` — Add exports and unit tests

Create `$PACKAGE/src/index.ts`:

```ts
export * from './createMetaService.js';
export * from './entities/index.js';
export * from './types.js';
```

Add `$PACKAGE/src/createMetaService.test.ts` with a fixture helper that builds `ModuleEntityData` values:

```ts
const entity = (overrides: Partial<ModuleEntityData> = {}): ModuleEntityData => ({
  type: 'module',
  name: 'parse',
  package: '@art-md/parser',
  module: undefined,
  path: 'src/parse',
  helpers: ['parse'],
  symbols: { imported: {}, declared: {} },
  ...overrides,
});
```

Cover:

- `getPackageNames()` returns unique package names.
- `hasPackage()` and `getPackageModuleNames()`.
- `getModuleMaybe()` returns the `parse` module and `undefined` for unknown modules.
- `getModuleEntities('@art-md/parser', 'parse')` returns entities whose `module` is `parse`, including the module itself when `module` matches.
- `getEntityMaybe()` and `getEntity()` (including the thrown error message for unknown entities).
- `resolveEntityExpression('@art-md/parser:module:parse')` and `resolveLink()` with and without `makeEntityHref`.

Add `$PACKAGE/src/entities/helpers/getEntityTypes.test.ts` and `getEntityFunctions.test.ts` with declared symbols shaped as:

```ts
const declared = {
  ParserConfig: {
    at: 'src/config/types.ts',
    lang: '@purrception/lang-ts',
    name: 'ParserConfig',
    private: false,
    kind: 'type',
    node: {},
  },
  parse: {
    at: 'src/parse/parse.ts',
    lang: '@purrception/lang-ts',
    name: 'parse',
    private: false,
    kind: 'function',
    node: {},
  },
} as unknown as PurrfilesEntityData['symbols']['declared'];
```

Assert that `getEntityTypes` returns only `kind: 'type'` entries and `getEntityFunctions` returns only `kind: 'function'` entries, including the array and predicate filters.

Expected outcome: `npm run test:ci` passes and coverage meets the configured thresholds.

### Step `6 / 6` — Commit `add-purrfiles-entities`

---

#### Commit: `add-purrfiles-entities`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(purrfiles-entities): Add generic entity model and meta service.
```

---

## Final Verification

**Instructions:**

- Verify that `$PACKAGE` has `package.json`, `build.config.mjs`, `tsconfig.json`, `tsconfig.build.json`, `vitest.config.ts`, `_guide.md`, `README.md`, and both records.
- Verify that `$PACKAGE/src/index.ts` exports the service, entity types, `Module` type, and entity helpers.
- Verify that no file under `$PACKAGE/src/` imports `solid-js`, `typescript`, `node:fs`, or `@purrception/*-extract`.
- Verify that `npm run build` emits `dist/index.mjs` and `dist/index.d.ts`.
- Verify that commits have been executed and not pushed, according to the commit policy.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
