# Instructions: `record-astro-docs`

**Plan:** `componentize-docs`

**Iteration Id:** `record-astro-docs`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-componentize-docs/instructions/record-astro-docs__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `record-astro-docs`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable          | Resolved Path                         | Purpose                                      |
| ----------------- | ------------------------------------- | -------------------------------------------- |
| `$WORKSPACE`      | Current working directory             | Workspace root directory.                    |
| `$PROJECT`        | `$WORKSPACE/checkouts/artificials`    | This plan's backlog and the milestone.       |
| `$NOODLESTAN_WEB` | `$WORKSPACE/checkouts/noodlestan-web` | Hosts the package — records and guides.      |
| `$PACKAGE`        | `$NOODLESTAN_WEB/packages/astro-docs` | The package being registered.                |
| `$ART_MD_WEB`     | `$PROJECT/apps/art-md-web`            | The consumer whose evidence closes the plan. |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `record-astro-docs`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Register the new package in the workspace records and guides, record the extraction's evidence (byte-identical diff and JSDoc coverage counts) in this plan, and close the coordination loop — milestone, parking lot, plan status — committed as `records(astro-docs): Register the package in the workspace records and guides.` and `roadmap(art-md-hello-world): Move \`componentize-docs\` forward; reflected upstream.`

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$NOODLESTAN_WEB/_guide.md` (Guide) — Where the new package's guide row goes (mirror the existing table's format). Relevant for Step 1.
- ::READ `$PACKAGE/_records/package.art` (Source) — The record finalized in the scaffold; verify it matches the shipped package. Relevant for Step 1.
- ::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification. Relevant for Step 2.
- ::READ `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md` (Source) — The Phase 4 rows this plan updates. Relevant for Step 2.
- ::READ `../instructions/extract-docs-sections__report.md` (Source) — The byte-diff result and JSDoc counts being recorded as Evidence. Relevant for Step 2.
- ::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Allowed commit types, scopes, and message format. Relevant for both commits.
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md` and `$PROJECT/_guide.md`)

Run `npm ci` from the `$NOODLESTAN_WEB` and `$PROJECT` roots.

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions. Operation of Workflow: Planning Work, defined in `$DOMAINS/work/workflows/planning-work/writing-commit-message/operation.art`.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms the records, guides, and roadmap agree. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md` and `$PROJECT/_guide.md`)

Run `npm run ci` from the `$NOODLESTAN_WEB` root and the docs build (`lint:fix` → `astro sync` → `build` → `lint`) from `$ART_MD_WEB`. Then verify record/reference integrity: every path and name cited in the milestone rows and guides resolves.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 3 — Register the package in the noodlestan-web guides (commit A)
- Step 2 / 3 — Record evidence and close the plan in artificials (commit B)
- Step 3 / 3 — Final verification

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 3` — Register the package in the noodlestan-web guides (commit A)

1. Add the `@noodlestan/astro-docs` row to the packages/project table in `$NOODLESTAN_WEB/_guide.md`, matching the table's existing format exactly (the guide may carry other tables — add to the one listing packages; if the guide has no packages table, add one modeled on the project tables in `$ASTRO_COMPONENTS`' home guides).
2. Re-read `$PACKAGE/_records/package.art` against the shipped package: canonical name, path, dependencies, and keywords match the manifest; `Published` is `false`; no `Deployment` entry. Fix any drift (records are the source of truth for tools — the manifest follows them).
3. Verify: `npm run ci` from `$NOODLESTAN_WEB` still passes (prettier covers the guide edit).

---

#### Commit: `record-astro-docs`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
records(astro-docs): Register the package in the workspace records and guides.
```

RULE: Commit from the `$NOODLESTAN_WEB` root on branch `main`, and stage only `$NOODLESTAN_WEB/_guide.md` and `$PACKAGE/_records/package.art` (if it changed). Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

### Step `2 / 3` — Record evidence and close the plan in artificials (commit B)

1. In `../plan.md`:
   - **Evidence** (currently "None yet") gains the two facts from `extract-docs-sections__report.md`: the normalized HTML diff was empty (byte-identical) and the JSDoc count-parity result (functions-with-`paramTags` vs rendered `jsdoc-params` blocks, `ParserConfig` members, `{@link}` anchors).
   - **Work / Next** becomes a completion note: all iterations `DONE`, plan moving to `done`.
   - Plan `**Status:**` → `DONE`.
2. In `$PROJECT/_roadmap/3-now/milestone-art-md-hello-word/milestone.md`: the Phase 4 row for Plan: Componentize Docs → path `_backlog/1-done/plan-componentize-docs/plan.md`, status `` `DONE` ``.
3. Refresh `$PROJECT/_backlog/_parking-lot.md`: move any componentize-related items this plan resolved to done; add newly revealed follow-ups (e.g. publishing `@noodlestan/astro-docs`, migrating other Astro sites) only if they are not already recorded in the plan's Follow Ups.
4. Move the plan directory: `git mv .. $PROJECT/_backlog/1-done/plan-componentize-docs`.
5. Verify: every path cited in the updated milestone row resolves; prettier clean.

---

#### Commit: `reflect-astro-docs`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
roadmap(art-md-hello-world): Move `componentize-docs` forward; reflected upstream.
```

RULE: Commit from the `$PROJECT` root on branch `main`, and stage only the moved plan directory and the milestone and parking-lot files. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

### Step `3 / 3` — Final verification

Run the **Verifying Completion** instructions from above, then confirm:

- `grep -c 'astro-docs' $NOODLESTAN_WEB/_guide.md` ≥ 1 and the package record matches the manifest.
- Every path the milestone's Phase 4 rows reference resolves to a file that exists.
- `git -C $PROJECT status --porcelain` shows nothing outside the staged set; same for `$NOODLESTAN_WEB`.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — both commits are created and NOT pushed.
- Verify the Evidence section carries the byte-diff and count-parity results (no "None yet" left).
- Verify the plan sits in `_backlog/1-done/` with status `DONE` and the milestone row matches.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
