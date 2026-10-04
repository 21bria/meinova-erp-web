import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AccountingPoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AccountingPoliciesRow) => void
  onDelete?: (row: AccountingPoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAccountingPoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AccountingPoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AccountingPoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("finance.accounting-policies.fields.is_active", "Active")),
      column.text("code", resourceLabel("finance.accounting-policies.fields.code", "Code")),
      column.text("name", resourceLabel("finance.accounting-policies.fields.name", "Name")),
      column.text("company_name", resourceLabel("finance.accounting-policies.fields.company", "Company")),
      column.text("event_type", resourceLabel("finance.accounting-policies.fields.event_type", "Event Type")),
      column.text("rule_count", resourceLabel("finance.accounting-policies.fields.rule_count", "Rules")),

    ],
  })
}