# Instructions: `extract-docs-sections`

**Plan:** `componentize-docs`

**Iteration Id:** `extract-docs-sections`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-componentize-docs/instructions/extract-docs-sections__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `extract-docs-sections`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

This section lists the path variables used in this instruction file. All file references in this instructions file MUST use these variables — never bare filesystem paths.

| Variable          | Resolved Path                         | Purpose                                         |
| ----------------- | ------------------------------------- | ----------------------------------------------- |
| `$WORKSPACE`      | Current working directory             | Workspace root directory.                       |
| `$PROJECT`        | `$WORKSPACE/checkouts/artificials`    | This plan's backlog; consumer migration target. |
| `$NOODLESTAN_WEB` | `$WORKSPACE/checkouts/noodlestan-web` | Hosts the package receiving the sections.       |
| `$PACKAGE`        | `$NOODLESTAN_WEB/packages/astro-docs` | The package the sections move into.             |
| `$ART_MD_WEB`     | `$PROJECT/apps/art-md-web`            | The website re-pointed at the package.          |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `extract-docs-sections`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Move the five docs sections into `@noodlestan/astro-docs` with their JSDoc surface intact and the breadcrumbs route-injected, then re-point the Art MD Website at the package with byte-identical rendered output — two commits, one per repository.

## Mandatory Reading

This section lists the documentation and reference files the sub-agent needs to read before making changes.

- ::READ `$PROJECT/_guide.md` (Guide) — Website setup and verification. Relevant for the consumer half.
- ::READ `$NOODLESTAN_WEB/_guide.md` (Guide) — Workspace layout and verification. Relevant for the package half.
- ::READ `$ART_MD_WEB/src/components/docs/` (Source) — The five sections being moved: `DocsBreadcrumbs`, `EntitiesSection`, `EntitySummary`, `FunctionsSection`, `TypesSection`. Read every file before moving it. Relevant for Step 1.
- ::READ `$ART_MD_WEB/src/lib/routes.ts` (Source) — The route helpers the breadcrumbs receive as props; `DOCS_ROOT = '/docs/api'`. Relevant for Steps 1–2.
- ::READ `$ART_MD_WEB/src/lib/meta.ts` (Source) — Defines `DocsResolveLink`, the type the sections import; the package must define it locally because this file stays in the app. Relevant for Step 1.
- ::READ `$ART_MD_WEB/src/styles/global.css` (Source) — The block deleted from the app after the package's copy takes over. Relevant for Step 2.
- ::READ `$PACKAGE/src/index.ts` and `$PACKAGE/test/astro/` (Source) — The barrel and fixture from the previous iteration; extend the fixture to render `DocsBreadcrumbs` (with sample route-helper props) and `EntitiesSection` (one dummy `{ href, label }` entry), which this iteration brings into the package. Relevant for Step 1.
- ::READ `../plan.md` (Structure) — Scope, component inventory, and the byte-identical and JSDoc-coverage validation contract. Relevant for verification.
- ::READ `$WORKSPACE/checkouts/ops/knowledge/design/manifest-policy.md` (Conventions) — The `file:` link for the unpublished package is the policy-compliant form. Relevant for Step 2.
- ::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Allowed commit types, scopes, and message format. Relevant for both commits.
- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment. Operation of Workflow: Executing Work, defined in `$DOMAINS/work/workflows/executing-work/setting-up/operation.art`.

**Instructions:** (From `$PROJECT/_guide.md` and `$NOODLESTAN_WEB/_guide.md`)

Run `npm ci` from the `$PROJECT` and `$NOODLESTAN_WEB` roots.

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
npm run build # runs fetch-meta (or extract), then a full static build
npm run lint # prettier check — MUST run AFTER build
```

---

## Changes

This section summarises the changes to be made in this iteration.

- Step 1 / 6 — Move the five sections into the package
- Step 2 / 6 — Parameterise the breadcrumbs
- Step 3 / 6 — Commit A: the package side
- Step 4 / 6 — Re-point the Art MD Website
- Step 5 / 6 — Verify byte-identical output and JSDoc coverage
- Step 6 / 6 — Commit B: the consumer side

## Steps

This section contains the detailed steps to execute, including commit steps.

### Step `1 / 6` — Move the five sections into the package

1. `git mv` the five files from `$ART_MD_WEB/src/components/docs/` into `$PACKAGE/src/components/` (the directory goes away entirely from the app).
2. Fix the moved files' imports: the app-relative `../../lib/meta` type import disappears — define the type **in the package** instead: add `export type DocsResolveLink = (target: string) => { text: string; href: string } | undefined;` (in a `src/types.ts`, re-exported by the barrel) with identical shape to the app's. Everything else the sections import (`@purrtrait/astro-components` components, `@purrception/lang-ts` types) already resolves from the package manifest.
3. Extend the barrels: `src/components/index.ts` exports the five components by name; `src/index.ts` re-exports `./components` and `./types` — the model's shape, which `tsc --noEmit` already accepts.
4. RULE: `src/lib/meta.ts` and `src/lib/routes.ts` **stay in the app** — the package receives `resolveLink` and route helpers as props, never as imports.

### Step `2 / 6` — Parameterise the breadcrumbs

Rewrite `DocsBreadcrumbs.astro` props to `{ docsRoot: string; apiRoot: string; packageHref: (pkg: string) => string; moduleHref: (pkg: string, mod: string) => string; }` plus the existing `pkg`/`mod`/`type`/`ent` values. Replace the hard-coded `/docs` and `/docs/api` anchors with `docsRoot`/`apiRoot`, and the `../../lib/routes` imports with the injected functions.

RULE: `grep -rn "'/docs" $PACKAGE/src` returns nothing after this step — route knowledge lives only in the consumer.

### Step `3 / 6` — Commit A: the package side

Verify first: `npm run ci` from `$NOODLESTAN_WEB` (lint over the extended barrel, fixture build, test) — all green.

---

#### Commit: `extract-docs-sections`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(astro-docs): Add the docs sections extracted from art-md-web.
```

RULE: Commit from the `$NOODLESTAN_WEB` root on branch `main`, and stage only `$PACKAGE/**` and `$NOODLESTAN_WEB/package-lock.json`. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

### Step `4 / 6` — Re-point the Art MD Website

**Baseline first** — before touching anything, build and capture the reference output:

```bash
cd $ART_MD_WEB && npx astro sync && npm run build
cp -r dist /tmp/docs-before
```

Then:

1. Add to `$ART_MD_WEB/package.json` dependencies: `"@noodlestan/astro-docs": "file:../../../noodlestan-web/packages/astro-docs"` — unpublished, so a `file:` link is the policy-compliant form — and run `npm install` from `$PROJECT`. RULE: no other dependency changes.
2. The three pages (`[ns]/[pkg].astro`, `[ns]/[pkg]/[mod].astro`, `[ns]/[pkg]/[mod]/[type]/[ent].astro`) import the five components from `@noodlestan/astro-docs` instead of `../components/docs/…`, and pass breadcrumbs: `docsRoot="/docs"`, `apiRoot="/docs/api"` (literal — `DOCS_ROOT` is declared without `export` in `src/lib/routes.ts` and this step forbids editing it; the literal is ratified, route knowledge still lives in the consumer exactly as the `docsRoot` literal does), `packageHref`, `moduleHref` — the app keeps its own route knowledge.
3. `src/layouts/PageLayout.astro`: add `import '@noodlestan/astro-docs/global.css';` immediately after the existing `@noodlestan/astro-components/global.css` import.
4. Delete `$ART_MD_WEB/src/components/docs/` (the directory is now empty) and remove the Purrtrait docs block from `$ART_MD_WEB/src/styles/global.css` — from the `/* --- Purrtrait docs rendering --- */` marker to the end of the file; the package's copy, now imported by PageLayout, owns those rules.
5. RULE: `src/lib/meta.ts` and `src/lib/routes.ts` are unchanged — `createDocsResolveLink` keeps feeding `resolveLink` props.

### Step `5 / 6` — Verify byte-identical output and JSDoc coverage

```bash
cd $ART_MD_WEB && npx astro sync && npm run build && npm run lint
```

All MUST pass. Then:

1. **Byte-identical, as amended 2026-11-06 (ratified by the user):** three move-inherent classes are normalized away, because a component move provably produces them without changing visible output —
   (a) `data-astro-cid-*` — Astro derives the style-scope id from the component's file path; the `<style>` content itself is byte-identical,
   (b) `SiteFooter.HASH.css` asset hashes — the original `sed` pattern stopped at the dot and could not match `name.HASH.ext` (a normalization defect, not a content change),
   (c) external chunk vs inline `<style>` — the package's stylesheet crosses Astro's `inlineStylesheets: 'auto'` threshold when its import source moves; same rules, different emission.
   Normalize each side with the same script, then diff:
   ```bash
   normalize() {
     sed -E 's#/_astro/[^"]*\.(css|js)#/_astro/ASSET.\1#g; s/data-astro-cid-[a-z0-9]+/data-astro-cid-CID/g' "$1" \
       | perl -0pe 's#<style>.*?</style>##gs'
   }
   find dist -name '*.html' | while read f; do
     mkdir -p "/tmp/after/$(dirname "$f")"
     normalize "$f" > "/tmp/after/$f"
   done
   # /tmp/docs-before-normalized was produced from the pre-move build with the same normalize()
   diff -r /tmp/docs-before-normalized /tmp/after
   ```
   Zero differences required after this normalization — that empty diff PLUS the coverage checks in items 2–3 below is the acceptance criterion for the three ratified classes; do not re-litigate them. Any delta **outside** those three classes = REPORT A BLOCKER with the diff — do not proceed to the commit.
2. **JSDoc coverage** (count parity, not spot checks): every function in `src/data/meta.json` carrying `paramTags` has a rendered `jsdoc-params` block in `dist` (count them); `ParserConfig`'s member descriptions render; the `config` module description renders with `{@link …}` as `/docs/api/...` anchors.
3. `grep -rn "'/docs" $NOODLESTAN_WEB/packages/astro-docs/src` returns nothing; `grep -rn "components/docs" $ART_MD_WEB/src` returns nothing.

### Step `6 / 6` — Commit B: the consumer side

---

#### Commit: `repoint-art-md-docs`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
refactor(art-md-web): Consume `@noodlestan/astro-docs`.
```

RULE: Commit from the `$PROJECT` root on branch `main`, and stage only the three pages, `src/layouts/PageLayout.astro`, `src/styles/global.css`, the deleted `src/components/docs/` directory, `$PROJECT/apps/art-md-web/package.json`, and `$PROJECT/package-lock.json`. Nothing else may be staged.

RULE: The commit message MUST be used verbatim. Do not add, remove, or reword any line.

---

## Final Verification

This section describes how to confirm the iteration is completed and ready for being committed.

**Instructions:**

- Verify that commits have been executed and pushed (or not pushed) according to the commit's policy — both commits are created and NOT pushed.
- Verify `$ART_MD_WEB/src/components/docs/` no longer exists and no app file imports `components/docs`.
- Verify `$PACKAGE/src` contains the five sections, exports them from the barrel, and contains no `/docs` literal.
- Verify the normalized HTML diff between the pre-move build and the post-move build is empty, and the JSDoc count-parity checks from Step 5 pass.
- Verify `$PROJECT/apps/art-md-web/package.json` gained only the one `file:` entry.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
