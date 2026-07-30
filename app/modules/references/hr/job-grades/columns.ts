import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { JobGradesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: JobGradesRow) => void
  onDelete?: (row: JobGradesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getJobGradesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<JobGradesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<JobGradesRow>({
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