import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { CompetencyCategoriesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CompetencyCategoriesRow) => void
  onDelete?: (row: CompetencyCategoriesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCompetencyCategoriesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CompetencyCategoriesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CompetencyCategoriesRow>({
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