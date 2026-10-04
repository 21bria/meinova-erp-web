export type HelpArticlesRow = {
  id: number
  is_active: boolean
  category: number | null
  category_name?: string | null
  code: string
  slug: string
  title: string
  summary: string
  content: string
  icon: string
  keywords: string
  route_prefix: string
  video_url: string
  role: number | null
  role_name?: string | null
  status: string
  published_at: string
  sort_order: string
  view_count: string
  helpful_count: string
  not_helpful_count: string
  status_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type HelpArticlesPayload = {
  id?: number
  is_active: boolean
  category: number | null
  code: string
  slug: string
  title: string
  summary: string
  content: string
  icon: string
  keywords: string
  route_prefix: string
  video_url: string
  role: number | null
  status: string
  sort_order: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}