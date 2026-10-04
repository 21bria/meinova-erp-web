export type HelpCategoriesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  icon: string
  module: string
  is_published: boolean
  article_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type HelpCategoriesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  icon: string
  module: string
  is_published: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}