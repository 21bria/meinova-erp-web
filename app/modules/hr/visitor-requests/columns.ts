import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { VisitorRequestsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: VisitorRequestsRow) => void
  onDelete?: (row: VisitorRequestsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getVisitorRequestsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<VisitorRequestsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<VisitorRequestsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.visitor-requests.fields.is_active", "Is active")),
      column.text("document_number", resourceLabel("hr.visitor-requests.fields.document_number", "Request No.")),
      column.date("request_date", resourceLabel("hr.visitor-requests.fields.request_date", "Request Date")),
      column.text("requester_name", resourceLabel("hr.visitor-requests.fields.requester", "Requester")),
      column.text("location_name", resourceLabel("hr.visitor-requests.fields.location", "Visit Location / Site")),
      column.text("visitor_type_label", resourceLabel("hr.visitor-requests.fields.visitor_type", "Visitor Type")),
      column.text("visit_purpose_name", resourceLabel("hr.visitor-requests.fields.visit_purpose", "Visit Purpose")),
      column.text("visit_type_name", resourceLabel("hr.visitor-requests.fields.visit_type", "Visit Type")),
      column.text("host_name", resourceLabel("hr.visitor-requests.fields.host_employee", "Host Employee")),
      column.date("visit_start_date", resourceLabel("hr.visitor-requests.fields.visit_start_date", "Visit Start Date")),
      column.date("visit_end_date", resourceLabel("hr.visitor-requests.fields.visit_end_date", "Visit End Date")),
      column.text("number_of_visitors", resourceLabel("hr.visitor-requests.fields.number_of_visitors", "Number of Visitors")),
      column.text("status_label", resourceLabel("hr.visitor-requests.fields.status", "Status")),
      column.status("travel_required", resourceLabel("hr.visitor-requests.fields.travel_required", "Travel Required")),
      column.status("accommodation_required", resourceLabel("hr.visitor-requests.fields.accommodation_required", "Accommodation Required")),
      column.text("arrival_status_label", resourceLabel("hr.visitor-requests.fields.arrival_status", "Arrival Status")),
      column.datetime("checked_in_at", resourceLabel("hr.visitor-requests.fields.checked_in_at", "Check-in Time")),
      column.text("checked_in_by_name", resourceLabel("hr.visitor-requests.fields.checked_in_by", "Checked in by")),
      column.datetime("checked_out_at", resourceLabel("hr.visitor-requests.fields.checked_out_at", "Check-out Time")),
      column.text("checked_out_by_name", resourceLabel("hr.visitor-requests.fields.checked_out_by", "Checked out by")),
      column.text("visitor_name", resourceLabel("hr.visitor-requests.fields.visitor_name", "Visitor Name")),
      column.text("visitor_organization", resourceLabel("hr.visitor-requests.fields.visitor_organization", "Company")),

    ],
  })
}