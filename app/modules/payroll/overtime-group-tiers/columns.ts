import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { OvertimeGroupTiersRow } from "./types"

type ColumnActions = {
  onEdit?: (row: OvertimeGroupTiersRow) => void
  onDelete?: (row: OvertimeGroupTiersRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getOvertimeGroupTiersColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<OvertimeGroupTiersRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<OvertimeGroupTiersRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("group_name", resourceLabel("payroll.overtime-group-tiers.fields.group", "Overtime Group")),
      column.text("sequence", resourceLabel("payroll.overtime-group-tiers.fields.sequence", "Order")),
      column.text("hour_range_label", resourceLabel("payroll.overtime-group-tiers.fields.hour_from", "From Hour")),
      column.text("multiplier_label", resourceLabel("payroll.overtime-group-tiers.fields.multiplier", "Multiplier")),
      column.status("is_active", resourceLabel("payroll.overtime-group-tiers.fields.is_active", "Active")),
    ],
  })
}