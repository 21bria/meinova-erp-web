import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeavePoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeavePoliciesRow) => void
  onDelete?: (row: LeavePoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeavePoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeavePoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeavePoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.leave-policies.fields.is_active", "Is active")),
      column.text("company_name", resourceLabel("hr.leave-policies.fields.company", "Company")),
      column.text("leave_type_name", resourceLabel("hr.leave-policies.fields.leave_type", "Leave Type")),
      column.text("code", resourceLabel("hr.leave-policies.fields.code", "Code")),
      column.text("name", resourceLabel("hr.leave-policies.fields.name", "Name")),
      column.text("employee_group_name", resourceLabel("hr.leave-policies.fields.employee_group", "Employee Group")),
      column.text("employment_type_name", resourceLabel("hr.leave-policies.fields.employment_type", "Employment Type")),
      column.status("uses_balance", resourceLabel("hr.leave-policies.fields.uses_balance", "Uses Balance")),
      column.text("entitlement_days", resourceLabel("hr.leave-policies.fields.entitlement_days", "Entitlement per Period (days)")),
      column.text("eligible_after_months", resourceLabel("hr.leave-policies.fields.eligible_after_months", "Waiting Period (months)")),
      column.status("prorate_first_period", resourceLabel("hr.leave-policies.fields.prorate_first_period", "Prorate First Period")),
      column.status("allow_carry_over", resourceLabel("hr.leave-policies.fields.allow_carry_over", "Allow Carry Over")),
      column.text("max_days", resourceLabel("hr.leave-policies.fields.max_days", "Maximum Days")),
      column.status("per_event", resourceLabel("hr.leave-policies.fields.per_event", "Per Event")),
      column.status("document_required", resourceLabel("hr.leave-policies.fields.document_required", "Document Required")),
    ],
  })
}