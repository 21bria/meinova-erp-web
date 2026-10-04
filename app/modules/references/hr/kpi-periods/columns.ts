import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { KpiPeriodsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: KpiPeriodsRow) => void
  onDelete?: (row: KpiPeriodsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getKpiPeriodsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<KpiPeriodsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<KpiPeriodsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.kpi-periods.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.kpi-periods.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.kpi-periods.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.kpi-periods.fields.sort_order", "Sort order")),
    ],
  })
}