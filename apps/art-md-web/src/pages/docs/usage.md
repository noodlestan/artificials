---
layout: ../../layouts/PageLayout.astro
title: Usage
description: Parse and serialize Art MD documents, and choose between the codec and calling the parser and serializer directly.
---

# Usage

Art MD content travels in both directions: markdown in, an `ArtDocument` out, and
markdown back again. This page shows the round trip and when to reach for the codec
versus calling the parser and serializer directly. Start with
[Getting Started](/docs/getting-started) if the packages are not installed yet.

## The round trip with the codec

```ts
import { createArtCodec } from '@art-md/codec';

const codec = createArtCodec();

const { document } = codec.parse('# Hello World\n');
const { content } = codec.serialize(document);
```

`createArtCodec()` returns one object with both halves wired to the default construct
registries from `@art-md/constructs`. `parse` takes markdown and returns
`{ document, context }`; `serialize` takes the document back and returns
`{ content, context }`, where `content` is the written markdown. The example above
round trips back to the original source.

## Codec or parser plus serializer

Reach for `createArtCodec` when a document must travel both directions with the
default construct registries already wired. Call `parse` and `serialize` directly
when only one half of the trip is needed, or when each side is configured on its
own:

```ts
import { createDefaultParserConfig, parse } from '@art-md/parser';
import { createDefaultSerializerConfig, serialize } from '@art-md/serializer';

const source = '# Hello World\n';

const { document } = parse(source, createDefaultParserConfig());
const { content } = serialize(document, createDefaultSerializerConfig());
```

Both routes accept configuration: `createArtCodec({ parserConfig, serializerConfig, factories })`
takes partial overrides that fall back to the defaults from `@art-md/constructs`,
while the direct calls take the full `ParserConfig` and `SerializerConfig` of their
own packages.

## API reference

- [codec](/docs/api/art-md/codec) — `createArtCodec` and its config types.
- [parser](/docs/api/art-md/parser) — `parse`, `createDefaultParserConfig`, `ParserConfig`.
- [serializer](/docs/api/art-md/serializer) — `serialize`, `createDefaultSerializerConfig`, `SerializerConfig`.

## Next steps

- [Getting Started](/docs/getting-started) — install the packages and run a first parse.
- [Integrations](/docs/integrations) — sibling projects in the Noodlestan ecosystem.
