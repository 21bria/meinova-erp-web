import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { GradesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: GradesRow) => void
  onDelete?: (row: GradesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getGradesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<GradesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<GradesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
    ],
  })
}