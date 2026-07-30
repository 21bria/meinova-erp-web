import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { CitiesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CitiesRow) => void
  onDelete?: (row: CitiesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCitiesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CitiesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CitiesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("province_name", "Province"),
    ],
  })
}