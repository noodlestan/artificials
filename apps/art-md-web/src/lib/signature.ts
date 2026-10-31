export type TypeNode =
	| { kind: 'primitive'; primitive: string }
	| { kind: 'ref'; ref: string }
	| { kind: 'array'; elements: TypeNode }
	| { kind: 'union'; entries: TypeNode[] }
	| { kind: 'intersection'; entries: TypeNode[] }
	| { kind: 'literal'; value: string | number | boolean }
	| {
			kind: 'object';
			members: Record<string, ObjectMember>;
	  }
	| FunctionTypeNode
	| { kind: string };

export type ObjectMember = {
	type: TypeNode;
	optional?: boolean;
	readonly?: boolean;
	/** JSDoc comment attached to the member in source. */
	description?: string;
};

export type FunctionTypeNode = {
	kind: 'function';
	params?: FunctionParam[];
	returns?: { type: TypeNode; description?: string };
	/** Canonical `@param` tags, keyed by parameter name. */
	paramTags?: Record<string, string>;
	/** Canonical `@returns` tag text. */
	returnsTag?: string;
};

export type FunctionParam = {
	name: string;
	type: TypeNode;
	optional?: boolean;
	/** JSDoc comment attached to the parameter in source, or its `@param` tag. */
	description?: string;
};

export type DeclaredFunction = { name: string; node: TypeNode };

export type DeclaredType = { name: string; node: TypeNode; private?: boolean };

/** Parameter descriptions paired with their names, for rendering. */
export type FunctionDocs = {
	params: { name: string; description: string }[];
	returns?: string;
};

/**
 * Reduces a canonical JSDoc fragment to a single readable sentence.
 *
 * Extracted comments keep their formatting: the ` - ` separator that follows
 * the parameter name in an `@param` tag, and the line breaks of a multi-line
 * block. Rendering wants one line, so collapse whitespace and drop the
 * separator.
 *
 * Returns `undefined` when nothing is left, so callers can skip empty rows.
 */
export function normalizeComment(comment?: string): string | undefined {
	if (!comment) return undefined;

	const collapsed = comment
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/^-+\s*/, '');

	return collapsed.length > 0 ? collapsed : undefined;
}

function renderParams(params?: FunctionParam[]): string {
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

/**
 * Collects the documentation attached to a function declaration.
 *
 * Reads the resolved `description` on each parameter and on the return type,
 * falling back to the `@param` and `@returns` tags on the node — the extractor
 * writes both, and which one is populated depends on how the comment was
 * attached. Parameters without any documentation are omitted so the section
 * renders no empty rows.
 *
 * Returns `undefined` for non-function nodes.
 */
export function describeFunction(node: TypeNode): FunctionDocs | undefined {
	if (node.kind !== 'function') return undefined;

	const params = (node.params ?? [])
		.map(param => ({
			name: param.name,
			description: normalizeComment(param.description ?? node.paramTags?.[param.name]),
		}))
		.filter((param): param is { name: string; description: string } => Boolean(param.description));

	return {
		params,
		returns: normalizeComment(node.returns?.description ?? node.returnsTag),
	};
}
