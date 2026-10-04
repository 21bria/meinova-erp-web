import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmployeeActionPoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmployeeActionPoliciesRow) => void
  onDelete?: (row: EmployeeActionPoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmployeeActionPoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmployeeActionPoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmployeeActionPoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("hr.employee-action-policies.fields.company", "Company")),
      column.text("location_name", resourceLabel("hr.employee-action-policies.fields.location", "Location")),
      column.text("action_type_label", resourceLabel("hr.employee-action-policies.fields.action_type", "Action Type")),
      column.text("code", resourceLabel("hr.employee-action-policies.fields.code", "Code")),
      column.text("name", resourceLabel("hr.employee-action-policies.fields.name", "Name")),
      column.text("initiator_type_label", resourceLabel("hr.employee-action-policies.fields.initiator_type", "Requested By")),
      column.status("allow_on_behalf", resourceLabel("hr.employee-action-policies.fields.allow_on_behalf", "Allow On Behalf")),
      column.status("is_active", resourceLabel("hr.employee-action-policies.fields.is_active", "Active")),
    ],
  })
}