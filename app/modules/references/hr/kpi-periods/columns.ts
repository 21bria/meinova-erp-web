import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

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
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
    ],
  })
}