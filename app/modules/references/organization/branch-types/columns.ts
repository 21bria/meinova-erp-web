import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BranchTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BranchTypesRow) => void
  onDelete?: (row: BranchTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBranchTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BranchTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BranchTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.organization.branch-types.fields.is_active", "Is active")),
      column.text("code", resourceLabel("references.organization.branch-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.organization.branch-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.organization.branch-types.fields.sort_order", "Sort order")),
    ],
  })
}