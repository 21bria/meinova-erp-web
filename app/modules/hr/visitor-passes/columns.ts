import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { VisitorPassesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: VisitorPassesRow) => void
  onDelete?: (row: VisitorPassesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getVisitorPassesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<VisitorPassesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<VisitorPassesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.visitor-passes.fields.is_active", "Is active")),
      column.text("request_number", resourceLabel("hr.visitor-passes.fields.request", "Visitor Request")),
      column.text("pass_number", resourceLabel("hr.visitor-passes.fields.pass_number", "Pass No.")),
      column.date("valid_from", resourceLabel("hr.visitor-passes.fields.valid_from", "Valid From")),
      column.date("valid_until", resourceLabel("hr.visitor-passes.fields.valid_until", "Valid Until")),
      column.text("status_label", resourceLabel("hr.visitor-passes.fields.status", "Status")),
      column.datetime("issued_at", resourceLabel("hr.visitor-passes.fields.issued_at", "Issued At")),
      column.text("visitor_name", resourceLabel("hr.visitor-passes.fields.visitor_name", "Visitor Name")),
      column.text("visitor_type_label", resourceLabel("hr.visitor-passes.fields.visitor_type_label", "Visitor Type")),
      column.text("host_name", resourceLabel("hr.visitor-passes.fields.host_name", "Host")),
      column.text("location_name", resourceLabel("hr.visitor-passes.fields.location_name", "Location")),
      column.date("visit_date", resourceLabel("hr.visitor-passes.fields.visit_date", "Visit Date")),
    ],
  })
}