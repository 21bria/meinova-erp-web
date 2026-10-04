import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AccountingPolicyRulesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AccountingPolicyRulesRow) => void
  onDelete?: (row: AccountingPolicyRulesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAccountingPolicyRulesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AccountingPolicyRulesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AccountingPolicyRulesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("finance.accounting-policy-rules.fields.is_active", "Is active")),
      column.text("policy_name", resourceLabel("finance.accounting-policy-rules.fields.policy", "Policy")),
      column.text("sequence", resourceLabel("finance.accounting-policy-rules.fields.sequence", "No.")),
      column.text("name", resourceLabel("finance.accounting-policy-rules.fields.name", "Rule")),
      column.text("iterate_over", resourceLabel("finance.accounting-policy-rules.fields.iterate_over", "Iterate Over")),
      column.text("line_count", resourceLabel("finance.accounting-policy-rules.fields.line_count", "Lines")),

    ],
  })
}