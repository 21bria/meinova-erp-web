import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EducationsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EducationsRow) => void
  onDelete?: (row: EducationsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEducationsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EducationsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EducationsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.educations.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.educations.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.educations.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.educations.fields.sort_order", "Sort order")),
      column.text("level", resourceLabel("references.hr.educations.fields.level", "Level")),
    ],
  })
}