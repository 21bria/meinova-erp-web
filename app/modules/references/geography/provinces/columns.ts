import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { ProvincesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ProvincesRow) => void
  onDelete?: (row: ProvincesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getProvincesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ProvincesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ProvincesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("country_name", "Country"),
    ],
  })
}