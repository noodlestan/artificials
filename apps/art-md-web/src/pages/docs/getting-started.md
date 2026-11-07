---
layout: ../../layouts/PageLayout.astro
title: Getting Started
description: Install the Art MD packages and run your first parse.
---

# Getting Started

Art MD ships as five packages on npm under the `@art-md` scope. This page installs
them and runs a first parse; [Usage](/docs/usage) covers the full parse-and-serialize
round trip.

## Install

Install the package you need at its exact current version:

```bash
npm install @art-md/parser@0.0.8
```

| Package              | Version | Role                                                                          |
| -------------------- | ------- | ----------------------------------------------------------------------------- |
| `@art-md/primitives` | `0.0.8` | Base types and utilities shared by every other package.                       |
| `@art-md/constructs` | `0.0.8` | The construct registry: how Markdown is recognised, represented, and written. |
| `@art-md/parser`     | `0.0.8` | Parses markdown into an `ArtDocument`.                                        |
| `@art-md/serializer` | `0.0.7` | Writes an `ArtDocument` back into markdown.                                   |
| `@art-md/codec`      | `0.0.6` | One object that runs both directions with the default registries wired.       |

`@art-md/parser` pulls `primitives` and `constructs` in on its own, so a parse-only
install needs nothing else. Add `@art-md/serializer` when you write back, or reach
for `@art-md/codec` when a document travels both ways — see
[Usage](/docs/usage) for that choice.

Every package's full surface is documented in the [API reference](/docs/api).

## First parse

```ts
import { createDefaultParserConfig, parse } from '@art-md/parser';

const config = createDefaultParserConfig();
const { document } = parse('# Hello World\n', config);
```

`parse` is the entry point of `@art-md/parser`: raw markdown and a config in, a
`ParseResult` out. The result carries `document` — the parsed Art MD AST, shaped
with `construct`, `children`, and `position` — alongside the `context` it was built
from. `createDefaultParserConfig()` wires the standard construct set from
`@art-md/constructs`, so it is the stock starting point.

## Next steps

- [Usage](/docs/usage) — the round trip with the codec, and when to call parser
  and serializer directly.
- [Integrations](/docs/integrations) — sibling projects in the Noodlestan ecosystem.
- [API reference](/docs/api) — generated documentation for all five packages.
