import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { BanksRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BanksRow) => void
  onDelete?: (row: BanksRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBanksColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BanksRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BanksRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("short_name", "Short Name"),
      column.text("swift_code", "SWIFT Code"),
      column.text("country_name", "Country"),
    ],
  })
}