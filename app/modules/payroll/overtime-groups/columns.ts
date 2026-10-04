import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.text("code", resourceLabel("payroll.overtime-groups.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.overtime-groups.fields.name", "Name")),
      column.text("hourly_multiplier", resourceLabel("payroll.overtime-groups.fields.hourly_multiplier", "Default Multiplier")),
      column.text("hourly_divisor", resourceLabel("payroll.overtime-groups.fields.hourly_divisor", "Hourly Divisor")),
      column.text("tier_basis_label", resourceLabel("payroll.overtime-groups.fields.tier_basis", "Tier Basis")),
      column.status("is_active", resourceLabel("payroll.overtime-groups.fields.is_active", "Active")),
    ],
  })
}