// @ts-check
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';

import { ENDPOINTS } from './src/constants';

// https://astro.build/config
export default defineConfig({
	site: ENDPOINTS['art-md'].site,
	integrations: [mdx(), solid()],
});
