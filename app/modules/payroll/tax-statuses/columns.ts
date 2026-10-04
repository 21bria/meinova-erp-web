import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TaxStatusesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TaxStatusesRow) => void
  onDelete?: (row: TaxStatusesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTaxStatusesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TaxStatusesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TaxStatusesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.tax-statuses.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.tax-statuses.fields.name", "Name")),
      column.text("non_taxable_income", resourceLabel("payroll.tax-statuses.fields.non_taxable_income", "Non taxable income")),
      column.status("is_active", resourceLabel("payroll.tax-statuses.fields.is_active", "Is active")),
    ],
  })
}