export type TableCheckState = boolean | "indeterminate"

export type TableAction<T = any> = {
  label: string
  icon?: any
  action: (row: T) => void
  destructive?: boolean
  disabled?: boolean
}