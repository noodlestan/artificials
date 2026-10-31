# Instructions: `extract-art-md-meta`

**Plan:** `art-md-docs`

**Iteration Id:** `extract-art-md-meta`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-md-docs/instructions/extract-art-md-meta__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `extract-art-md-meta`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable     | Resolved Path                     | Purpose                             |
| ------------ | --------------------------------- | ----------------------------------- |
| `$WORKSPACE` | Current working directory         | Workspace root directory            |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md`     | Art MD checkout                     |
| `$PACKAGE`   | `$ART_MD/libs/parser`             | Parser package that emits meta.json |
| `$EXTRACT`   | `$ART_MD/cli/purrfiles-extract`   | Extractor dependency                |
| `$ENTITIES`  | `$ART_MD/libs/purrfiles-entities` | Entity types dependency             |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `extract-art-md-meta`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Wire the extractor into `@art-md/parser` and produce the first real `dist/meta.json`. The output must contain Module `parse` with `helpers` including `parse`, and the root `$ART_MD` `extract` script must run the package extraction.

## Mandatory Reading

- `$ART_MD/_guide.md` — repository layout, conventions, operating instructions.
- `$ART_MD/libs/parser/_guide.md` — package layout and verification commands.
- `$ART_MD/libs/parser/package.json` — scripts and dependencies to update.
- `$ART_MD/libs/parser/tsconfig.json` — include paths.
- `$ART_MD/package.json` — root scripts and workspaces.
- `$ART_MD/turbo.json` — task graph.
- `$ART_MD/libs/parser/src/index.ts`, `$ART_MD/libs/parser/src/parse/parse.ts` — first extracted source.
- `$EXTRACT/src/index.ts`, `$EXTRACT/src/entities/Module/createModuleEntityExtractor.ts` — public extractor API.
- `$NO_COMPLY/libs/solid-accessibility/scripts/extract.ts` — extraction script pattern (reference only).
- `$ARTIFICIALS/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.
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

**Purpose:** Confirms that the parser emits a valid `meta.json` and the monorepo is green.

**Instructions:** (From `$ART_MD/_guide.md` and `$ART_MD/libs/parser/_guide.md`)

Run from `$ART_MD`:

```bash
npm install # links the new workspace dependencies
npm run build # builds entities and extract before parser lint/type-check
```

Run from `$PACKAGE`:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # prettier, eslint, tsc --noEmit
npm run extract # writes dist/meta.json
npm run build # produces dist/
npm run test:ci # runs tests with coverage
```

Run from `$ART_MD`:

```bash
npm run ci # lint, test and build across the monorepo
```

All steps MUST pass. No `it.todo()` tests may remain.

---

## Changes

Add the parser extraction script, wire the package and root scripts, and verify the emitted metadata.

- Step 1 / 3 — Add the parser extraction script
- Step 2 / 3 — Wire package and root scripts and dependencies
- Step 3 / 3 — Run extraction, verify the output, and commit `extract-art-md-meta`

## Steps

### Step `1 / 3` — Add the parser extraction script

Create `$PACKAGE/scripts/extract.ts`:

```ts
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createModuleEntityExtractor } from '@noodlestan/purrfiles-extract';
import { extractEntitiesFromFileSystem } from '@purrception/source-fs';

async function main() {
  const extracted = await extractEntitiesFromFileSystem({
    rootDir: 'src/',
    extractors: [createModuleEntityExtractor()],
    meta: { package: '@art-md/parser' },
  });

  const entities = extracted.map(({ entity }) => entity);

  await mkdir('./dist', { recursive: true });
  await writeFile('./dist/meta.json', JSON.stringify({ entities }, null, 2));

  const fileStats = await stat('./dist/meta.json');
  console.info(
    `Wrote : ${path.resolve('./dist/meta.json')} (entities: ${entities.length} size: ${fileStats.size} bytes)`,
  );
}

main().catch(error => {
  console.error('Failed to extract entities from package:', error);
  process.exit(1);
});
```

Expected outcome: the script extracts every top-level module under `src/`, including `parse` via the same-name fallback.

### Step `2 / 3` — Wire package and root scripts and dependencies

Update `$PACKAGE/package.json`:

1. Add the script `"extract": "tsx scripts/extract.ts"` after `"test:watch"`.
2. Add these `devDependencies` (keep the existing `vitest` entry):

```json
{
  "devDependencies": {
    "@noodlestan/purrfiles-extract": "*",
    "@purrception/lang-ts-extract": "0.1.1",
    "@purrception/source-fs": "0.1.1",
    "tsx": "4.23.15",
    "vitest": "5.0.5"
  }
}
```

Update `$PACKAGE/tsconfig.json` to type-check the script:

```json
{
  "extends": "@noodlestan/tsconfig/esbuild/tsconfig.json",
  "include": ["src/", "scripts/", "**/*.config.ts"],
  "exclude": ["**/node_modules/", "**/dist/", "**/coverage/"]
}
```

Do not change `tsconfig.build.json`: it keeps `include: ["src/"]` so the script is not emitted into `dist/`.

Update `$ART_MD/package.json` root script:

```json
{
  "scripts": {
    "extract": "npm run extract --workspaces --if-present"
  }
}
```

Do not add an `extract` task to `turbo.json`; the root command uses npm workspaces.

Run from `$ART_MD`:

```bash
npm install # updates the lockfile and links @noodlestan/purrfiles-extract
```

Expected outcome: `npm run extract` from `$ART_MD` delegates to `@art-md/parser`.

### Step `3 / 3` — Run extraction, verify the output, and commit `extract-art-md-meta`

Run from `$ART_MD`:

```bash
npm run build # ensures @noodlestan/purrfiles-entities and @noodlestan/purrfiles-extract have dist/
```

Run from `$PACKAGE`:

```bash
npm run extract
```

Verify the output:

```bash
node -e "const { entities } = require('./dist/meta.json'); const parse = entities.find(e => e.type === 'module' && e.name === 'parse'); console.log(JSON.stringify(parse, null, 2)); if (!parse || !parse.helpers.includes('parse')) process.exit(1)"
```

Expected outcome: the command exits `0` and prints Module `parse` with `helpers` including `parse`. The `entities` array also contains the other top-level modules (`buildDocument`, `config`, `mdast`, `private`).

Then run the **Verifying Completion** steps and commit.

---

#### Commit: `extract-art-md-meta`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(parser): Add purrception metadata extraction.
```

---

## Final Verification

**Instructions:**

- Verify that `$PACKAGE/scripts/extract.ts` exists and writes `{ entities }` to `$PACKAGE/dist/meta.json`.
- Verify that `$PACKAGE/package.json` has the `extract` script and the four new dev dependencies.
- Verify that `$PACKAGE/tsconfig.json` includes `scripts/` and that `tsconfig.build.json` does not.
- Verify that `$ART_MD/package.json` delegates `extract` to workspaces.
- Verify that `$PACKAGE/dist/meta.json` contains Module `parse` with `helpers` including `parse`.
- Verify that commits have been executed and not pushed, according to the commit policy.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
