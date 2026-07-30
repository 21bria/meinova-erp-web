import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

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
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
    ],
  })
}