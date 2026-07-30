import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

export type PermissionRow = {
  id: number
  code: string
  name: string
  module: string
  model: string
}

type ColumnActions = {
  onEdit: (row: PermissionRow) => void
  onDelete: (row: PermissionRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPermissionColumns(
  actions: ColumnActions,
  opts: ColumnOptions = {},
): ColumnDef<PermissionRow>[] {
  const role = opts.role ?? "USER"
  const canMutate = role !== "VIEWER"

  return createColumns<PermissionRow>({
    selectable: true,
    canMutate,
    actions,
    items: [
      column.text("code", "Code"),
      column.text("name", "Permission"),
      column.text("module", "Module"),
      column.text("model", "Model"),
    ],
  })
}