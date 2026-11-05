# Guide: Art MD Website

The `apps-art-md-web` demos Art MD features and hosts its documentation. It's an Astro-based static website deployed to production on AWS S3 with CloudFront.

## Recommended Reading

Agents SHOULD scan these files for definitions and resource locations when faced with uncertainty or ambiguity that may result from missing resources.

- `_guide.md` — this file: package overview, layout, and operating instructions.
- `README.md` — package readme.

## Package Layout

```
astro.config.mjs      — Astro config; `NO_EXTERNAL` for the raw-TypeScript docs chain.
public/               — Public assets
scripts/              — `fetch-meta.mjs` — downloads the pinned `dist/meta.json` from the npm endpoint into `src/data/`.
src/
- assets/             — Importable assets.
- components/
  - docs/             — Docs sections: `DocsBreadcrumbs`, `EntitiesSection`, `EntitySummary`, `FunctionsSection`, `TypesSection`.
  - demos/, pages/, site/
- content.config.ts   — Collection fed by `src/data/meta.json`.
- data/               — `meta.json` — synced extraction output (gitignored).
- lib/                — `routes.ts` route helpers; `meta.ts` `{@link …}` resolver.
- layouts/
- pages/
- styles/             — Purrtrait consumer styles (`.shiki` mapping, `.code-block`, `.jsdoc-*`, `.tags`).
```

## Documentation Rendering

The API reference under `/docs/api` (`DOCS_ROOT` in `src/lib/routes.ts`) renders through the
Purrtrait stack. Every dependency below is an exact npm pin — no `file:` links remain in
`package.json`:

| Dependency                       | Version  | Role                                                                                          |
| -------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `@purrtrait/astro-components`    | `0.0.1`  | `CodeBlock.astro` (highlighted declaration code) and `JsDocBlock.astro` (descriptions).       |
| `@purrtrait/code-renderer`       | `0.0.11` | Declaration serialization behind `CodeBlock.astro`.                                           |
| `@purrtrait/jsdoc-renderer`      | `0.0.2`  | JSDoc descriptions, tags, params, and returns behind `JsDocBlock.astro`.                      |
| `@purrtrait/lang-ts`             | `0.0.12` | TypeScript layout and language id for the renderers.                                          |
| `@noodlestan/purrfiles-entities` | `0.0.1`  | Entity types, `createMetaService`, and the canonical `getEntityTypes` / `getEntityFunctions`. |
| `@purrception/lang-ts`           | `0.1.1`  | Declaration and JSDoc node types (raw TypeScript).                                            |
| `shiki`                          | `4.5.0`  | Build-time syntax highlighting.                                                               |
| `marked`                         | `18.1.2` | Descriptions render as markdown.                                                              |

- `EntitySummary.astro`, `FunctionsSection.astro`, and `TypesSection.astro` import
  `@purrtrait/astro-components/components/CodeBlock.astro` and `.../JsDocBlock.astro`
  directly; JSDoc rendering is never reimplemented locally.
- `src/lib/signature.ts` is deleted — there is no local signature helper. Typed symbol
  access uses `getEntityTypes` / `getEntityFunctions` from `@noodlestan/purrfiles-entities`.
- `src/lib/meta.ts` exports `createDocsResolveLink`, which wires
  `createMetaService(...).resolveLink` so `{@link …}` targets become `/docs/api/...` anchors.
  Targets naming declared symbols render as plain text until symbol-level entities exist.
- **`astro.config.mjs` `noExternal` rule:** the packages above ship raw TypeScript with
  bundler-style imports, which the Node ESM loader rejects under `node_modules`.
  `NO_EXTERNAL = [/^@purrtrait\//, '@noodlestan/purrfiles-entities', '@purrception/lang-ts']`
  is therefore applied in `vite.ssr.noExternal`, `vite.environments.astro.resolve.noExternal`,
  and `vite.environments.prerender.resolve.noExternal` — `astro sync` runs in `astro` and
  static route generation runs in `prerender`; neither inherits the top-level `ssr` block.
  Any new raw-TS dependency must be added to `NO_EXTERNAL`, not per-environment.
- Only `module` entities render; `components` and `props` entities, in-code symbol links,
  docs search, and the docs sidebar are follow-on plans in `$PROJECT/_backlog/4-next/`.

## Records Management

Records are co-located with the resources they describe in `_records/` directories:

- **Package:** `_records/package.art`
- **Deployment:** `_records/static-web-deployment.art`

## Knowledge References

This package does not maintain a dedicated knowledge reference.

## Conventions

This package follows strict conventions.

::READ `../../_guide.md` for repository-wide conventions.

## Workflows

| Workflow / Path                                                       | Purpose                                          |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| **Deploying** `$DOMAINS/deployments/workflows/deploying/workflow.art` | Organizes deployment of artefacts in operations. |

## Operating Instructions

### Operating Instructions: Setting Up

**Instructions:**

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Operating Instructions: Verifying Step

**Instructions:**

Run from this package directory:

```bash
npm run lint:fix # to fix formatting issues automatically
npm run lint # to report other issues
npm run build # to produce a full build
```

### Operating Instructions: Deploying Artefacts

**Instructions:**

Execute the **Deploying:** instructions of Deployment Command: Static Web AWS CLI `$DOMAINS/packages/_records/deployment-commands/static-web-aws-cli.art` with:

- deployment record: `_records/deployment-infrastructure.art`.
- environments: `_records/production-environment.art`, `_records/staging-environment.art`.
