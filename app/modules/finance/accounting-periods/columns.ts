import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AccountingPeriodsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AccountingPeriodsRow) => void
  onDelete?: (row: AccountingPeriodsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAccountingPeriodsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AccountingPeriodsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AccountingPeriodsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("fiscal_year_name", resourceLabel("finance.accounting-periods.fields.fiscal_year", "Fiscal Year")),
      column.text("period_number", resourceLabel("finance.accounting-periods.fields.period_number", "No.")),
      column.text("code", resourceLabel("finance.accounting-periods.fields.code", "Code")),
      column.text("name", resourceLabel("finance.accounting-periods.fields.name", "Name")),
      column.date("start_date", resourceLabel("finance.accounting-periods.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("finance.accounting-periods.fields.end_date", "End Date")),
      column.text("status_label", resourceLabel("finance.accounting-periods.fields.status", "Status")),
    ],
  })
}