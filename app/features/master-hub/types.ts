export interface MasterHubCategory {
  key: string
  label: string
  order?: number
  icon?: string
}

export interface MasterHubItem {
  key: string
  title: string
  description?: string
  icon: string
  link: string
  category: string

  order?: number
  badge?: string | number
  permission?: string

  disabled?: boolean
  external?: boolean
  keywords?: string[]
}

export interface MasterHubProps {
  title: string
  description?: string

  items: MasterHubItem[]
  categories?: MasterHubCategory[]

  searchPlaceholder?: string
  allCategoryLabel?: string

  emptyTitle?: string
  emptyDescription?: string

  initialCategory?: string
}