import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { SkillLevelsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SkillLevelsRow) => void
  onDelete?: (row: SkillLevelsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSkillLevelsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SkillLevelsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SkillLevelsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.skill-levels.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.skill-levels.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.skill-levels.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.skill-levels.fields.sort_order", "Sort order")),
    ],
  })
}