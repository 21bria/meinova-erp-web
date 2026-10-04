import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TransfersRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TransfersRow) => void
  onDelete?: (row: TransfersRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTransfersColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TransfersRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TransfersRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("assets.transfers.fields.is_active", "is active")),
      column.text("document_number", resourceLabel("assets.transfers.fields.document_number", "Document No.")),
      column.text("company_name", resourceLabel("assets.transfers.fields.company", "Owner Company")),
      column.text("asset_code", resourceLabel("assets.transfers.fields.asset", "Asset")),
      column.text("status", resourceLabel("assets.transfers.fields.status", "Status")),
      column.text("source_custody_name", resourceLabel("assets.transfers.fields.source_custody", "Source custody")),
      column.text("source_custody_type", resourceLabel("assets.transfers.fields.source_custody_type", "From")),
      column.text("source_location_name", resourceLabel("assets.transfers.fields.source_location", "Source Location")),
      column.text("source_employee_name", resourceLabel("assets.transfers.fields.source_employee", "Employee")),
      column.text("target_custody_type", resourceLabel("assets.transfers.fields.target_custody_type", "Transfer To")),
      column.text("target_employee_name", resourceLabel("assets.transfers.fields.target_employee", "Employee")),
      column.text("target_department_name", resourceLabel("assets.transfers.fields.target_department", "Department")),
      column.text("target_location_name", resourceLabel("assets.transfers.fields.target_location", "Target Location")),
      column.text("employee_company_name", resourceLabel("assets.transfers.fields.employee_company", "Employee company")),
      column.text("employee_location_name", resourceLabel("assets.transfers.fields.employee_location", "Employee location")),
      column.text("employee_department_name", resourceLabel("assets.transfers.fields.employee_department", "Employee department")),
      column.status("is_cross_company", resourceLabel("assets.transfers.fields.is_cross_company", "Cross-Company")),
      column.text("reason", resourceLabel("assets.transfers.fields.reason", "Reason")),
      column.date("transfer_date", resourceLabel("assets.transfers.fields.transfer_date", "Transfer Date")),
      column.text("resulting_custody_name", resourceLabel("assets.transfers.fields.resulting_custody", "Resulting custody")),
      column.datetime("submitted_at", resourceLabel("assets.transfers.fields.submitted_at", "Submitted at")),
      column.datetime("approved_at", resourceLabel("assets.transfers.fields.approved_at", "Approved at")),
      column.datetime("rejected_at", resourceLabel("assets.transfers.fields.rejected_at", "Rejected at")),
      column.datetime("cancelled_at", resourceLabel("assets.transfers.fields.cancelled_at", "Cancelled at")),
      column.datetime("completed_at", resourceLabel("assets.transfers.fields.completed_at", "Completed at")),
      column.text("completed_by_name", resourceLabel("assets.transfers.fields.completed_by", "Completed by")),

    ],
  })
}