import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AccountingDimensionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AccountingDimensionsRow) => void
  onDelete?: (row: AccountingDimensionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAccountingDimensionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AccountingDimensionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AccountingDimensionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("finance.accounting-dimensions.fields.is_active", "Active")),
      column.text("code", resourceLabel("finance.accounting-dimensions.fields.code", "Code")),
      column.text("name", resourceLabel("finance.accounting-dimensions.fields.name", "Name")),
      column.text("data_type_label", resourceLabel("finance.accounting-dimensions.fields.data_type", "Data Type")),
      column.status("is_required", resourceLabel("finance.accounting-dimensions.fields.is_required", "Required on Every Line")),
      column.status("is_locked", resourceLabel("finance.accounting-dimensions.fields.is_locked", "Built-in")),
    ],
  })
}