# Instructions: `create-docs-collections`

**Plan:** `art-md-docs`

**Iteration Id:** `create-docs-collections`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-md-docs/instructions/create-docs-collections__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `create-docs-collections`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                        | Purpose                          |
| -------------- | ------------------------------------ | -------------------------------- |
| `$WORKSPACE`   | Current working directory            | Workspace root directory         |
| `$ARTIFICIALS` | `$WORKSPACE/checkouts/artificials`   | Website monorepo to install into |
| `$ART_MD`      | `$WORKSPACE/checkouts/art-md`        | Extraction monorepo              |
| `$ART_MD_WEB`  | `$ARTIFICIALS/apps/art-md-web`       | Astro application to modify      |
| `$ENTITIES`    | `$ART_MD/libs/purrfiles-entities`    | Meta service dependency          |
| `$META`        | `$ART_MD/libs/parser/dist/meta.json` | Extracted metadata source        |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `create-docs-collections`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Load `$META` into the Astro content layer as two collections — `entities` and `packages` — so later iterations can generate static docs pages from them. This iteration ships no pages.

The `entities` collection holds one entry per extracted entity, identified as `{package}/{type}/{name}`. The `packages` collection holds one entry per package, reduced through `createMetaService`, identified by the package name.

## Mandatory Reading

- `$ART_MD_WEB/_guide.md` — package overview, layout, and verification commands.
- `$ART_MD_WEB/package.json` — scripts and dependencies to update.
- `$ART_MD_WEB/astro.config.mjs`, `$ART_MD_WEB/tsconfig.json` — Astro configuration and type-checking scope.
- `$ART_MD_WEB/src/constants.ts` — site constants; do not duplicate repository URLs.
- `$ART_MD_WEB/src/layouts/PageLayout.astro` — page shell, for later iterations only.
- `$ENTITIES/package.json` — exports, build output paths (`dist/index.mjs`, `dist/index.d.ts`).
- `$ENTITIES/src/index.ts`, `$ENTITIES/src/types.ts`, `$ENTITIES/src/createMetaService.ts` — meta service API.
- `$ENTITIES/src/entities/types.ts`, `$ENTITIES/src/entities/Module/types.ts` — entity data shapes.
- `$META` — extracted metadata; run `npm run extract` from `$ART_MD` first if the file is missing or stale.
- `$ARTIFICIALS/node_modules/astro/dist/content/config.d.ts` — `defineCollection` and the accepted loader forms.
- `$ARTIFICIALS/node_modules/astro/dist/content/loaders/types.d.ts` — `Loader` contract.
- `$WORKSPACE/checkouts/management/_ops/packages/policy.md` — dependency pinning model; read the exception notice in Step 1.
- `$ARTIFICIALS/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$ART_MD_WEB/_guide.md`)

Run from `$ART_MD` — the canonical check, which builds `$ENTITIES/dist/` and produces `$META` (the website links the package's build output, and turbo runs `extract` after `build`):

```bash
npm run ci
```

Run from `$ARTIFICIALS`:

```bash
npm ci
```

Note: `$ART_MD` has no root `build` script; `npm run ci` is the entry point that builds every package via turbo (`^ci` → `build`) and then runs `extract`.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms the content layer loads both collections and the site still builds.

**Instructions:** (From `$ART_MD_WEB/_guide.md` and `$ART_MD_WEB/package.json`)

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # prettier check
npx astro sync # regenerates .astro/types.d.ts from the collections
npm run build # runs extract, then a full static build
```

All steps MUST pass. The build MUST NOT warn about missing collection schemas.

---

## Changes

Wire the synced metadata into the Astro content layer and expose route helpers for the next iterations.

- Step 1 / 6 — Add the `@noodlestan/purrfiles-entities` dependency
- Step 2 / 6 — Sync `meta.json` into the website
- Step 3 / 6 — Add the `entities` collection
- Step 4 / 6 — Add the `packages` collection
- Step 5 / 6 — Add route helpers
- Step 6 / 6 — Commit `create-docs-collections`

## Steps

### Step `1 / 6` — Add the `@noodlestan/purrfiles-entities` dependency

The app runs from a different repository than `$ENTITIES`, so npm workspaces cannot resolve it by name. Link the package from its checkout. This is an explicit, temporary exception to the exact-version rule in `_ops/packages/policy.md`; both purrfiles packages move to the `noodlestan/purrfiles` repository later.

In `$ART_MD_WEB/package.json`, add to `dependencies`, keeping keys sorted:

```json
"@noodlestan/purrfiles-entities": "file:../../../art-md/libs/purrfiles-entities"
```

Do not change any other dependency or range in this manifest.

Run from `$ARTIFICIALS`:

```bash
npm install
```

Verify the link resolves, from `$ART_MD_WEB`:

```bash
npx tsx -e "import('@noodlestan/purrfiles-entities').then(m => console.log(typeof m.createMetaService))"
```

Expected outcome: the command prints `function` and exits `0`.

The linked package externalises its `@purrception/*` dependencies, which publish TypeScript source; plain `node` cannot import them, so the check runs through a bundler-aware runner (`tsx`), the same way Astro's Vite build resolves them. Only the presence of `createMetaService` matters — the full export list is not fixed here.

If the check fails, confirm `$ENTITIES/dist/index.mjs` exists (Setting Up) and that `npm install` from `$ARTIFICIALS` completed, then REPORT A BLOCKER.

### Step `2 / 6` — Sync `meta.json` into the website

Create `$ART_MD_WEB/scripts/sync-meta.mjs`:

```js
import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const source = path.resolve(appRoot, '../../../art-md/libs/parser/dist/meta.json');
const target = path.resolve(appRoot, 'src/data/meta.json');

await mkdir(path.dirname(target), { recursive: true });
await copyFile(source, target);

const { size } = await stat(target);
console.info(`Synced: ${target} (${size} bytes)`);
```

Update the `scripts` block in `$ART_MD_WEB/package.json`:

```json
"dev": "npm run extract && astro dev",
"extract": "node scripts/sync-meta.mjs",
"build": "npm run extract && astro build",
```

Keep the remaining scripts unchanged. `ci` already runs `build`, so it syncs first.

Add the generated file to `$ARTIFICIALS/.gitignore`, after the existing `**/dist` entry:

```text
apps/art-md-web/src/data/meta.json
```

Run from `$ART_MD_WEB`:

```bash
npm run extract
```

Expected outcome: `$ART_MD_WEB/src/data/meta.json` exists, matches `$META`, and `git status` does not list it.

### Step `3 / 6` — Add the `entities` collection

Create `$ART_MD_WEB/src/content.config.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineCollection, z } from 'astro:content';

import type { PurrfilesEntityData } from '@noodlestan/purrfiles-entities';

const metaFile = fileURLToPath(new URL('./data/meta.json', import.meta.url));

type MetaFile = { entities: PurrfilesEntityData[] };

const readMeta = (): MetaFile => JSON.parse(readFileSync(metaFile, 'utf8')) as MetaFile;

const entities = defineCollection({
  loader: () =>
    readMeta().entities.map(entity => ({
      ...entity,
      id: `${entity.package}/${entity.type}/${entity.name}`,
    })),
  schema: z.looseObject({
    type: z.string(),
    name: z.string(),
    package: z.string(),
    module: z.string().optional(),
    path: z.string(),
    description: z.string().optional(),
    functions: z.array(z.string()).optional(),
    symbols: z.looseObject({
      imported: z.record(z.string(), z.unknown()).optional(),
      declared: z.record(z.string(), z.unknown()),
    }),
  }),
});

export const collections = { entities };
```

Notes:

- This uses the Astro 7 content layer API: a loader function returns entries that each carry an `id`.
- Keep the schema permissive (`z.looseObject`) so entity fields added by future extractors survive validation.
- Do not read the JSON at module scope: the loader runs at sync/build time, after Step 2 has written the file.

Run from `$ART_MD_WEB`:

```bash
npx astro sync
```

Expected outcome: `.astro/types.d.ts` declares a collection named `entities` and the command exits `0`.

### Step `4 / 6` — Add the `packages` collection

Extend `$ART_MD_WEB/src/content.config.ts` within the same file.

Add the import:

```ts
import { createMetaService } from '@noodlestan/purrfiles-entities';
```

Add the collection after `entities`:

```ts
const packages = defineCollection({
  loader: () => {
    const { entities: all } = readMeta();
    const meta = createMetaService(all);

    return meta.getPackageNames().map(pkg => ({
      id: pkg,
      package: pkg,
      moduleNames: meta.getPackageModuleNames(pkg),
      entityCount: all.filter(entity => entity.package === pkg).length,
    }));
  },
  schema: z.object({
    package: z.string(),
    moduleNames: z.array(z.string()),
    entityCount: z.number().int().nonnegative(),
  }),
});
```

Update the export:

```ts
export const collections = { entities, packages };
```

Run from `$ART_MD_WEB`:

```bash
npx astro sync
```

Expected outcome: `.astro/types.d.ts` declares both `entities` and `packages`.

### Step `5 / 6` — Add route helpers

Create `$ART_MD_WEB/src/lib/routes.ts`:

```ts
const DOCS_ROOT = '/docs';

const UNPREFIXED_NAMESPACE = '_';

export type PackageParts = {
  namespace: string;
  name: string;
};

function segment(value: string): string {
  return encodeURIComponent(value);
}

export function packageParts(packageName: string): PackageParts {
  const segments = packageName.split('/');

  if (packageName.startsWith('@') && segments.length === 2) {
    return { namespace: segments[0].slice(1), name: segments[1] };
  }

  return { namespace: UNPREFIXED_NAMESPACE, name: packageName };
}

export function packageHref(packageName: string): string {
  const { namespace, name } = packageParts(packageName);

  return `${DOCS_ROOT}/${segment(namespace)}/${segment(name)}`;
}

export function moduleHref(packageName: string, moduleName: string): string {
  return `${packageHref(packageName)}/${segment(moduleName)}`;
}

export function entityHref(
  packageName: string,
  moduleName: string,
  type: string,
  entityName: string,
): string {
  return `${moduleHref(packageName, moduleName)}/${segment(type)}/${segment(entityName)}`;
}
```

Notes:

- Scoped names map `@art-md/parser` to namespace `art-md` and package `parser`, matching the `/docs/{ns}/{pkg}/...` route shape.
- Unscoped names use `_` as namespace so the route shape stays stable when extraction covers more packages.
- Iterations 5 and 6 consume these helpers; do not add pages in this step.

### Step `6 / 6` — Commit `create-docs-collections`

Run the **Verifying Completion** steps, then commit from `$ARTIFICIALS`.

---

#### Commit: `create-docs-collections`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(art-md-web): Add docs entities and packages collections.
```

---

## Final Verification

**Instructions:**

- Verify that `$ART_MD_WEB/package.json` declares `@noodlestan/purrfiles-entities` as a `file:../../../art-md/libs/purrfiles-entities` dependency and that no other dependency range changed.
- Verify that `$ART_MD_WEB/scripts/sync-meta.mjs` copies `$META` to `$ART_MD_WEB/src/data/meta.json`.
- Verify that `$ARTIFICIALS/.gitignore` ignores `apps/art-md-web/src/data/meta.json` and that `git status` does not list it.
- Verify that `$ART_MD_WEB/src/content.config.ts` exports `entities` and `packages` and that each loader returns entries carrying a unique `id`.
- Verify that `.astro/types.d.ts` was regenerated by `npx astro sync` and declares both collections.
- Verify that `.astro/data-store.json` contains the id `@art-md/parser/module/parse`.
- Verify that `$ART_MD_WEB/src/lib/routes.ts` maps `@art-md/parser` to `/docs/art-md/parser` and appends `/module` and `/module/parse` for the module and entity helpers.
- Verify that commits have been executed and not pushed, according to the commit policy.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
