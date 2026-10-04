import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { DepartmentRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DepartmentRow) => void
  onDelete?: (row: DepartmentRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDepartmentColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DepartmentRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DepartmentRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.organization.department.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.department.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.department.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("administration.organization.department.fields.location", "Location")),
      column.text("division_name", resourceLabel("administration.organization.department.fields.division", "Division")),
      column.text("code", resourceLabel("administration.organization.department.fields.code", "Department Code")),
      column.text("name", resourceLabel("administration.organization.department.fields.name", "Department Name")),
    ],
  })
}