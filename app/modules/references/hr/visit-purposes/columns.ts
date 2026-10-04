import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { VisitPurposesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: VisitPurposesRow) => void
  onDelete?: (row: VisitPurposesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getVisitPurposesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<VisitPurposesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<VisitPurposesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.visit-purposes.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.visit-purposes.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.visit-purposes.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.visit-purposes.fields.sort_order", "Sort order")),
      column.status("requires_approval", resourceLabel("references.hr.visit-purposes.fields.requires_approval", "Requires Approval")),
    ],
  })
}