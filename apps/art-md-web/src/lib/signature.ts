export type TypeNode =
	| { kind: 'primitive'; primitive: string }
	| { kind: 'ref'; ref: string }
	| { kind: 'array'; elements: TypeNode }
	| { kind: 'union'; entries: TypeNode[] }
	| { kind: 'intersection'; entries: TypeNode[] }
	| { kind: 'literal'; value: string | number | boolean }
	| {
			kind: 'object';
			members: Record<string, { type: TypeNode; optional?: boolean; readonly?: boolean }>;
	  }
	| {
			kind: 'function';
			params?: { name: string; type: TypeNode; optional?: boolean }[];
			returns?: { type: TypeNode };
	  }
	| { kind: string };

export type DeclaredFunction = { name: string; node: TypeNode };

export type DeclaredType = { name: string; node: TypeNode; private?: boolean };

function renderParams(params?: { name: string; type: TypeNode; optional?: boolean }[]): string {
	return (params ?? [])
		.map(param => `${param.name}${param.optional ? '?' : ''}: ${renderType(param.type)}`)
		.join(', ');
}

export function renderType(node?: TypeNode): string {
	if (!node) return 'void';

	switch (node.kind) {
		case 'primitive':
			return node.primitive;
		case 'ref':
			return node.ref;
		case 'array':
			return `${renderType(node.elements)}[]`;
		case 'union':
			return node.entries.map(renderType).join(' | ');
		case 'intersection':
			return node.entries.map(renderType).join(' & ');
		case 'literal':
			return typeof node.value === 'string' ? `'${node.value}'` : String(node.value);
		case 'object': {
			const members = Object.entries(node.members).map(
				([name, member]) =>
					`${member.readonly ? 'readonly ' : ''}${name}${member.optional ? '?' : ''}: ${renderType(member.type)}`,
			);
			return `{ ${members.join('; ')} }`;
		}
		case 'function':
			return `(${renderParams(node.params)}) => ${renderType(node.returns?.type)}`;
		default:
			return node.kind;
	}
}

export function renderFunctionSignature(name: string, node: TypeNode): string {
	if (node.kind === 'function') {
		return `${name}(${renderParams(node.params)}): ${renderType(node.returns?.type)}`;
	}

	return `${name}: ${renderType(node)}`;
}

export function toDeclaredFunction(value: unknown): DeclaredFunction | undefined {
	const declaration = value as { name?: string; node?: TypeNode } | undefined;
	if (!declaration?.name || !declaration.node) return undefined;
	return { name: declaration.name, node: declaration.node };
}

export function toDeclaredType(value: unknown): DeclaredType | undefined {
	const declaration = value as { name?: string; node?: TypeNode; private?: boolean } | undefined;
	if (!declaration?.name || !declaration.node) return undefined;
	return { name: declaration.name, node: declaration.node, private: declaration.private };
}
