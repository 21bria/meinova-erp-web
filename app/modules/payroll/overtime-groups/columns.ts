import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { OvertimeGroupsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: OvertimeGroupsRow) => void
  onDelete?: (row: OvertimeGroupsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getOvertimeGroupsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<OvertimeGroupsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<OvertimeGroupsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("hourly_multiplier", "Hourly multiplier"),
      column.text("maximum_hours_per_day", "Maximum hours per day"),
      column.text("maximum_hours_per_month", "Maximum hours per month"),
      column.status("is_active", "Is active"),
    ],
  })
}