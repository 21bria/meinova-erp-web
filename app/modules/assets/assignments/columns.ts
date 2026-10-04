import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AssignmentsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AssignmentsRow) => void
  onDelete?: (row: AssignmentsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAssignmentsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AssignmentsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AssignmentsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("assets.assignments.fields.is_active", "is active")),
      column.text("document_number", resourceLabel("assets.assignments.fields.document_number", "Document No.")),
      column.text("company_name", resourceLabel("assets.assignments.fields.company", "Owner Company")),
      column.text("asset_code", resourceLabel("assets.assignments.fields.asset", "Asset")),
      column.text("status", resourceLabel("assets.assignments.fields.status", "Status")),
      column.text("source_custody_name", resourceLabel("assets.assignments.fields.source_custody", "Source custody")),
      column.text("target_custody_type", resourceLabel("assets.assignments.fields.target_custody_type", "Assign To")),
      column.text("employee_name", resourceLabel("assets.assignments.fields.employee", "Employee")),
      column.text("department_name", resourceLabel("assets.assignments.fields.department", "Department")),
      column.text("location_name", resourceLabel("assets.assignments.fields.location", "Target Location")),
      column.text("employee_company_name", resourceLabel("assets.assignments.fields.employee_company", "Employee company")),
      column.text("employee_location_name", resourceLabel("assets.assignments.fields.employee_location", "Employee location")),
      column.text("employee_department_name", resourceLabel("assets.assignments.fields.employee_department", "Employee department")),
      column.status("is_cross_company", resourceLabel("assets.assignments.fields.is_cross_company", "Cross-Company")),
      column.date("handover_date", resourceLabel("assets.assignments.fields.handover_date", "Handover Date")),
      column.text("resulting_custody_name", resourceLabel("assets.assignments.fields.resulting_custody", "Resulting custody")),
      column.datetime("submitted_at", resourceLabel("assets.assignments.fields.submitted_at", "Submitted at")),
      column.datetime("approved_at", resourceLabel("assets.assignments.fields.approved_at", "Approved at")),
      column.datetime("rejected_at", resourceLabel("assets.assignments.fields.rejected_at", "Rejected at")),
      column.datetime("cancelled_at", resourceLabel("assets.assignments.fields.cancelled_at", "Cancelled at")),
      column.datetime("completed_at", resourceLabel("assets.assignments.fields.completed_at", "Completed at")),
      column.text("completed_by_name", resourceLabel("assets.assignments.fields.completed_by", "Completed by")),

    ],
  })
}