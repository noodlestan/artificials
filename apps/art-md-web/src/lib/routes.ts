const DOCS_ROOT = '/docs';

const UNPREFIXED_NAMESPACE = '_';

export type PackageParts = {
	namespace: string;
	name: string;
};

function segment(value: string): string {
	return encodeURIComponent(value);
}

export function packageParts(packageName: string): PackageParts {
	const segments = packageName.split('/');

	if (packageName.startsWith('@') && segments.length === 2) {
		return { namespace: segments[0].slice(1), name: segments[1] };
	}

	return { namespace: UNPREFIXED_NAMESPACE, name: packageName };
}

export function packageHref(packageName: string): string {
	const { namespace, name } = packageParts(packageName);

	return `${DOCS_ROOT}/${segment(namespace)}/${segment(name)}`;
}

export function moduleHref(packageName: string, moduleName: string): string {
	return `${packageHref(packageName)}/${segment(moduleName)}`;
}

export function entityHref(
	packageName: string,
	moduleName: string,
	type: string,
	entityName: string,
): string {
	return `${moduleHref(packageName, moduleName)}/${segment(type)}/${segment(entityName)}`;
}
