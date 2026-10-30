import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineCollection, z } from 'astro:content';

import { createMetaService } from '@noodlestan/purrfiles-entities';
import type { PurrfilesEntityData } from '@noodlestan/purrfiles-entities';

const metaFile = fileURLToPath(new URL('./data/meta.json', import.meta.url));

type MetaFile = { entities: PurrfilesEntityData[] };

const readMeta = (): MetaFile => JSON.parse(readFileSync(metaFile, 'utf8')) as MetaFile;

const entities = defineCollection({
	loader: () =>
		readMeta().entities.map(entity => ({
			...entity,
			id: `${entity.package}/${entity.type}/${entity.name}`,
		})),
	schema: z.looseObject({
		type: z.string(),
		name: z.string(),
		package: z.string(),
		module: z.string().optional(),
		path: z.string(),
		description: z.string().optional(),
		functions: z.array(z.string()).optional(),
		symbols: z.looseObject({
			imported: z.record(z.string(), z.unknown()).optional(),
			declared: z.record(z.string(), z.unknown()),
		}),
	}),
});

const packages = defineCollection({
	loader: () => {
		const { entities: all } = readMeta();
		const meta = createMetaService(all);

		return meta.getPackageNames().map(pkg => ({
			id: pkg,
			package: pkg,
			moduleNames: meta.getPackageModuleNames(pkg),
			entityCount: all.filter(entity => entity.package === pkg).length,
		}));
	},
	schema: z.object({
		package: z.string(),
		moduleNames: z.array(z.string()),
		entityCount: z.number().int().nonnegative(),
	}),
});

export const collections = { entities, packages };
