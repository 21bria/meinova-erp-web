import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { KpiCategoriesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: KpiCategoriesRow) => void
  onDelete?: (row: KpiCategoriesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getKpiCategoriesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<KpiCategoriesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<KpiCategoriesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.kpi-categories.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.kpi-categories.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.kpi-categories.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.kpi-categories.fields.sort_order", "Sort order")),
    ],
  })
}