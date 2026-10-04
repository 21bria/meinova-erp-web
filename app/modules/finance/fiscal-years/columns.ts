import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { FiscalYearsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: FiscalYearsRow) => void
  onDelete?: (row: FiscalYearsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getFiscalYearsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<FiscalYearsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<FiscalYearsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("finance.fiscal-years.fields.company", "Company")),
      column.text("code", resourceLabel("finance.fiscal-years.fields.code", "Code")),
      column.text("name", resourceLabel("finance.fiscal-years.fields.name", "Name")),
      column.date("start_date", resourceLabel("finance.fiscal-years.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("finance.fiscal-years.fields.end_date", "End Date")),
      column.text("status_label", resourceLabel("finance.fiscal-years.fields.status", "Status")),
      column.status("is_current", resourceLabel("finance.fiscal-years.fields.is_current", "Current Fiscal Year")),
      column.text("period_count", resourceLabel("finance.fiscal-years.fields.period_count", "Periods")),
    ],
  })
}