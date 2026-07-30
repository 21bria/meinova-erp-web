import type {
  TreeConfig,
  TreeNode,
  TreeNodeId,
  TreeSchema,
} from '../../core/types/tree'

export type {
  TreeConfig,
  TreeNode,
  TreeNodeId,
  TreeSchema,
}

export type BuiltTree = {
  id: string
  schema: TreeSchema
  endpoint: string
  saveEndpoint?: string
  defaultQuery: Record<string, any>
  isCheckboxTree: boolean
  expandAll: boolean
  cascadeCheck: boolean
  showSearch: boolean
}