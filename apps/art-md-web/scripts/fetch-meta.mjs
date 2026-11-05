import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { metaDocs } from '../meta-docs.config.mts';

const target = fileURLToPath(new URL('../src/data/meta.json', import.meta.url));

const metas = [];
for (const { package: pkg, version } of metaDocs.packages) {
	const url = metaDocs.endpoint.replaceAll('{package}', pkg).replaceAll('{version}', version);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Fetch failed: ${url} (${response.status} ${response.statusText})`);
	}

	const meta = await response.json();
	if (!Array.isArray(meta.entities)) {
		throw new Error(`Invalid meta, expected an entities array: ${url}`);
	}

	console.info(`Fetched ${pkg}@${version}: ${meta.entities.length} entities from ${url}`);
	metas.push(meta);
}

const entities = metas.flatMap(meta => meta.entities);

await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, JSON.stringify({ entities }, null, 2));

const { size } = await stat(target);
console.info(`Merged ${entities.length} entities into ${target} (${size} bytes)`);
