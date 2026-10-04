import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ChartOfAccountsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ChartOfAccountsRow) => void
  onDelete?: (row: ChartOfAccountsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getChartOfAccountsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ChartOfAccountsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ChartOfAccountsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("finance.chart-of-accounts.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("finance.chart-of-accounts.fields.company", "Company")),
      column.text("code", resourceLabel("finance.chart-of-accounts.fields.code", "Account Code")),
      column.text("name", resourceLabel("finance.chart-of-accounts.fields.name", "Account Name")),
      column.text("parent_name", resourceLabel("finance.chart-of-accounts.fields.parent", "Parent Account")),
      column.text("account_type_label", resourceLabel("finance.chart-of-accounts.fields.account_type", "Account Type")),
      column.status("posting_allowed", resourceLabel("finance.chart-of-accounts.fields.posting_allowed", "Posting Allowed")),
      column.text("effective_normal_balance", resourceLabel("finance.chart-of-accounts.fields.effective_normal_balance", "Normal Balance")),
    ],
  })
}