# Instructions: `add-docs-index`

**Plan:** `art-md-docs`

**Iteration Id:** `add-docs-index`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-md-docs/instructions/add-docs-index__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-docs-index`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                      | Purpose                         |
| -------------- | ---------------------------------- | ------------------------------- |
| `$WORKSPACE`   | Current working directory          | Workspace root directory        |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains`       | Templates for the worker report |
| `$SKILLS`      | `$WORKSPACE/.agents/skills`        | Worker skill file               |
| `$ARTIFICIALS` | `$WORKSPACE/checkouts/artificials` | Website monorepo                |
| `$ART_MD`      | `$WORKSPACE/checkouts/art-md`      | Extraction monorepo             |
| `$ART_MD_WEB`  | `$ARTIFICIALS/apps/art-md-web`     | Astro application to modify     |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-docs-index`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Ship the first visible docs surface: a `/docs` page that lists every package in the `packages` collection, with module and entity counts and a link per package, plus a `Docs` entry in the site navigation.

Iteration: Create Docs Collections already loaded `$META` into the `entities` and `packages` collections and added the `packageHref`, `moduleHref`, and `entityHref` helpers in `$ART_MD_WEB/src/lib/routes.ts`. This iteration only reads them.

Package links point at `/docs/{ns}/{pkg}`, which resolves to nothing until Iteration: Add Docs Routes ships the package page. The `/docs` page and its links MUST render now; the targets are expected to 404 until then.

## Mandatory Reading

- `$ART_MD_WEB/_guide.md` — package overview, layout, and verification commands.
- `$ART_MD_WEB/src/content.config.ts` — the `packages` collection: `package`, `moduleNames`, `entityCount`.
- `$ART_MD_WEB/src/lib/routes.ts` — `packageHref` for the per-package link.
- `$ART_MD_WEB/src/layouts/PageLayout.astro` — the page shell and its `content` prop.
- `$ART_MD_WEB/src/components/site/SiteNav.astro` — the navigation to extend.
- `$ART_MD_WEB/src/pages/404.astro` — the smallest Astro page in the site; follow its structure.
- `$ART_MD_WEB/src/pages/index.md` — frontmatter shape for pages using a layout.
- `$WORKSPACE/node_modules/@noodlestan/astro-components/src/styles/global.css` — `.main-section` and `.markdown` layout and typography.
- `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/` — reference index, package, and module page layouts.
- `$ARTIFICIALS/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$ART_MD_WEB/_guide.md`)

Run from `$ART_MD` — the canonical check, which rebuilds `$ENTITIES/dist/` and regenerates `$META` (the website links the package's build output, and turbo runs `extract` after `build`):

```bash
npm run ci
```

Run from `$ARTIFICIALS`:

```bash
npm ci
```

### Writing Commit Message

**Purpose:** Write standardized message according to context conventions.

**Instructions:** (From `$WORKSPACE/_guide.md`)

1. Read commit message conventions from `$WORKSPACE/knowledge/conventions/writing-commit-message.art`.
2. Write the commit message following the rules defined there.

### Verifying Completion

**Purpose:** Confirms the page renders from the `packages` collection and the site still builds.

**Instructions:** (From `$ART_MD_WEB/_guide.md` and `$ART_MD_WEB/package.json`)

Run from `$ART_MD_WEB`:

```bash
npm run lint:fix # to fix formatting issues automatically
npx astro sync # regenerates the collection types
npm run build # runs extract, then a full static build
npm run lint # prettier check — MUST run AFTER build
```

All steps MUST pass. Lint runs last on purpose: `build` regenerates `src/data/meta.json`, and the app-level `prettier . -c` scans it (it is listed in `.prettierignore`, so it passes — but only because of that entry).

---

## Changes

Add the docs index page and its navigation entry.

- Step 1 / 4 — Add the `/docs` index page
- Step 2 / 4 — Add the `Docs` navigation entry
- Step 3 / 4 — Verify the rendered output
- Step 4 / 4 — Commit `add-docs-index`

## Steps

### Step `1 / 4` — Add the `/docs` index page

Create `$ART_MD_WEB/src/pages/docs/index.astro`:

```astro
---
import { getCollection } from 'astro:content';

import PageLayout from '../../layouts/PageLayout.astro';
import { packageHref } from '../../lib/routes';

const packages = (await getCollection('packages')).sort((a, b) =>
	a.data.package.localeCompare(b.data.package),
);

const content = {
	title: 'Docs',
	description: 'API documentation for the Art MD packages, extracted from their source.',
};

const countModules = (moduleNames: string[]) =>
	moduleNames.length === 1 ? '1 module' : `${moduleNames.length} modules`;

const countEntities = (entityCount: number) =>
	entityCount === 1 ? '1 entity' : `${entityCount} entities`;
---

<PageLayout content={content}>
	<h1>Docs</h1>
	<p>
		API documentation extracted from the <code>@art-md</code> packages. Every package lists its
		modules, and every module lists the entities it exports.
	</p>
	{
		packages.length === 0 ? (
			<p>No packages have been extracted yet.</p>
		) : (
			<ul class="package-list">
				{packages.map(pkg => (
					<li>
						<a href={packageHref(pkg.data.package)}>{pkg.data.package}</a>
						<span class="package-counts">
							{countModules(pkg.data.moduleNames)}, {countEntities(pkg.data.entityCount)}
						</span>
					</li>
				))}
			</ul>
		)
	}
</PageLayout>

<style>
	.package-list {
		list-style: none;
		padding-inline-start: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-block-start: 1rem;
	}

	.package-list li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
	}

	.package-counts {
		font-size: var(--text-size-small);
		color: var(--color-content);
		opacity: 0.75;
	}
</style>
```

Notes:

- `getCollection` is async in Astro 7; the page frontmatter is the right place to await it.
- `packageHref('@art-md/parser')` yields `/docs/art-md/parser`. Do not build hrefs by hand — reuse the helpers so the route shape stays in one place.
- Do not render the `entities` collection here; counts come from `packages`.
- Keep the scoped style minimal. The `.markdown` class on `<main>` already supplies typography and spacing from the shared stylesheet.

### Step `2 / 4` — Add the `Docs` navigation entry

Update `$ART_MD_WEB/src/components/site/SiteNav.astro`, adding the entry first in the navigation:

```astro
<nav aria-label="Site pages">
	<a href="/docs">Docs</a>
	<a href="/about">About</a>
	<a href="/codec-demo">Demo</a>
</nav>
```

Do not change the existing scoped `<style>` block, and do not touch `SiteHeader.astro` or `SiteLinks.astro`.

Expected outcome: `Docs` is the first entry in the header navigation on every page.

### Step `3 / 4` — Verify the rendered output

Run the **Verifying Completion** steps, then confirm the built page carries the package list, from `$ART_MD_WEB`:

```bash
grep -c 'href="/docs/art-md/parser"' dist/docs/index.html
```

Expected outcome: the command prints a number greater than `0` and exits `0`. If it prints `0`, confirm `src/data/meta.json` exists (re-run `npm run extract`) and REPORT A BLOCKER.

Note: the link target `/docs/art-md/parser` is expected to 404 until Iteration: Add Docs Routes ships the package page. That is not a defect in this iteration.

### Step `4 / 4` — Commit `add-docs-index`

Run the **Verifying Completion** steps, then commit from `$ARTIFICIALS`.

---

#### Commit: `add-docs-index`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(art-md-web): Add docs index listing packages.
```

---

## Final Verification

**Instructions:**

- Verify that `$ART_MD_WEB/src/pages/docs/index.astro` reads its data from `getCollection('packages')` and builds every href through `packageHref` from `$ART_MD_WEB/src/lib/routes.ts`.
- Verify that the page uses `$ART_MD_WEB/src/layouts/PageLayout.astro` and passes a `content` prop carrying `title` and `description`.
- Verify that the `entities` collection is not read on this page.
- Verify that `$ART_MD_WEB/src/components/site/SiteNav.astro` lists `Docs` first, ahead of `About` and `Demo`.
- Verify that `dist/docs/index.html` exists and contains at least one `/docs/art-md/parser` link.
- Verify that the pre-commit hook passes on its own, without `--no-verify`.
- Verify that commits have been executed and not pushed, according to the commit policy.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
