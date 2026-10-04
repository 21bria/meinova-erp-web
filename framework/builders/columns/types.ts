import type { VNodeChild } from "vue"

export type CrudAction<T> = {
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export type CrudColumnType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "currency"
  | "percent"
  | "status"
  | "badge"
  | "boolean"
  
export interface CrudColumn<T = any> {
  key: keyof T & string
  title?: string
  type?: CrudColumnType
  sortable?: boolean
  className?: string
  formatter?: (value: any, row: T) => string
  render?: (value: any, row: T) => VNodeChild
}