export interface NavLink {
  title: string
  icon?: string
  link?: string
  permission?: string
  external?: boolean
  new?: boolean
  badge?: string | number
}

export interface NavSectionTitle {
  heading: string
}

export interface NavGroup {
  title: string
  icon?: string
  children: NavLink[]
  permission?: string
  badge?: string | number
}

export interface NavMenu {
  heading: string
  items: NavMenuItems
}

export declare type NavMenuItems = (NavLink | NavGroup | NavSectionTitle)[]
