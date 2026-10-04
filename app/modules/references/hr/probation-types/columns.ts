import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ProbationTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ProbationTypesRow) => void
  onDelete?: (row: ProbationTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getProbationTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ProbationTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ProbationTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.probation-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.probation-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.probation-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.probation-types.fields.sort_order", "Sort order")),
    ],
  })
}