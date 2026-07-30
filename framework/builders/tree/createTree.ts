import type { TreeConfig, TreeSchema } from '../../core/types/tree'
import type { BuiltTree } from './types'

export function createTree(
  config: TreeConfig,
  schema: TreeSchema,
): BuiltTree {
  return {
    id: config.id,
    schema,
    endpoint: schema.endpoint,
    saveEndpoint: schema.save_endpoint,
    defaultQuery: config.defaultQuery ?? {},

    isCheckboxTree: schema.ui?.mode === 'checkbox-tree',
    expandAll: schema.ui?.expand_all ?? false,
    cascadeCheck: schema.ui?.cascade_check ?? true,
    showSearch: schema.ui?.show_search ?? true,
  }
}