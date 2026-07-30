import type { Component } from 'vue'

export interface DashboardKpi {
  code: string
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: Component
  color?: string
}

export interface DashboardChart {
  code: string
  title: string
  type:
    | 'area'
    | 'line'
    | 'bar'
    | 'column'
    | 'donut'
    | 'mixed'

  height?: number

  categories?: (string | number)[]

  series: any[]

  colors?: string[]
}

export interface FavoriteMenu {
  code: string
  title: string
  description?: string
  href: string
  icon?: Component
  position: number
}

export interface FavoriteApplication {
  code: string
  title: string
  description?: string
  href: string
  icon?: Component
  color?: string
  favorite: boolean
  position: number
}

export interface QuickAction {
  code: string
  title: string
  href: string
  icon?: Component
  color?: string
}

export interface NotificationItem {
  id: string
  title: string
  description?: string
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'

  created_at: string

  is_read: boolean
}

export interface WorkflowItem {
  id: string

  title: string

  module: string

  requester: string

  status:
    | 'Pending'
    | 'Approved'
    | 'Rejected'
    | 'Draft'

  created_at: string
}

export interface DashboardWorkspace {
  kpis: DashboardKpi[]

  charts: DashboardChart[]

  favoriteMenus: FavoriteMenu[]

  favoriteApps: FavoriteApplication[]

  quickActions: QuickAction[]

  notifications: NotificationItem[]

  workflows: WorkflowItem[]
}