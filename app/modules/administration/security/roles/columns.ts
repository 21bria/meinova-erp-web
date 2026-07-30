import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

export type RoleRow = {
  id: number
  code: string
  name: string
  description?: string | null
  is_active: boolean
}

type ColumnActions = {
  onEdit: (row: RoleRow) => void
  onDelete: (row: RoleRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRoleColumns(
  actions: ColumnActions,
  opts: ColumnOptions = {},
): ColumnDef<RoleRow>[] {
  const role = opts.role ?? "USER"
  const canMutate = role !== "VIEWER"

  return createColumns<RoleRow>({
    selectable: true,
    canMutate,
    actions,
    items: [
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("description", "Description"),
      column.status("is_active"),
    ],
  })
}