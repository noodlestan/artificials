# Sub-Agent REPORT (#worker)

**Plan:** `integrate-purrtrait-and-shiki`

**Iteration Id:** `retire-file-links`

**Outcome:** `BLOCKER`

## Evidence

### Changes

| Iteration instruction step                                                             | Result                                                                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Replace the `file:../../../art-md/libs/purrfiles-entities` entry with an exact version | Done — `"@noodlestan/purrfiles-entities": "0.0.1"`.                                                                             |
| `npm ci` from `$PROJECT`                                                               | Done — pitfall reproduced (silent symlink reinstall) and worked around; lockfile now carries registry `resolved` + `integrity`. |
| Sweep all manifests under `$WORKSPACE/checkouts/*/` for `file:` entries; confirm zero  | Done — 82 manifests scanned (excluding `node_modules`, `dist`) → **0** `file:` entries.                                         |
| Drop the temporary-exception decisions                                                 | Delegator scope, not the worker's — executed by the delegator alongside this report.                                            |

#### Files changed

- `apps/art-md-web/package.json` — `@noodlestan/purrfiles-entities` swapped from `file:../../../art-md/libs/purrfiles-entities` to the exact npm pin `0.0.1`.
- `package-lock.json` — registry `resolved` + `integrity` entries for `@noodlestan/purrfiles-entities@0.0.1`; no `link: true` remains for it.

Registry-resolution proof (`npm ls` from `$PROJECT`, no `->` arrows except the workspace self-link):

```text
└─┬ apps-art-md-web@0.0.2 -> ./apps/art-md-web
  ├── @noodlestan/purrfiles-entities@0.0.1
  ├─┬ @purrtrait/astro-components@0.0.1
  │ └─┬ @purrtrait/lang-ts@0.0.12 deduped
  └── @purrtrait/lang-ts@0.0.12
```

Verification from `$ART_MD_WEB`: `npm run lint:fix` PASS · `npx astro sync` FAIL · `npm run build` FAIL · `npm run lint` PASS (see Blockers).

## Blockers (if any)

`npx astro sync` and `npm run build` failed with `Stripping types is currently unsupported for files under node_modules, for …/node_modules/@purrception/lang-ts/src/index.ts`.

Causality proven by the worker: with the old `file:` link recreated the same commands pass; with the physical registry install they fail. `@noodlestan/purrfiles-entities` being a real `node_modules` package now makes Vite externalize it during content-config loading, so Node natively imports it, its static `import … from "@purrception/lang-ts"` hits `@purrception/lang-ts@0.1.1` (whose `main` is raw `./src/index.ts`), and Node refuses to type-strip `.ts` under `node_modules`. `astro.config.mjs` already carried `vite.ssr.noExternal: [/^@purrtrait\//, '@purrception/lang-ts']` for this class of problem, but `purrfiles-entities` was previously outside `node_modules` (auto-processed) and had to be added.

No package.json-only route exists: `@purrception/lang-ts@0.1.1` is the latest release and ships no `dist`; `--experimental-transform-types` / `--experimental-strip-types` were both tested and do not bypass the restriction; overrides and aliases cannot change externalization.

**Resolution (outside the worker's declared scope):** the delegator/user authorized the fix and landed it as `de9c6ed` — `apps/art-md-web/astro.config.mjs` adds `@noodlestan/purrfiles-entities` to `noExternal` and mirrors it onto the `astro` and `prerender` environments (the two environment scopes the worker's proposal did not know it needed). Build re-verified green (15 pages). The worker's manifest work was then committed as `841336f` `build(art-md-web): Pin purrfiles-entities and retire file links.` — `NOPUSH`, never pushed.

## Feedback

### For the planner

- The instruction "replace `file:` with an exact version" does not mention that a physical install changes Vite's externalization graph; the next plan that retires a cross-repo `file:` link should call out the `noExternal` consequence (or the iteration's Changes should list it as a candidate follow-up).
- The recorded `## Feedback` pitfall (`npm ci` silently reinstating stale `file:` links) was exactly right and saved a wasted cycle — worth promoting from feedback to instruction text in future retire-link iterations.
- "Sweep and confirm zero" is a good verification step: cheap, unambiguous, and it surfaced `apps/art-md-web` as the only offender.

### For the technical writers

- The temporary-exception decision lived in two plans at once (`plan-integrate-purrtrait-and-shiki` and `plan-art-md-docs`); both had to be edited to retire it. Cross-plan decisions drift — a single owned decision record would avoid that.
- Historical instruction/report files still quote the old `file:` specs; they read as history, but a reader skimming them can mistake them for current state.

### For the crew

- `npm ci` exiting 0 on a manifest/lockfile mismatch remains the sharpest edge in this workspace: the failure mode is silent staleness, not an error.
- `npm ls` output with `->` arrows is the fastest proof of registry vs. workspace resolution; worth wiring into the standard verification.
- Two sessions shared the `$PROJECT` working tree during this run (`_backlog/4-next/plan-distribute-meta-json` was modified concurrently); staging must stay file-scoped or an integration commit can sweep someone else's work.
