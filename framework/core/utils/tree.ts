import type { TreeNode, TreeNodeId } from '../types/tree'

export function getTreeNodeKey(node: TreeNode): TreeNodeId {
  return node.id
}

export function getTreeNodeLabel(node: TreeNode, fallback = 'Node') {
  return node?.label ?? node?.meta?.name ?? fallback
}

export function collectCheckedTreeKeys(nodes: TreeNode[]): TreeNodeId[] {
  const result: TreeNodeId[] = []

  for (const node of nodes) {
    if (node.checked)
      result.push(node.id)

    if (node.children?.length)
      result.push(...collectCheckedTreeKeys(node.children))
  }

  return result
}

export function toggleTreeKey(
  keys: TreeNodeId[],
  node: TreeNode,
  checked: boolean,
) {
  const set = new Set(keys)

  if (checked)
    set.add(node.id)
  else
    set.delete(node.id)

  return Array.from(set)
}