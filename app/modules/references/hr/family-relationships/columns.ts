import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { FamilyRelationshipsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: FamilyRelationshipsRow) => void
  onDelete?: (row: FamilyRelationshipsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getFamilyRelationshipsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<FamilyRelationshipsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<FamilyRelationshipsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
    ],
  })
}