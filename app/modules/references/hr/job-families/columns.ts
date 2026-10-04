import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { JobFamiliesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: JobFamiliesRow) => void
  onDelete?: (row: JobFamiliesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getJobFamiliesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<JobFamiliesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<JobFamiliesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.job-families.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.job-families.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.job-families.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.job-families.fields.sort_order", "Sort order")),
    ],
  })
}