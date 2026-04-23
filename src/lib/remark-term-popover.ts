import type { Root, Parent, Text } from 'mdast';

const TERM_PATTERN = /\{\{term:([^|}]+)\|([^}]+)\}\}/g;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function transformTextNode(node: Text): Array<{ type: 'text'; value: string } | { type: 'html'; value: string }> {
  const source = node.value;
  TERM_PATTERN.lastIndex = 0;

  if (!TERM_PATTERN.test(source)) {
    return [node];
  }

  TERM_PATTERN.lastIndex = 0;
  const children: Array<{ type: 'text'; value: string } | { type: 'html'; value: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TERM_PATTERN.exec(source)) !== null) {
    const [token, rawTerm, rawDefinition] = match;
    const index = match.index;

    if (index > lastIndex) {
      children.push({ type: 'text', value: source.slice(lastIndex, index) });
    }

    const term = rawTerm.trim();
    const definition = rawDefinition.trim();

    if (term.length === 0 || definition.length === 0) {
      children.push({ type: 'text', value: token });
    } else {
      children.push({
        type: 'html',
        value: `<span class="term-popover" data-definition="${escapeAttribute(definition)}">${escapeHtml(term)}</span>`,
      });
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < source.length) {
    children.push({ type: 'text', value: source.slice(lastIndex) });
  }

  return children;
}

function visitTree(node: Root | Parent | undefined): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (!('children' in node) || !Array.isArray(node.children)) {
    return;
  }

  const mappedChildren: Parent['children'] = [];

  for (const child of node.children) {
    if (child?.type === 'text' && typeof child.value === 'string') {
      mappedChildren.push(...transformTextNode(child));
      continue;
    }

    if ('children' in child) {
      visitTree(child as Parent);
    }

    mappedChildren.push(child);
  }

  node.children = mappedChildren;
}

export default function remarkTermPopover() {
  return (tree: Root) => {
    visitTree(tree);
  };
}
