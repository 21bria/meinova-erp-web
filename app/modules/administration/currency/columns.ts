import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CurrencyRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CurrencyRow) => void
  onDelete?: (row: CurrencyRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCurrencyColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CurrencyRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CurrencyRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.currency.fields.is_active", "Is active")),
      column.text("code", resourceLabel("administration.currency.fields.code", "Code")),
      column.text("name", resourceLabel("administration.currency.fields.name", "Name")),
      column.text("symbol", resourceLabel("administration.currency.fields.symbol", "Symbol")),
      column.text("decimal_places", resourceLabel("administration.currency.fields.decimal_places", "Decimal places")),
      column.status("is_base_currency", resourceLabel("administration.currency.fields.is_base_currency", "Is base currency")),
    ],
  })
}