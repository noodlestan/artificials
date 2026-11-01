# Instructions: `integrate-code-rendering`

**Plan:** `integrate-purrtrait-and-shiki`

**Iteration Id:** `integrate-code-rendering`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-integrate-purrtrait-and-shiki/instructions/integrate-code-rendering__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `integrate-code-rendering`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable      | Resolved Path                      | Purpose                                       |
| ------------- | ---------------------------------- | --------------------------------------------- |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                     |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | Artificials checkout — implementation target. |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | Astro website to modify.                      |
| `$PURRTRAIT`  | `$WORKSPACE/checkouts/purrtrait`   | Purrtrait monorepo — rendering packages.      |
| `$NO_COMPLY`  | `$WORKSPACE/checkouts/no-comply`   | Reference ApiScreen granularity.              |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `integrate-code-rendering`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Replace the hand-rolled plain-text signature rendering in the Art MD docs with `@purrtrait/astro-components`' `CodeBlock.astro` — highlighted declaration code at build time — and delete `src/lib/signature.ts` whole, committed as `build(art-md-web): Integrate purrtrait code renderer and shiki.`

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$PROJECT/_guide.md` (Guide) — Website setup, verification, deployment. Relevant for every step.
- ::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — Route helpers (`DOCS_ROOT = '/docs/api'`). Relevant for verification.
- ::READ `$ART_MD_WEB/src/content.config.ts` (Source) — Collections feeding the entity data rendered here. Relevant for Steps 2 and 3.
- ::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/components/sections/APIHelpersSection/APIHelpersSection.tsx` (Reference) — The per-function granularity being matched. Relevant for Step 2.
- ::READ `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/components/sections/APITypesSection/APITypesSection.tsx` (Reference) — The per-type granularity being matched. Relevant for Step 3.
- ::READ `$WORKSPACE/_guide.md` (Guide) — Workspace operations and commit conventions. Relevant for the commit step.
- ::READ `$ART_MD_WEB/src/lib/signature.ts` (Source) — The file being deleted; know every helper and type it exports so no consumer is left behind. Relevant for Step 4.
- ::READ `$ART_MD_WEB/src/components/docs/FunctionsSection.astro`, `$ART_MD_WEB/src/components/docs/TypesSection.astro` (Source) — The sections being rewritten. Relevant for Steps 2 and 3.
- ::READ `$ART_MD_WEB/src/pages/docs/api/[ns]/[pkg]/[mod].astro`, `$ART_MD_WEB/src/pages/docs/api/[ns]/[pkg]/[mod]/[type]/[ent].astro` (Source) — The pages importing `signature` types. Relevant for Step 4.
- ::READ `$PURRTRAIT/libs/astro-components/package.json`, `$PURRTRAIT/libs/astro-components/src/components/CodeBlock.astro` (Source) — The consumed component and its `exports` map (`@purrtrait/astro-components/components/*`). Relevant for Steps 2 and 3.
- ::READ `$WORKSPACE/checkouts/management/_ops/packages/policy.md` (Conventions) — Manifest pinning model: exact `dependencies`, caret `peerDependencies`. Relevant for Step 1.
- ::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Allowed commit types, scopes, and message format. Relevant for the commit step.
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the `$PROJECT` root:

```bash
npm ci # to install dependencies.
```

If it fails, resolve the issue before proceeding with implementation.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms all docs routes render and the site still builds. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md`)

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix # to fix formatting issues automatically
npx astro sync # regenerates the collection types
npm run build # runs extract, then a full static build
npm run lint # prettier check — MUST run AFTER build
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 6 — Add the Purrtrait renderer dependencies
- Step 2 / 6 — Rewrite `FunctionsSection.astro` on `CodeBlock.astro`
- Step 3 / 6 — Rewrite `TypesSection.astro` on `CodeBlock.astro`
- Step 4 / 6 — Delete `src/lib/signature.ts` and fix every consumer
- Step 5 / 6 — Verify the build and the rendered pages
- Step 6 / 6 — Commit `integrate-code-rendering`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 6` — Add the Purrtrait renderer dependencies

In `$ART_MD_WEB/package.json`, add to `dependencies` (alphabetically sorted, exact pins per policy):

| Dependency                    | Version                                         |
| ----------------------------- | ----------------------------------------------- |
| `@purrtrait/astro-components` | `file:../../../purrtrait/libs/astro-components` |
| `@purrtrait/jsdoc-renderer`   | `0.0.2`                                         |
| `@purrtrait/lang-ts`          | `file:../../../purrtrait/libs/lang-ts`          |
| `@purrtrait/code-renderer`    | `0.0.11`                                        |
| `@purrception/lang-ts`        | `0.1.1`                                         |
| `marked`                      | `18.1.2`                                        |
| `shiki`                       | `4.5.0`                                         |

- The two `file:` links resolve `../../../purrtrait/...` relative to `$ART_MD_WEB` — the sibling checkout. `@purrtrait/jsdoc-renderer` comes from the npm registry: it is published, never linked.
- `shiki` is already in the tree transitively via `astro` (resolved `4.5.0`); declaring it directly is required because `CodeBlock.astro` imports it.

Then run from the `$PROJECT` root:

```bash
npm install # refresh the lockfile with the new dependencies
npm ci # clean install from the refreshed lockfile
```

RULE: Do not change any other dependency version. Verify `git -C $PROJECT diff package-lock.json` only adds these entries; revert unrelated hunks if npm touched anything else.

### Step `2 / 6` — Rewrite `FunctionsSection.astro` on `CodeBlock.astro`

Rewrite `$ART_MD_WEB/src/components/docs/FunctionsSection.astro`:

- Props become `{ functions: FunctionDeclaration[]; }` with `FunctionDeclaration` imported as a type from `@purrception/lang-ts` (NOT from `../../lib/signature` — that file is being deleted in Step 4).
- Per function: an `<h3>` with `fn.name`, then `<CodeBlock lang="ts" nodes={[fn]} />`, imported as `import CodeBlock from '@purrtrait/astro-components/components/CodeBlock.astro';`.
- RULE: pass the FULL declaration wrapper (`fn` itself — it carries `at`, `name`, `kind`, `node`) as the node. `CodeBlock.astro` dispatches on the `at` field; passing the inner `fn.node` would fall through to expression layout and mis-render.
- Drop `renderFunctionSignature` and `describeFunction` usage entirely — the parameter/return documentation comes back in the next iteration through `JsDocBlock.astro`, not here.
- Keep the `functions.length > 0 &&` guard and the section structure.

### Step `3 / 6` — Rewrite `TypesSection.astro` on `CodeBlock.astro`

Rewrite `$ART_MD_WEB/src/components/docs/TypesSection.astro`:

- Props become `{ types: TypeDeclaration[]; }` with `TypeDeclaration` imported as a type from `@purrception/lang-ts`.
- Keep the public/private split (`declType.private`) and both sections; the private heading keeps its `(private)` suffix.
- Per type: an `<h3>` with the name, then `<CodeBlock lang="ts" nodes={[declType]} />` — again the FULL wrapper, not the inner node.
- Drop `renderType`, `normalizeComment`, and the members `<ul>` — member descriptions return in the next iteration, rendered from node data under each member name.

### Step `4 / 6` — Delete `src/lib/signature.ts` and fix every consumer

1. Delete `$ART_MD_WEB/src/lib/signature.ts`.
2. Fix every import of it — known consumers, verify by grep:

   - `$ART_MD_WEB/src/pages/docs/api/[ns]/[pkg]/[mod].astro` — replace `type DeclaredFunction, DeclaredType` import with `type FunctionDeclaration, TypeDeclaration` from `@purrception/lang-ts`; the `as DeclaredFunction[]` / `as DeclaredType[]` casts become `as FunctionDeclaration[]` / `as TypeDeclaration[]`.
   - `$ART_MD_WEB/src/pages/docs/api/[ns]/[pkg]/[mod]/[type]/[ent].astro` — same replacement.
   - `FunctionsSection.astro` and `TypesSection.astro` — already migrated in Steps 2 and 3.

3. RULE: `grep -rn "lib/signature\|from '../../lib/signature'" $ART_MD_WEB/src` MUST return nothing after this step. No local replacement helper may be created — typed access stays on `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities`.

### Step `5 / 6` — Verify the build and the rendered pages

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix
npx astro sync
npm run build
npm run lint
```

All MUST pass. Then confirm:

- `grep -r "signature" $ART_MD_WEB/src` returns no source references.
- Built pages contain highlighted markup: `grep -l 'astro-code\|--shiki' $ART_MD_WEB/dist/docs/api/art-md/parser/index.html` finds the module page.
- `grep -q 'renderFunctionSignature\|renderType' $ART_MD_WEB/dist -r` finds nothing.

If `astro build` fails on the `.astro` component imports or on the `file:` links, REPORT A BLOCKER with the failing output — do not work around it by re-creating local renderers.

---

#### Commit: `integrate-code-rendering`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(art-md-web): Integrate purrtrait code renderer and shiki.
```

RULE: Commit from the `$PROJECT` root on branch `main`, and stage only `$ART_MD_WEB/**`, `$PROJECT/package.json`, and `$PROJECT/package-lock.json`. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit is created and NOT pushed.
- Verify that `$ART_MD_WEB/src/lib/signature.ts` no longer exists and no source file references it.
- Verify that `FunctionsSection.astro` and `TypesSection.astro` render `CodeBlock.astro` with the full declaration wrappers, and that the pages type their props with `FunctionDeclaration` / `TypeDeclaration` from `@purrception/lang-ts`.
- Verify that `$ART_MD_WEB/package.json` declares the seven dependencies from Step 1 exactly as specified, with no other dependency change.
- Verify that `dist/docs/api/art-md/parser/index.html` contains highlighted code markup.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
