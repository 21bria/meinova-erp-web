import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { ShiftsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ShiftsRow) => void
  onDelete?: (row: ShiftsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getShiftsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ShiftsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ShiftsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
      column.text("shift_group_name", "Shift Group"),
      column.text("start_time", "Start Time"),
      column.text("end_time", "End Time"),
      column.status("crosses_midnight", "Crosses Midnight"),
      column.text("shift_group_name", "Shift group name"),
    ],
  })
}