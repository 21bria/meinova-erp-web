import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmployeeActionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmployeeActionsRow) => void
  onDelete?: (row: EmployeeActionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmployeeActionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmployeeActionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmployeeActionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("document_number", resourceLabel("hr.employee-actions.fields.document_number", "Document No.")),
      column.text("employee_name", resourceLabel("hr.employee-actions.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.employee-actions.fields.employee_number", "Employee No.")),
      column.text("requested_by_name", resourceLabel("hr.employee-actions.fields.requested_by", "Requested By")),
      column.text("action_type_label", resourceLabel("hr.employee-actions.fields.action_type", "Action Type")),
      column.text("status_label", resourceLabel("hr.employee-actions.fields.status", "Status")),
      column.date("effective_date", resourceLabel("hr.employee-actions.fields.effective_date", "Effective Date")),

    ],
  })
}