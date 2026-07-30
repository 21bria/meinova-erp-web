import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { PositionRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PositionRow) => void
  onDelete?: (row: PositionRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPositionColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PositionRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PositionRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("company_name", "Company"),
      column.text("branch_name", "Branch"),
      column.text("site_name", "Site"),
      column.text("division_name", "Division"),
      column.text("department_name", "Department"),
      column.text("section_name", "Section"),
      column.text("job_category_name", "Job Category"),
      column.text("job_level_name", "Job Level"),
      column.text("reports_to_name", "Reports to"),
      column.text("code", "Position Code"),
      column.text("name", "Position Name"),
      column.text("headcount", "Headcount"),
      column.status("is_manager", "Is manager"),
      column.text("company_name", "Company name"),
      column.text("branch_name", "Branch name"),
      column.text("site_name", "Site name"),
      column.text("division_name", "Division name"),
      column.text("department_name", "Department name"),
      column.text("section_name", "Section name"),
      column.text("job_category_name", "Job category name"),
      column.text("job_level_name", "Job level name"),
    ],
  })
}