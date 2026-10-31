# Instructions: `add-docs-routes`

**Plan:** `art-md-docs`

**Iteration Id:** `add-docs-routes`

## Before you Start

::switch `agent-worker` — switch to the agent-worker agent mode to execute these instructions. Your mode must be `worker` before you start changing files.

These are your instructions.

RULE: If at any point you are instructed to **REPORT A BLOCKER** or you encounter a commit with `policy` set to `MANUAL` execute the instruction in the "## How to Report Back to the Delegator" section below and STOP processing any other instructions.

## How to Report Back to the Delegator

This section describes how to report back to the delegator after completing the instruction.

1. Summarise the current context, asking: are you reporting completion or a BLOCKER?
2. Gather the evidence of changes made and outcomes achieved, or the blocker error details.
3. Use the `render-template` skill with the `.agents/domains/plans/templates/instructions-report.tart` to render your report and write it next to this instruction file: `plan-art-md-docs/instructions/add-docs-routes__report.md`. No separate delegation record is created.
4. If your prompt included a `DIRECTIVE FEEDBACK:` include the feedback sections in the rendered report.
5. Generate the response and send it back to the delegator.
6. Keep the response terse per the Working Agreements: happy face + up to 3 bullet points (done `add-docs-routes`, created `{artefacts}`, thumbs up). The full trail lives in the report file; never repeat it in chat.

## Path Variables

| Variable       | Resolved Path                      | Purpose                         |
| -------------- | ---------------------------------- | ------------------------------- |
| `$WORKSPACE`   | Current working directory          | Workspace root directory        |
| `$DOMAINS`     | `$WORKSPACE/.agents/domains`       | Templates for the worker report |
| `$SKILLS`      | `$WORKSPACE/.agents/skills`        | Worker skill file               |
| `$ARTIFICIALS` | `$WORKSPACE/checkouts/artificials` | Website monorepo                |
| `$ART_MD`      | `$WORKSPACE/checkouts/art-md`      | Extraction monorepo             |
| `$ART_MD_WEB`  | `$ARTIFICIALS/apps/art-md-web`     | Astro application to modify     |
| `$ENTITIES`    | `$ART_MD/libs/purrfiles-entities`  | Meta service package            |
| `$PURRCEPTION` | `$WORKSPACE/checkouts/purrception` | Language extraction library     |

## Working Agreements

The plan workflow (see the entry point guide → Planning Workflow → Working Together) runs on three working agreements:

1. **This instructions file is self-contained.** Everything you need is in this file plus its mandatory reading — never rely on session memory, chat context, or details relayed by the user.
2. **Your report is mandatory.** The rendered report file carries the full trail: evidence, changes, verification results, blockers, feedback. Your chat response is only a pointer to it.
3. **User interaction is minimal.** The user relays this instructions file to the delegator and expects a light confirmation: a happy face and up to 3 bullet points — done `add-docs-routes`, created `{artefacts}`, thumbs up. If something goes horribly wrong, report the blocker instead of a summary.

## Goals

Complete the docs navigation from package to module to entity: three static routes generated from the collections, plus the section components that render a module's functions and types.

- `/docs/{ns}/{pkg}` — package page listing its modules.
- `/docs/{ns}/{pkg}/{mod}` — module page listing the entities declared in that module and rendering its functions and types.
- `/docs/{ns}/{pkg}/{mod}/{type}/{ent}` — entity page with a type switch; only `module` is rendered in v1.

Two scoping facts, both verified against the extracted data before this instruction was written:

- **v1 has exactly one package and one entity type.** `meta.json` holds `@art-md/parser` with four `module` entities: `buildDocument`, `config`, `mdast`, `parse`. Every route below is generated from that data; do not hard-code it.
- **Module entities carry no `module` field, so no sub-entities exist yet.** `getModuleEntities` returns an empty list for all four modules. The entities section of the module page is therefore written to hide itself when empty. It becomes useful only when the extractor emits non-module entity types; do not delete it, and do not invent sub-entities to fill it.

Rendering signatures is deliberately shallow. Type expressions are reduced to readable text by a local helper covering the kinds present in the data (`primitive`, `ref`, `array`, `union`, `object`, `function`, `literal`) with a documented fallback for anything else. A full type-expression renderer is out of scope.

## Mandatory Reading

- `$ART_MD_WEB/_guide.md` — package overview, layout, and verification commands.
- `$ART_MD_WEB/src/content.config.ts` — the `entities` and `packages` collections.
- `$ART_MD_WEB/src/lib/routes.ts` — `packageHref`, `moduleHref`, `entityHref`, `packageParts`.
- `$ART_MD_WEB/src/layouts/PageLayout.astro` — the page shell and its `content` prop.
- `$ART_MD_WEB/src/components/site/SiteNav.astro` — navigation entry added by the previous iteration.
- `$ART_MD_WEB/src/pages/404.astro` — the not-found page your routes fall through to.
- `$ART_MD_WEB/src/pages/docs/index.astro` — the docs index shipped by Iteration: Add Docs Index; match its structure and scoped-style approach.
- `$ENTITIES/src/createMetaService.ts`, `$ENTITIES/src/entities/helpers/` — `getEntityTypes` and `getEntityFunctions`.
- `$ENTITIES/src/entities/Module/types.ts` — `ModuleEntityData`.
- `$PURRCEPTION/libs/lang-ts/src/declaration/types.ts`, `$PURRCEPTION/libs/lang-ts/src/node/types.ts` — declaration and type-expression shapes your renderer reads.
- `$NO_COMPLY/apps/standard-ui-demo/src/app/screens/ApiScreen/` — reference package, module, and entity page layouts.
- `$ARTIFICIALS/node_modules/@noodlestan/astro-components/src/styles/global.css` — `.main-section` and `.markdown` layout and typography.
- `$ARTIFICIALS/node_modules/@noodlestan/conventions-typescript/art/index.md` — TypeScript conventions.

- RULE: You MUST follow any links under `## Mandatory Reading` sections found in the listed files.
- RULE: If you are unable to read a file linked under `## Mandatory Reading` you must stop and REPORT A BLOCKER.

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

**Purpose:** Confirms all three routes render from the collections and the site still builds.

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

Add the signature renderer, the docs section components, and the three docs routes.

- Step 1 / 6 — Add the type signature renderer
- Step 2 / 6 — Add the docs section components
- Step 3 / 6 — Add the package page
- Step 4 / 6 — Add the module page
- Step 5 / 6 — Add the entity page
- Step 6 / 6 — Commit `add-docs-routes`

## Steps

### Step `1 / 6` — Add the type signature renderer

Create `$ART_MD_WEB/src/lib/signature.ts`. It renders type expressions to text and needs no new dependency: the shapes are declared locally, structurally, rather than imported from `@purrception/lang-ts`, which is not a dependency of the website and ships TypeScript source only.

```ts
export type TypeNode =
  | { kind: 'primitive'; primitive: string }
  | { kind: 'ref'; ref: string }
  | { kind: 'array'; elements: TypeNode }
  | { kind: 'union'; entries: TypeNode[] }
  | { kind: 'intersection'; entries: TypeNode[] }
  | { kind: 'literal'; value: string | number | boolean }
  | {
      kind: 'object';
      members: Record<string, { type: TypeNode; optional?: boolean; readonly?: boolean }>;
    }
  | {
      kind: 'function';
      params?: { name: string; type: TypeNode; optional?: boolean }[];
      returns?: { type: TypeNode };
    }
  | { kind: string };

export type DeclaredFunction = { name: string; node: TypeNode };

export type DeclaredType = { name: string; node: TypeNode; private?: boolean };

function renderParams(params?: { name: string; type: TypeNode; optional?: boolean }[]): string {
  return (params ?? [])
    .map(param => `${param.name}${param.optional ? '?' : ''}: ${renderType(param.type)}`)
    .join(', ');
}

export function renderType(node?: TypeNode): string {
  if (!node) return 'void';

  switch (node.kind) {
    case 'primitive':
      return node.primitive;
    case 'ref':
      return node.ref;
    case 'array':
      return `${renderType(node.elements)}[]`;
    case 'union':
      return node.entries.map(renderType).join(' | ');
    case 'intersection':
      return node.entries.map(renderType).join(' & ');
    case 'literal':
      return typeof node.value === 'string' ? `'${node.value}'` : String(node.value);
    case 'object': {
      const members = Object.entries(node.members).map(
        ([name, member]) =>
          `${member.readonly ? 'readonly ' : ''}${name}${member.optional ? '?' : ''}: ${renderType(member.type)}`,
      );
      return `{ ${members.join('; ')} }`;
    }
    case 'function':
      return `(${renderParams(node.params)}) => ${renderType(node.returns?.type)}`;
    default:
      return node.kind;
  }
}

export function renderFunctionSignature(name: string, node: TypeNode): string {
  if (node.kind === 'function') {
    return `${name}(${renderParams(node.params)}): ${renderType(node.returns?.type)}`;
  }

  return `${name}: ${renderType(node)}`;
}

export function toDeclaredFunction(value: unknown): DeclaredFunction | undefined {
  const declaration = value as { name?: string; node?: TypeNode } | undefined;
  if (!declaration?.name || !declaration.node) return undefined;
  return { name: declaration.name, node: declaration.node };
}

export function toDeclaredType(value: unknown): DeclaredType | undefined {
  const declaration = value as { name?: string; node?: TypeNode; private?: boolean } | undefined;
  if (!declaration?.name || !declaration.node) return undefined;
  return { name: declaration.name, node: declaration.node, private: declaration.private };
}
```

Notes:

- The `default` branch returns the raw `kind` string. That is the documented fallback for type-expression kinds not covered here — unknown types degrade to their kind name instead of throwing.
- `toDeclaredFunction` and `toDeclaredType` exist because the collection schema validates `symbols.declared` as a record of `unknown`. They are the single place that narrows that `unknown`.

### Step `2 / 6` — Add the docs section components

Create five Astro components under `$ART_MD_WEB/src/components/docs/`. All take plain props and render markup only; they read no collections themselves.

`DocsBreadcrumbs.astro` — the navigation trail. Props: `pkg: string`, `mod?: string`, `type?: string`, `ent?: string`.

```astro
---
import { packageHref, moduleHref } from '../../lib/routes';

interface Props {
	pkg: string;
	mod?: string;
	type?: string;
	ent?: string;
}

const { pkg, mod, type, ent } = Astro.props;
---

<nav aria-label="Breadcrumbs">
	<a href="/docs">Docs</a>
	{!mod && <span> / Package</span>}
	{mod && (
		<>
			{' / '}
			<a href={packageHref(pkg)}>{pkg}</a>
		</>
	)}
	{mod && !type && <span> / module</span>}
	{mod && type && (
		<>
			{' / '}
			<a href={moduleHref(pkg, mod)}>{mod}</a>
			<span>
				{' / '}{type}: {ent}
			</span>
		</>
	)}
</nav>

<style>
	nav {
		font-size: var(--text-size-normal);
	}
</style>
```

`EntitySummary.astro` — the module description. Props: `description?: string`. Renders nothing when the description is absent, which is the case for three of the four v1 modules.

```astro
---
interface Props {
	description?: string;
}

const { description } = Astro.props;
---

{description && (
	<section>
		<h2>Summary</h2>
		<p>{description}</p>
	</section>
)}
```

`EntitiesSection.astro` — entities declared inside a module. Props: `entities: { href: string; label: string }[]`. Hides itself when empty.

```astro
---
interface Props {
	entities: { href: string; label: string }[];
}

const { entities } = Astro.props;
---

{entities.length > 0 && (
	<section>
		<h2>Entities</h2>
		<ul>
			{entities.map(entity => (
				<li><a href={entity.href}>{entity.label}</a></li>
			))}
		</ul>
	</section>
)}
```

`FunctionsSection.astro` — the module's declared functions with rendered signatures. Props: `functions: DeclaredFunction[]`.

```astro
---
import { renderFunctionSignature, type DeclaredFunction } from '../../lib/signature';

interface Props {
	functions: DeclaredFunction[];
}

const { functions } = Astro.props;
---

{functions.length > 0 && (
	<section>
		<h2>Functions</h2>
		{functions.map(fn => (
			<section>
				<h3>{fn.name}</h3>
				<pre><code>{renderFunctionSignature(fn.name, fn.node)}</code></pre>
			</section>
		))}
	</section>
)}
```

`TypesSection.astro` — the module's declared types with their members. Props: `types: DeclaredType[]`. Public and private types are listed separately, mirroring the reference implementation.

```astro
---
import { renderType, type DeclaredType } from '../../lib/signature';

interface Props {
	types: DeclaredType[];
}

const { types } = Astro.props;

const publicTypes = types.filter(declType => !declType.private);
const privateTypes = types.filter(declType => declType.private);
---

{publicTypes.length > 0 && (
	<section>
		<h2>Types</h2>
		{publicTypes.map(declType => (
			<section>
				<h3>{declType.name}</h3>
				{declType.node.kind === 'object' ? (
					<ul>
						{Object.entries(declType.node.members).map(([name, member]) => (
							<li>
								<code>{name}{member.optional ? '?' : ''}</code>
								<code>{renderType(member.type)}</code>
							</li>
						))}
					</ul>
				) : (
					<pre><code>{renderType(declType.node)}</code></pre>
				)}
			</section>
		))}
	</section>
)}

{privateTypes.length > 0 && (
	<section>
		<h2>Private Types</h2>
		{privateTypes.map(declType => (
			<section>
				<h3>{declType.name} (private)</h3>
				<pre><code>{renderType(declType.node)}</code></pre>
			</section>
		))}
	</section>
)}
```

Name the local variables `declType`, not `type`: `type` is already a prop name on `DocsBreadcrumbs.astro` and reads ambiguously next to the `type` collection field.

Expected outcome: all five components exist under `$ART_MD_WEB/src/components/docs/`, each with props typed through an `interface Props`, and none of them calls `getCollection`.

### Step `3 / 6` — Add the package page

Create `$ART_MD_WEB/src/pages/docs/[ns]/[pkg].astro`. Generate its paths from the `packages` collection and pass the entry through `props` rather than rebuilding the package name from the URL segments — `@art-md/parser` cannot be reconstructed from `art-md` and `parser` without a scope rule, and the helpers already own that rule.

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';

import DocsBreadcrumbs from '../../../components/docs/DocsBreadcrumbs.astro';
import PageLayout from '../../../layouts/PageLayout.astro';
import { moduleHref, packageParts } from '../../../lib/routes';

interface Props {
	entry: CollectionEntry<'packages'>;
}

export async function getStaticPaths() {
	const packages = await getCollection('packages');

	return packages.map(entry => {
		const { namespace, name } = packageParts(entry.data.package);

		return { params: { ns: namespace, pkg: name }, props: { entry } };
	});
}

const { entry } = Astro.props;
const { package: pkg } = entry.data;

const content = {
	title: pkg,
	description: `Modules exported by ${pkg}.`,
};
---

<PageLayout content={content}>
	<DocsBreadcrumbs pkg={pkg} />
	<h1>{pkg}</h1>
	<section>
		<h2>Modules</h2>
		<ul>
			{entry.data.moduleNames.map(mod => (
				<li><a href={moduleHref(pkg, mod)}>{mod}</a></li>
			))}
		</ul>
	</section>
</PageLayout>
```

### Step `4 / 6` — Add the module page

Create `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod].astro`. Generate its paths from the `entities` collection, restricted to `module` entries, and narrow the declared symbols through the Step 1 helpers.

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';

import DocsBreadcrumbs from '../../../../components/docs/DocsBreadcrumbs.astro';
import EntitiesSection from '../../../../components/docs/EntitiesSection.astro';
import EntitySummary from '../../../../components/docs/EntitySummary.astro';
import FunctionsSection from '../../../../components/docs/FunctionsSection.astro';
import TypesSection from '../../../../components/docs/TypesSection.astro';
import PageLayout from '../../../../layouts/PageLayout.astro';
import { entityHref, packageParts } from '../../../../lib/routes';
import { toDeclaredFunction, toDeclaredType, type DeclaredFunction, type DeclaredType } from '../../../../lib/signature';

interface Props {
	entry: CollectionEntry<'entities'>;
	subEntities: { href: string; label: string }[];
	functions: DeclaredFunction[];
	types: DeclaredType[];
}

export async function getStaticPaths() {
	const modules = await getCollection(
		'entities',
		entry => entry.data.type === 'module',
	);
	const all = await getCollection('entities');

	return modules.map(entry => {
		const { namespace, name } = packageParts(entry.data.package);
		const mod = entry.data.name;

		// v1 modules declare no sub-entities; this stays empty until other entity types exist.
		const subEntities = all
			.filter(candidate => candidate.data.module === mod && candidate.data.type !== 'module')
			.map(candidate => ({
				href: entityHref(entry.data.package, mod, candidate.data.type, candidate.data.name),
				label: `${candidate.data.type}: ${candidate.data.name}`,
			}));

		const declared = entry.data.symbols.declared as Record<string, unknown>;
		const functions = (entry.data.functions ?? [])
			.map(name => toDeclaredFunction(declared[name]))
			.filter((fn): fn is DeclaredFunction => Boolean(fn));
		const types = Object.values(declared)
			.map(toDeclaredType)
			.filter((type): type is DeclaredType => Boolean(type));

		return {
			params: { ns: namespace, pkg: name, mod },
			props: { entry, subEntities, functions, types },
		};
	});
}

const { entry, subEntities, functions, types } = Astro.props;
const { package: pkg, name: mod, description } = entry.data;

const content = {
	title: mod,
	description: description ?? `Module ${mod} of ${pkg}.`,
};
---

<PageLayout content={content}>
	<DocsBreadcrumbs pkg={pkg} mod={mod} />
	<h1>{mod}</h1>
	<EntitySummary description={description} />
	<EntitiesSection entities={subEntities} />
	<FunctionsSection functions={functions} />
	<TypesSection types={types} />
</PageLayout>
```

Notes:

- `functions` is filtered by the module's own `functions` list, so only the functions the extractor attributed to the module are listed; `types` reads every declared type. That mirrors the reference implementation's split between helpers and types.
- The `entities` collection schema uses `z.looseObject`, so `symbols` survives validation, but its `declared` values are typed `unknown`. `toDeclaredFunction` and `toDeclaredType` are the only narrowing points.

### Step `5 / 6` — Add the entity page

Create `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod]/[type]/[ent].astro`. Only the `module` type is rendered in v1; anything else falls through to a not-found message using the existing `404.astro`.

For a `module` entity the module segment equals the entity name: the entity `parse` of type `module` lives at `/docs/art-md/parser/parse/module/parse`. When the extractor starts emitting entity types that carry a real `module` field, switch to that field for the middle segment.

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';

import DocsBreadcrumbs from '../../../../../../components/docs/DocsBreadcrumbs.astro';
import EntitySummary from '../../../../../../components/docs/EntitySummary.astro';
import FunctionsSection from '../../../../../../components/docs/FunctionsSection.astro';
import TypesSection from '../../../../../../components/docs/TypesSection.astro';
import PageLayout from '../../../../../../layouts/PageLayout.astro';
import { packageParts } from '../../../../../../lib/routes';
import { toDeclaredFunction, toDeclaredType, type DeclaredFunction, type DeclaredType } from '../../../../../../lib/signature';

interface Props {
	entry: CollectionEntry<'entities'>;
	functions: DeclaredFunction[];
	types: DeclaredType[];
}

export async function getStaticPaths() {
	const all = await getCollection('entities');

	return all.map(entry => {
		const { package: pkg, type, name, module } = entry.data;

		// A module entity is its own module; other entity types name theirs explicitly.
		const mod = module ?? name;
		const { namespace, name: pkgName } = packageParts(pkg);

		const declared = (entry.data.symbols?.declared ?? {}) as Record<string, unknown>;
		const functions = (entry.data.functions ?? [])
			.map(declName => toDeclaredFunction(declared[declName]))
			.filter((fn): fn is DeclaredFunction => Boolean(fn));
		const types = Object.values(declared)
			.map(toDeclaredType)
			.filter((declType): declType is DeclaredType => Boolean(declType));

		return {
			params: { ns: namespace, pkg: pkgName, mod, type, ent: name },
			props: { entry, functions, types },
		};
	});
}

const { entry, functions, types } = Astro.props;
const { package: pkg, type, name, description } = entry.data;

// v1 only renders the `module` type; any other type is an unknown page.
const known = type === 'module';

const content = {
	title: `${type}: ${name}`,
	description: description ?? `${type} ${name}.`,
};
---

<PageLayout content={content}>
	{!known ? (
		<>
			<h1>Page not found</h1>
			<p>Entity {pkg}/{type}:{name} is not available yet.</p>
			<p><a href="/docs">Docs home</a></p>
		</>
	) : (
		<>
			<DocsBreadcrumbs pkg={pkg} mod={name} type={type} ent={name} />
			<h1>{name}</h1>
			<EntitySummary description={description} />
			<FunctionsSection functions={functions} />
			<TypesSection types={types} />
		</>
	)}
</PageLayout>
```

Notes:

- `packageParts` owns the scope rule here, exactly as on the package and module pages, so `/docs/art-md/parser` and `/docs/art-md/parser/parse/module/parse` agree on the `ns`/`pkg` pair.
- `getStaticPaths` only emits paths for entities that exist, so an unknown `{ns}/{pkg}/{mod}/{type}/{ent}` is never generated and the static build serves `404.astro`. The in-page branch handles the narrower case where a path exists but its type is not `module`.
- The module entity renders no `EntitiesSection`: a module's sub-entities, if any, are already listed on its module page, which the entity page duplicates section for section.

### Step `6 / 6` — Commit `add-docs-routes`

Run the **Verifying Completion** steps, then commit from `$ARTIFICIALS`.

---

#### Commit: `add-docs-routes`

**Policy:** NOPUSH — Agent MUST create the commit and proceed to the next step but MUST NOT push to the remote repository.

**Message:**

```
build(art-md-web): Add docs package, module, and entity routes.
```

---

## Final Verification

**Instructions:**

- Verify that `$ART_MD_WEB/src/pages/docs/[ns]/[pkg].astro`, `[mod].astro`, and `[mod]/[type]/[ent].astro` exist and each defines `getStaticPaths` fed by `getCollection`.
- Verify that the `ns` and `pkg` segments are derived through `packageParts` (or equivalent) and agree across all three routes, so `/docs/art-md/parser`, `/docs/art-md/parser/parse`, and `/docs/art-md/parser/parse/module/parse` all resolve.
- Verify that every link rendered on the package and module pages is built through `$ART_MD_WEB/src/lib/routes.ts` helpers.
- Verify that the five docs components live under `$ART_MD_WEB/src/components/docs/` and none of them calls `getCollection`.
- Verify that the entities section renders nothing for all four v1 modules, since they declare no sub-entities.
- Verify that `dist/docs/art-md/parser/index.html`, `dist/docs/art-md/parser/parse/index.html`, and `dist/docs/art-md/parser/parse/module/parse/index.html` exist.
- Verify that the module page for `config` lists the `createDefaultParserConfig` function and the `ParserConfig` type, and that `parse` lists the `parse` function.
- Verify that unknown routes are not generated and that `$ART_MD_WEB/src/pages/404.astro` is untouched.
- Verify that the pre-commit hook passes on its own, without `--no-verify`.
- Verify that commits have been executed and not pushed, according to the commit policy.
- Execute the **Verifying Completion** step as defined in the "Operating Instructions" section.
- Report according to the "How to Report Back to the Delegator" instructions.
