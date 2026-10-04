import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("administration.organization.position.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.position.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.position.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("administration.organization.position.fields.location", "Location")),
      column.text("division_name", resourceLabel("administration.organization.position.fields.division", "Division")),
      column.text("department_name", resourceLabel("administration.organization.position.fields.department", "Department")),
      column.text("section_name", resourceLabel("administration.organization.position.fields.section", "Section")),
      column.text("job_category_name", resourceLabel("administration.organization.position.fields.job_category", "Job Category")),
      column.text("job_level_name", resourceLabel("administration.organization.position.fields.job_level", "Job Level")),
      column.text("reports_to_name", resourceLabel("administration.organization.position.fields.reports_to", "Reports to")),
      column.text("code", resourceLabel("administration.organization.position.fields.code", "Position Code")),
      column.text("name", resourceLabel("administration.organization.position.fields.name", "Position Name")),
      column.text("headcount", resourceLabel("administration.organization.position.fields.headcount", "Headcount")),
      column.status("is_manager", resourceLabel("administration.organization.position.fields.is_manager", "Is manager")),
    ],
  })
}