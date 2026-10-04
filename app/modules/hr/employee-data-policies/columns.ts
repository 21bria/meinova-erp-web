import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmployeeDataPoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmployeeDataPoliciesRow) => void
  onDelete?: (row: EmployeeDataPoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmployeeDataPoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmployeeDataPoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmployeeDataPoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("hr.employee-data-policies.fields.company", "Company")),
      column.text("location_name", resourceLabel("hr.employee-data-policies.fields.location", "Location")),
      column.text("subject_label", resourceLabel("hr.employee-data-policies.fields.subject", "Protected Data")),
      column.text("code", resourceLabel("hr.employee-data-policies.fields.code", "Code")),
      column.text("name", resourceLabel("hr.employee-data-policies.fields.name", "Name")),
      column.status("allow_self", resourceLabel("hr.employee-data-policies.fields.allow_self", "The Employee")),
      column.status("allow_manager", resourceLabel("hr.employee-data-policies.fields.allow_manager", "Direct Manager")),
      column.status("allow_department_head", resourceLabel("hr.employee-data-policies.fields.allow_department_head", "Department Head")),
      column.text("role_name", resourceLabel("hr.employee-data-policies.fields.role", "Role")),
      column.status("is_active", resourceLabel("hr.employee-data-policies.fields.is_active", "Active")),
    ],
  })
}