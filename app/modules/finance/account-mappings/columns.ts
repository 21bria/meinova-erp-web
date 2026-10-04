import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AccountMappingsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AccountMappingsRow) => void
  onDelete?: (row: AccountMappingsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAccountMappingsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AccountMappingsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AccountMappingsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("finance.account-mappings.fields.is_active", "Active")),
      column.text("code", resourceLabel("finance.account-mappings.fields.code", "Code")),
      column.text("name", resourceLabel("finance.account-mappings.fields.name", "Name")),
      column.text("mapping_key", resourceLabel("finance.account-mappings.fields.mapping_key", "Mapping Key")),
      column.text("company_name", resourceLabel("finance.account-mappings.fields.company", "Company")),
      column.text("event_type", resourceLabel("finance.account-mappings.fields.event_type", "Event Type")),
      column.text("account_name", resourceLabel("finance.account-mappings.fields.account", "Account")),
      column.text("specificity", resourceLabel("finance.account-mappings.fields.specificity", "Specificity")),
    ],
  })
}