import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ReturnsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ReturnsRow) => void
  onDelete?: (row: ReturnsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getReturnsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ReturnsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ReturnsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("assets.returns.fields.is_active", "is active")),
      column.text("document_number", resourceLabel("assets.returns.fields.document_number", "Document No.")),
      column.text("company_name", resourceLabel("assets.returns.fields.company", "Owner Company")),
      column.text("asset_code", resourceLabel("assets.returns.fields.asset", "Asset")),
      column.text("status", resourceLabel("assets.returns.fields.status", "Status")),
      column.text("source_custody_name", resourceLabel("assets.returns.fields.source_custody", "Source custody")),
      column.text("source_custody_type", resourceLabel("assets.returns.fields.source_custody_type", "Returned From")),
      column.text("source_location_name", resourceLabel("assets.returns.fields.source_location", "Source Location")),
      column.text("source_facility_name", resourceLabel("assets.returns.fields.source_facility", "Source facility")),
      column.text("source_employee_name", resourceLabel("assets.returns.fields.source_employee", "Employee")),
      column.text("destination_location_name", resourceLabel("assets.returns.fields.destination_location", "Storage Location")),
      column.text("reason", resourceLabel("assets.returns.fields.reason", "Reason")),
      column.date("return_date", resourceLabel("assets.returns.fields.return_date", "Return Date")),
      column.text("return_condition", resourceLabel("assets.returns.fields.return_condition", "Return Condition")),
      column.text("resulting_custody_name", resourceLabel("assets.returns.fields.resulting_custody", "Resulting custody")),
      column.datetime("submitted_at", resourceLabel("assets.returns.fields.submitted_at", "Submitted at")),
      column.datetime("approved_at", resourceLabel("assets.returns.fields.approved_at", "Approved at")),
      column.datetime("rejected_at", resourceLabel("assets.returns.fields.rejected_at", "Rejected at")),
      column.datetime("cancelled_at", resourceLabel("assets.returns.fields.cancelled_at", "Cancelled at")),
      column.datetime("completed_at", resourceLabel("assets.returns.fields.completed_at", "Completed at")),
      column.text("completed_by_name", resourceLabel("assets.returns.fields.completed_by", "Completed by")),

    ],
  })
}