// @ts-check
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';

import { ENDPOINTS } from './src/constants';

// Raw-TypeScript workspace packages: bundler-style imports only, so every
// environment that can load them must run them through Vite's transform.
const NO_EXTERNAL = [/^@purrtrait\//, '@noodlestan/purrfiles-entities', '@purrception/lang-ts'];

// https://astro.build/config
export default defineConfig({
	site: ENDPOINTS['art-md'].site,
	integrations: [mdx(), solid()],
	vite: {
		ssr: {
			// The purrtrait and purrfiles packages ship raw TypeScript with
			// bundler-style imports (directory index, extensionless). Leave them to
			// Node and the ESM loader rejects them — force them through Vite's transform.
			noExternal: NO_EXTERNAL,
		},
		environments: {
			// `astro sync` loads content.config.ts through the runnable `astro`
			// environment and static route generation runs in `prerender` — neither
			// inherits the top-level `ssr` block above.
			astro: { resolve: { noExternal: NO_EXTERNAL } },
			prerender: { resolve: { noExternal: NO_EXTERNAL } },
		},
	},
});
