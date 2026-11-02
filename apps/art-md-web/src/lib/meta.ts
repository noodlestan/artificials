import { createMetaService } from '@noodlestan/purrfiles-entities';
import type { PurrfilesEntityData } from '@noodlestan/purrfiles-entities';

import { entityHref } from './routes';

export type DocsResolveLink = (target: string) => { text: string; href: string } | undefined;

/**
 * Builds the `{@link …}` resolver the docs components receive.
 *
 * The meta service resolves a target expression to an entity; `makeEntityHref`
 * maps that entity onto the docs route so links become `/docs/api/...` anchors.
 * Symbols get no fragment anchor in v1; the display name still shows the symbol.
 */
export function createDocsResolveLink(entities: PurrfilesEntityData[]): DocsResolveLink {
	const meta = createMetaService(entities, {
		makeEntityHref: (entity, _symbol) =>
			entityHref(entity.package, entity.module ?? entity.name, entity.type, entity.name),
	});

	return target => {
		const hit = meta.resolveLink(target);
		return hit ? { text: hit[0], href: hit[1] } : undefined;
	};
}
