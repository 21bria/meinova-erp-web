import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CountriesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CountriesRow) => void
  onDelete?: (row: CountriesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCountriesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CountriesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CountriesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.geography.countries.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.geography.countries.fields.code", "Code")),
      column.text("name", resourceLabel("references.geography.countries.fields.name", "Name")),
      column.text("phone_code", resourceLabel("references.geography.countries.fields.phone_code", "Phone Code")),
      column.text("currency_code", resourceLabel("references.geography.countries.fields.currency_code", "Currency Code")),
    ],
  })
}