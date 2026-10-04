import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { SkillsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SkillsRow) => void
  onDelete?: (row: SkillsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSkillsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SkillsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SkillsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.skills.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.skills.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.skills.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.skills.fields.sort_order", "Sort order")),
    ],
  })
}