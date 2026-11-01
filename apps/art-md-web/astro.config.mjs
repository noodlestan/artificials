// @ts-check
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';

import { ENDPOINTS } from './src/constants';

// https://astro.build/config
export default defineConfig({
	site: ENDPOINTS['art-md'].site,
	integrations: [mdx(), solid()],
	vite: {
		ssr: {
			// The purrtrait packages ship raw TypeScript with bundler-style
			// imports (directory index, extensionless). Leave them to Node and
			// the ESM loader rejects them — force them through Vite's transform.
			noExternal: [/^@purrtrait\//, '@purrception/lang-ts'],
		},
	},
});
