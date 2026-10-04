import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ReligionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ReligionsRow) => void
  onDelete?: (row: ReligionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getReligionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ReligionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ReligionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.religions.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.religions.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.religions.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.religions.fields.sort_order", "Sort order")),
    ],
  })
}