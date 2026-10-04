import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TaxBracketsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TaxBracketsRow) => void
  onDelete?: (row: TaxBracketsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTaxBracketsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TaxBracketsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TaxBracketsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.tax-brackets.fields.is_active", "Active")),
      column.text("sequence", resourceLabel("payroll.tax-brackets.fields.sequence", "Sequence")),
      column.text("income_from", resourceLabel("payroll.tax-brackets.fields.income_from", "Annual Income From")),
      column.text("income_to", resourceLabel("payroll.tax-brackets.fields.income_to", "Annual Income To")),
      column.text("rate", resourceLabel("payroll.tax-brackets.fields.rate", "Rate (%)")),
    ],
  })
}