import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { JobCategoriesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: JobCategoriesRow) => void
  onDelete?: (row: JobCategoriesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getJobCategoriesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<JobCategoriesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<JobCategoriesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.job-categories.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.job-categories.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.job-categories.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.job-categories.fields.sort_order", "Sort order")),
    ],
  })
}