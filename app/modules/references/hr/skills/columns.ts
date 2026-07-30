import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

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
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
    ],
  })
}