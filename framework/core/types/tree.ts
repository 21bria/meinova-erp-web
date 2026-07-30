export type TreeNodeId = string | number

export type TreeNode = {
  id: TreeNodeId
  label: string
  type?: string
  checked?: boolean
  disabled?: boolean
  children?: TreeNode[]
  meta?: Record<string, any>
}

export type TreeSchema = {
  title?: string
  description?: string
  endpoint: string
  save_endpoint?: string
  query?: Record<string, any>
  ui?: {
    mode?: 'tree' | 'checkbox-tree'
    expand_all?: boolean
    cascade_check?: boolean
    show_search?: boolean
  }
}

export type TreeConfig = {
  id: string
  endpoint: string
  defaultQuery?: Record<string, any>
}

export type TreeSavePayload = {
  role?: number | string
  resources: TreeNodeId[]
}