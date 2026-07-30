export type MenuTreeItem = {
  id: number
  code: string
  title: string
  route?: string
  icon?: string
  module?: string
  is_group?: boolean
  checked: boolean
  children?: MenuTreeItem[]
}