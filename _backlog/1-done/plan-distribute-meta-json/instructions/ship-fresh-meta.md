# Instructions: `ship-fresh-meta`

**Plan:** `distribute-meta-json`

**Iteration Id:** `ship-fresh-meta`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-distribute-meta-json/instructions/ship-fresh-meta__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `ship-fresh-meta`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                      | Purpose                                  |
| ------------ | ---------------------------------- | ---------------------------------------- |
| `$WORKSPACE` | Current working directory          | Workspace root directory.                |
| `$PROJECT`   | `$WORKSPACE/checkouts/artificials` | This plan's backlog and the milestone.   |
| `$ART_MD`    | `$WORKSPACE/checkouts/art-md`      | Source project — releases the meta.      |
| `$PARSER`    | `$ART_MD/libs/parser`              | The package publishing `dist/meta.json`. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `ship-fresh-meta`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Make `@art-md/parser` releases incapable of shipping stale documentation data: `prepack` regenerates `dist/meta.json` at pack and publish time, and the release carrying the re-authored `{@link}` targets goes out as `0.0.7` — committed as `release(parser): Regenerate meta on prepack and release 0.0.7.`

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification; the downstream consumer this release serves. Relevant for verification.
- ::READ `$ART_MD/_guide.md` (Guide) — Extraction monorepo layout, setup, and verification. Relevant for every step.
- ::READ `$PARSER/package.json` (Source) — The manifest receiving `prepack` and the `0.0.6` version bump; scripts block order. Relevant for Steps 1 and 3.
- ::READ `$PARSER/scripts/extract.ts` (Source) — What `prepack` will invoke; writes `./dist/meta.json` as `{ entities }`. Relevant for Steps 1–2.
- ::READ `$ART_MD_WEB/scripts/sync-meta.mjs` (Source) — The consumer-side copy this plan later deletes; the freshness guarantee replaces its sibling-checkout dependency. Context only. Relevant for orientation.
- ::READ `$ART_MD_WEB/src/content.config.ts` (Source) — Reads the synced `meta.json`; confirms the shape the release must carry. Context only. Relevant for orientation.
- ::READ `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` (Conventions) — Manifest field rules; the edit touches `scripts` and `version` only, keeping field order intact. Relevant for Step 3.
- ::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Allowed commit types, scopes, and message format. Relevant for the commit step.
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$ART_MD/_guide.md`)

Run from the `$ART_MD` root:

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

**Purpose:** Confirms that the release carries fresh meta. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$ART_MD/_guide.md`)

Run from the `$ART_MD` root:

```bash
npm run ci # lint, build and test
```

All steps MUST pass.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 5 — Add `prepack` to the parser manifest
- Step 2 / 5 — Prove the freshness guarantee with a dry-run pack
- Step 3 / 5 — Bump to `0.0.7`, changelog, refresh the lock
- Step 4 / 5 — Commit `ship-fresh-meta`
- Step 5 / 5 — Hand `0.0.7` to the user for `npm publish` and verify

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 5` — Add `prepack` to the parser manifest

In `$PARSER/package.json`, add to the `scripts` block, directly after the existing `extract` entry (keeping every other key and the block's order untouched):

```json
"prepack": "npm run extract"
```

`prepack` is an npm lifecycle that runs automatically before every `npm pack` and `npm publish` — this one line is the whole freshness guarantee: a release can never contain a `dist/meta.json` that is older than the sources being released.

### Step `2 / 5` — Prove the freshness guarantee with a dry-run pack

Run from `$PARSER`:

```bash
npm pack --dry-run
```

The `prepack` hook must fire (you will see the extract run and `Wrote : …/dist/meta.json` in the output), and the file list must contain `package/dist/meta.json`. Then confirm the freshly written meta carries the re-authored targets:

```bash
grep -c 'config#ParserConfig' dist/meta.json
```

It must return at least 1. If `prepack` does not fire, or the targets are missing, REPORT A BLOCKER with the output.

### Step `3 / 5` — Bump to `0.0.7`, changelog, refresh the lock

1. In `$PARSER/package.json`, bump `version` from `0.0.6` to `0.0.7` (scripts stay as edited in Step 1).
2. In `$PARSER/CHANGELOG.md`, add a new top section:

   ```markdown
   ## 0.0.7

   ### Added

   - `prepack` lifecycle regenerates `dist/meta.json` at pack and publish time, so releases can never ship stale meta.

   ### Changed

   - `{@link}` targets re-authored as `entity#symbol` expressions, resolving to the owning module's page anchor.
   ```

3. Run from the `$ART_MD` root:

   ```bash
   npm install # refresh the workspace lockfile with the new version
   ```

   Verify `git -C $ART_MD diff package-lock.json` only reflects the parser version change; revert unrelated hunks if npm touched anything else.

### Step `4 / 5` — Commit `ship-fresh-meta`

---

#### Commit: `ship-fresh-meta`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
release(parser): Regenerate meta on prepack and release 0.0.7.
```

RULE: Commit from the `$ART_MD` root on branch `main`, and stage only `$PARSER/package.json`, `$PARSER/CHANGELOG.md`, and `$ART_MD/package-lock.json`. `dist/` is gitignored — nothing under it may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

### Step `5 / 5` — Hand `0.0.7` to the user for `npm publish` and verify

STOP here and hand `@art-md/parser@0.0.7` to the user for `npm publish` (run from `$PARSER`). When the user confirms the publish:

```bash
npm view @art-md/parser version           # must be 0.0.7
npm pack @art-md/parser@0.0.7             # in a temp directory
tar -xzO package-0.0.7.tgz package/dist/meta.json | grep -c 'config#ParserConfig'   # must be >= 1
```

Both MUST pass — the second proves the published artifact (not just the local tree) carries fresh meta with the re-authored links. If the registry serves `0.0.7` with stale or pre-`9b065e3` links, REPORT A BLOCKER: the `prepack` guarantee failed.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit is created and NOT pushed.
- Verify that `npm pack --dry-run` in `$PARSER` fires `prepack`, runs the extract, and lists `dist/meta.json`.
- Verify `npm view @art-md/parser version` resolves `0.0.7` and the published tarball's `dist/meta.json` contains `config#ParserConfig` targets.
- Verify `$PARSER/package.json` gained only `prepack` and the version bump — no other field changed.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
