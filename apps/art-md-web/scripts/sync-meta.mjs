import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const source = path.resolve(appRoot, '../../../art-md/libs/parser/dist/meta.json');
const target = path.resolve(appRoot, 'src/data/meta.json');

await mkdir(path.dirname(target), { recursive: true });
await copyFile(source, target);

const { size } = await stat(target);
console.info(`Synced: ${target} (${size} bytes)`);
