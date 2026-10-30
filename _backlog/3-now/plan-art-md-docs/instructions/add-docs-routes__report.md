# Sub-Agent REPORT (#producer)

**Plan:** `art-md-docs`

**Iteration Id:** `add-docs-routes`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                               | Result                                                                                                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/docs/{ns}/{pkg}` package page listing its modules                | Added `$ART_MD_WEB/src/pages/docs/[ns]/[pkg].astro`; generated from the `packages` collection.                                            |
| `/docs/{ns}/{pkg}/{mod}` module page with functions and types      | Added `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod].astro`; generated from `entities` restricted to `module`.                              |
| `/docs/{ns}/{pkg}/{mod}/{type}/{ent}` entity page with type switch | Added `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod]/[type]/[ent].astro`; only `module` rendered in v1.                                     |
| Type signature renderer (shallow, documented fallback)             | Added `$ART_MD_WEB/src/lib/signature.ts` with `renderType`, `renderFunctionSignature`, and narrowing helpers.                             |
| Five docs section components (no `getCollection` calls)            | Added `DocsBreadcrumbs`, `EntitySummary`, `EntitiesSection`, `FunctionsSection`, `TypesSection` under `$ART_MD_WEB/src/components/docs/`. |

#### Files changed

- `$ART_MD_WEB/src/lib/signature.ts` — local structural `TypeNode` types; renders `primitive`, `ref`, `array`, `union`, `intersection`, `literal`, `object`, `function` to text, unknown kinds fall back to their kind name; `toDeclaredFunction` / `toDeclaredType` narrow the schema's `unknown` declared symbols.
- `$ART_MD_WEB/src/components/docs/DocsBreadcrumbs.astro` — docs trail (package / module / entity), links built via `packageHref` and `moduleHref`.
- `$ART_MD_WEB/src/components/docs/EntitySummary.astro` — renders the description only when present.
- `$ART_MD_WEB/src/components/docs/EntitiesSection.astro` — sub-entity list; hides itself when empty (empty for all four v1 modules).
- `$ART_MD_WEB/src/components/docs/FunctionsSection.astro` — declared functions with rendered signatures.
- `$ART_MD_WEB/src/components/docs/TypesSection.astro` — public and private declared types; object types list their members.
- `$ART_MD_WEB/src/pages/docs/[ns]/[pkg].astro` — package page; paths from `packages` collection, entry passed via props, `ns`/`pkg` via `packageParts`.
- `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod].astro` — module page; sub-entities filtered to non-`module` entries of the same module (empty in v1), functions filtered by the module's own `functions` list.
- `$ART_MD_WEB/src/pages/docs/[ns]/[pkg]/[mod]/[type]/[ent].astro` — entity page; module segment is `module ?? name`; unknown types render an in-page not-found branch; unknown paths are never generated and fall through to `404.astro`.

### Verification

- `$ART_MD` `npm run ci` — 12/12 turbo tasks successful (rebuilds `$ENTITIES/dist/`, regenerates meta).
- `$ARTIFICIALS` `npm ci` — clean install.
- `$ART_MD_WEB`: `npm run lint:fix` (5 files auto-fixed), `npx astro sync` (422ms types generated), `npm run build` (14 pages built), `npm run lint` (prettier clean — ran after build, as required).
- Build output confirms the three routes: `dist/docs/art-md/parser/index.html`, `dist/docs/art-md/parser/parse/index.html`, `dist/docs/art-md/parser/parse/module/parse/index.html` exist.
- `dist/docs/art-md/parser/config/index.html` lists `createDefaultParserConfig` and `ParserConfig`; `dist/docs/art-md/parser/parse/index.html` lists `parse`.
- All four module pages omit the Entities section (no `Entities</h2>` in their output); no `getCollection` in `$ART_MD_WEB/src/components/docs/`; `$ART_MD_WEB/src/pages/404.astro` untouched.
- Pre-commit hook (lefthook: clean → extract → full `ci`) passed on its own; no `--no-verify` used.

### Commits

- `d186036` — `build(art-md-web): Add docs package, module, and entity routes.` — created in `$ARTIFICIALS` on `main`; NOT pushed, per commit policy `NOPUSH`.

## Blockers (if any)

None.
