import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CompetencyLevelsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CompetencyLevelsRow) => void
  onDelete?: (row: CompetencyLevelsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCompetencyLevelsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CompetencyLevelsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CompetencyLevelsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.competency-levels.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.competency-levels.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.competency-levels.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.competency-levels.fields.sort_order", "Sort order")),
    ],
  })
}