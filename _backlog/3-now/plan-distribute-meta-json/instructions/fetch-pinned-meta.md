# Instructions: `fetch-pinned-meta`

**Plan:** `distribute-meta-json`

**Iteration Id:** `fetch-pinned-meta`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-distribute-meta-json/instructions/fetch-pinned-meta__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `fetch-pinned-meta`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable      | Resolved Path                      | Purpose                                          |
| ------------- | ---------------------------------- | ------------------------------------------------ |
| `$WORKSPACE`  | Current working directory          | Workspace root directory.                        |
| `$PROJECT`    | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone.           |
| `$ART_MD_WEB` | `$PROJECT/apps/art-md-web`         | The website replacing its sibling-checkout sync. |
| `$ART_MD`     | `$WORKSPACE/checkouts/art-md`      | Source project referenced by the config pin.     |
| `$PARSER`     | `$ART_MD/libs/parser`              | The package whose pinned version is fetched.     |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `fetch-pinned-meta`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Replace the sibling-checkout sync with a config-pinned, zero-dependency fetcher: `meta-docs.config.mts` pins which package versions the site documents, `scripts/fetch-meta.mjs` downloads each `dist/meta.json` from the npm CDN endpoint and merges the entities — committed as `build(art-md-web): Fetch pinned meta from the npm endpoint.`

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification. Relevant for every step.
- ::READ `$ART_MD/_guide.md` (Guide) — The source project the config pins reference. Relevant for orientation.
- ::READ `$ART_MD_WEB/scripts/sync-meta.mjs` (Source) — The script being deleted; its output path (`src/data/meta.json`), logging style, and `{ entities }` shape are the contract the fetcher must keep. Relevant for Steps 2–3.
- ::READ `$ART_MD_WEB/src/content.config.ts` (Source) — The unchanged consumer: reads `./data/meta.json` as `{ entities }`. Relevant for Steps 2 and 4.
- ::READ `$PARSER/package.json` (Source) — Confirms the pinned version the config must name (`0.0.7`, from the previous iteration). Relevant for Step 1.
- ::READ `$WORKSPACE/checkouts/management/_ops/packages/policy.md` (Conventions) — Manifest rules; the edit touches the `scripts` block only, keeping field order intact — no dependencies change. Relevant for Step 3.
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
npm run build # runs fetch-meta, then a full static build
npm run lint # prettier check — MUST run AFTER build
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 4 — Create `meta-docs.config.mts`
- Step 2 / 4 — Create `scripts/fetch-meta.mjs`
- Step 3 / 4 — Rewire the npm scripts and delete the sync
- Step 4 / 4 — Verify and commit `fetch-pinned-meta`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 4` — Create `meta-docs.config.mts`

Create `$ART_MD_WEB/meta-docs.config.mts` — the single source of version pins:

```ts
export const metaDocs = {
  endpoint: 'https://cdn.jsdelivr.net/npm/{package}@{version}/dist/meta.json',
  packages: [{ package: '@art-md/parser', version: '0.0.7' }],
};
```

- The version MUST be `0.0.7` — the release produced by the previous iteration (`ship-fresh-meta`). If `$PARSER/package.json` or `npm view @art-md/parser version` disagrees, REPORT A BLOCKER: do not fetch a version that predates the re-authored links.
- The endpoint is a template, not policy: later entries (unpkg, registry tarball, the registry repo) change here without touching the script.

### Step `2 / 4` — Create `scripts/fetch-meta.mjs`

Create `$ART_MD_WEB/scripts/fetch-meta.mjs`, mirroring `sync-meta.mjs`'s imports and output contract, with **zero dependencies** (built-in `fetch` and `node:` builtins only):

1. Import the config: `import { metaDocs } from '../meta-docs.config.mts';` — Node's native type stripping loads it (repo runs the `.nvmrc` Node ≥22.18). If the import fails on the repo's Node, REPORT A BLOCKER — do NOT convert the config to JSON.
2. For each entry in `metaDocs.packages`: build `url` by substituting `{package}` and `{version}` in the endpoint template (substitute raw — scoped names like `@art-md/parser` belong in the URL path unencoded for jsdelivr).
3. `const response = await fetch(url);` — if `!response.ok`, throw with the URL and status; if any fetch fails, exit non-zero (the build must fail loudly rather than build docs from a missing or stale local file).
4. Parse each response as JSON, assert an `entities` array, and merge: `const entities = metas.flatMap(meta => meta.entities);`.
5. Resolve the output exactly like `sync-meta.mjs`: `src/data/meta.json` relative to the app root via `fileURLToPath(new URL(...))`, `mkdir` the directory if needed, write `JSON.stringify({ entities }, null, 2)`, and `console.info` one line per fetched package plus a final line with the merged entity count and byte size.

Expected outcome: `src/data/meta.json` keeps its exact `{ entities: [...] }` shape — `content.config.ts` does not change in this iteration.

### Step `3 / 4` — Rewire the npm scripts and delete the sync

In `$ART_MD_WEB/package.json`, in the `scripts` block only (no dependency changes — keep the block's key order otherwise intact):

- Rename `"extract": "node scripts/sync-meta.mjs"` to `"fetch-meta": "node scripts/fetch-meta.mjs"`.
- `"dev"`: `npm run fetch-meta && astro dev`.
- `"build"`: `npm run fetch-meta && astro build`.

Then delete `$ART_MD_WEB/scripts/sync-meta.mjs` (stage the deletion). RULE: `git -C $PROJECT diff` MUST show changes in `scripts` only — if any dependency or version line changes, revert and REPORT A BLOCKER.

### Step `4 / 4` — Verify and commit `fetch-pinned-meta`

Run from `$ART_MD_WEB`:

```bash
npm run fetch-meta # downloads 0.0.7 from the endpoint and writes src/data/meta.json
npm run lint:fix
npx astro sync
npm run build # fetch-meta runs again, then the full static build
npm run lint
```

All MUST pass (this requires network access to the CDN; an unreachable endpoint is a REPORT A BLOCKER, not a fallback to any local file). Then confirm:

- `node -e "const m=require('./src/data/meta.json'); console.log(m.entities.length)"` — prints `4` (all parser entities, merged through the script's one path).
- `grep -rn "sync-meta" $ART_MD_WEB` returns nothing.
- `git -C $PROJECT status --porcelain apps/art-md-web/src/data` is empty — the fetched file stays gitignored as the cache it now is.

---

#### Commit: `fetch-pinned-meta`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(art-md-web): Fetch pinned meta from the npm endpoint.
```

RULE: Commit from the `$PROJECT` root on branch `main`, and stage only `$ART_MD_WEB/meta-docs.config.mts`, `$ART_MD_WEB/scripts/fetch-meta.mjs`, the deleted `$ART_MD_WEB/scripts/sync-meta.mjs`, and `$ART_MD_WEB/package.json`. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit is created and NOT pushed.
- Verify `meta-docs.config.mts` pins `@art-md/parser` `0.0.7` and `scripts/fetch-meta.mjs` imports it (the `.mts` file loads on the repo's Node without conversion).
- Verify `grep -rn "sync-meta" apps/` returns nothing and `scripts/sync-meta.mjs` is deleted.
- Verify the `git diff` for `$ART_MD_WEB/package.json` touches the `scripts` block only — no dependency changed.
- Verify the docs build passes end-to-end with `src/data/meta.json` produced by the fetch, and the rendered pages are unchanged.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
