# Instructions: `scaffold-astro-docs`

**Plan:** `componentize-docs`

**Iteration Id:** `scaffold-astro-docs`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-componentize-docs/instructions/scaffold-astro-docs__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `scaffold-astro-docs`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable            | Resolved Path                               | Purpose                                   |
| ------------------- | ------------------------------------------- | ----------------------------------------- |
| `$WORKSPACE`        | Current working directory                   | Workspace root directory.                 |
| `$PROJECT`          | `$WORKSPACE/checkouts/artificials`          | This plan's backlog and the milestone.    |
| `$NOODLESTAN_WEB`   | `$WORKSPACE/checkouts/noodlestan-web`       | Target project — hosts the new package.   |
| `$PACKAGE`          | `$NOODLESTAN_WEB/packages/astro-docs`       | New package to scaffold.                  |
| `$ASTRO_COMPONENTS` | `$NOODLESTAN_WEB/packages/astro-components` | Existing package to model conventions on. |
| `$ART_MD_WEB`       | `$PROJECT/apps/art-md-web`                  | Source of the styles copied here.         |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `scaffold-astro-docs`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Create `@noodlestan/astro-docs` as a faithful sibling of `@noodlestan/astro-components` — same package shape, exports map, and conventions — carrying the Purrtrait consumer styles (copied, not moved: the app keeps rendering styled throughout), committed as `build(astro-docs): Scaffold the docs components package.`

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$ASTRO_COMPONENTS/package.json` (Source) — The manifest to mirror: exports map (`.` + `./global.css`), `sideEffects`, scripts, prettier config, peer/dev dependencies. Relevant for Step 1.
- ::READ `$ASTRO_COMPONENTS/src/index.ts` (Source) — The barrel pattern: `.astro` components exported by name from `./components`; `tsc --noEmit` passes with this shape today. Relevant for Step 3.
- ::READ `$ASTRO_COMPONENTS/_records/package.art` (Source) — The package record shape to adapt. Relevant for Step 4.
- ::READ `$ASTRO_COMPONENTS/test/` (Source) — The Astro fixture the `build` script runs (`astro build --root test/astro`) — copy the structure, not the model's content or build artifacts. Relevant for Step 3.
- ::READ `$ART_MD_WEB/src/styles/global.css` (Source) — The Purrtrait consumer styles being copied (the block under `/* --- Purrtrait docs rendering --- */` to end of file). Relevant for Step 2.
- ::READ `../plan.md` (Structure) — Scope, Authoring inventory, and decisions this scaffold implements. Relevant for every step.
- ::READ `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` (Conventions) — Manifest field rules and exact-pin model. Relevant for Step 1.
- ::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Allowed commit types, scopes, and message format. Relevant for the commit step.
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md`)

Run from the `$NOODLESTAN_WEB` root:

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

**Purpose:** Confirms lint, build, and test pass for the workspace. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/verifying-completion/operation.art`.

**Instructions:** (From `$NOODLESTAN_WEB/_guide.md`)

Run from the `$NOODLESTAN_WEB` root:

```bash
npm run ci # lint (prettier + eslint + tsc --noEmit), fixture build, test
```

All steps MUST pass.

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 5 — Scaffold the package manifest and root config files
- Step 2 / 5 — Copy the Purrtrait consumer styles
- Step 3 / 5 — Barrel skeleton and Astro fixture
- Step 4 / 5 — Records, README, CHANGELOG
- Step 5 / 5 — Verify and commit `scaffold-astro-docs`

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 5` — Scaffold the package manifest and root config files

Create `$PACKAGE/package.json` mirroring `$ASTRO_COMPONENTS/package.json` with these differences:

- `name`: `@noodlestan/astro-docs`; `description`: `Shared Astro docs components for all Noodlestan Astro sites.`; `keywords`: `["astro", "components", "documentation"]`; `repository.directory`: `packages/astro-docs/`.
- `dependencies` (exact, per policy): `"@purrtrait/astro-components": "0.0.1"` — **published, pinned from npm, never a `file:` link**.
- `devDependencies` (exact): the model's two prettier entries **plus** `"@purrception/lang-ts": "0.1.1"` (the extracted components import its `FunctionDeclaration` / `TypeDeclaration` / `FunctionJsDocData` types — type-only).
- Everything else (`exports` with `.` and `./global.css`, `sideEffects: ["**/*.css"]`, `main`, `types`, `peerDependencies: { "astro": "^7.4.2" }`, `files`, `scripts`, `prettier`, `publishConfig`, `private`) copied verbatim from the model.

Copy from `$ASTRO_COMPONENTS` root, verbatim: `astro.d.ts`, any `tsconfig*.json`, and any ignore/lint config files present (`ls -a` it and take the config files — NOT `package.json`, `README.md`, `CHANGELOG.md`, `_records/`, or anything under `dist/`, `.astro/`, `node_modules/`).

### Step `2 / 5` — Copy the Purrtrait consumer styles

Create `$PACKAGE/src/styles/global.css` containing **verbatim** the block from `$ART_MD_WEB/src/styles/global.css` that starts at the `/* --- Purrtrait docs rendering --- */` marker and runs to the end of the file (the `.shiki` light/dark variable mapping, `.code-block`, `.jsdoc-*`, and `.tags` rules).

RULE: this is a **copy** — `$ART_MD_WEB/src/styles/global.css` must be byte-unchanged after this step. The app drops its copy only when it re-points at the package in the next iteration, so the docs stay styled between commits.

### Step `3 / 5` — Barrel skeleton and Astro fixture

1. `src/components/index.ts` — placeholder barrel (empty export list with a comment that the docs sections land in the next iteration).
2. `src/index.ts` — `export * from './components';` (the model's barrel shape).
3. `test/astro/` — a minimal self-contained fixture the `build` script can run: `src/pages/index.astro` imports the package entry **by relative path** (`../../../../src/index.ts`, the model's pattern) and the copied `../../../../src/styles/global.css`, rendering a trivial page — this iteration's proof is that the `.astro` graph and the styles build. Do NOT import or render `DocsBreadcrumbs` or `EntitiesSection`: those sections do not exist until iteration `extract-docs-sections`, which extends this fixture to render them once they land (its `::READ` of `$PACKAGE/test/astro/` says so). No layout file, no content collections, no copied model pages. Do not copy the model's `dist/`, `.astro/`, or `node_modules/` artifacts.

### Step `4 / 5` — Records, README, CHANGELOG

- `$PACKAGE/_records/package.art` — adapt the model's record: `Package: Astro Docs`, Purpose `Shared Astro docs components for all Noodlestan Astro sites.`, Description from the plan's scope role, `Path`: `packages/astro-docs/`, `Canonical Name`: `@noodlestan/astro-docs`, `Published`: `false`, `Private`: `false`, keywords as in the manifest, dependencies as declared, no `Deployment` entry (publishing is out of scope).
- `$PACKAGE/README.md` — modeled on the model's README: title, one-line purpose, package table placeholder, Development scripts, license footer (copy the model's footer verbatim).
- `$PACKAGE/CHANGELOG.md` — `## 0.0.1` with an `### Added` entry for the scaffold and the styles copy.

### Step `5 / 5` — Verify and commit `scaffold-astro-docs`

Run from the `$NOODLESTAN_WEB` root:

```bash
npm install # register the new workspace package
npm run ci # lint (tsc --noEmit over the barrel), fixture build, test
```

All MUST pass — including the model package's own CI in the same run. Then confirm:

- `git -C $ART_MD_WEB status --porcelain` is empty — the app is untouched (styles were copied, not moved).
- `grep -c 'shiki-light' $PACKAGE/src/styles/global.css` returns ≥ 1 (the copy landed).

---

#### Commit: `scaffold-astro-docs`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(astro-docs): Scaffold the docs components package.
```

RULE: Commit from the `$NOODLESTAN_WEB` root on branch `main`, and stage only `$PACKAGE/**` and `$NOODLESTAN_WEB/package-lock.json`. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — this commit is created and NOT pushed.
- Verify `$PACKAGE/package.json` pins `@purrtrait/astro-components` `0.0.1` exactly from npm (no `file:` link anywhere in it) with `astro ^7.4.2` as a peer.
- Verify the exports map mirrors the model (`.` and `./global.css`) and `src/index.ts` re-exports `./components`.
- Verify `$ART_MD_WEB/src/styles/global.css` is unchanged and the package holds its own copy of the Purrtrait block.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
