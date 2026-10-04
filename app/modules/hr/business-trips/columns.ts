import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BusinessTripsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BusinessTripsRow) => void
  onDelete?: (row: BusinessTripsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBusinessTripsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BusinessTripsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BusinessTripsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("document_number", resourceLabel("hr.business-trips.fields.document_number", "Document No.")),
      column.text("employee_name", resourceLabel("hr.business-trips.fields.employee", "Employee")),
      column.text("company_name", resourceLabel("hr.business-trips.fields.company", "Company")),
      column.text("purpose_category_label", resourceLabel("hr.business-trips.fields.purpose_category", "Purpose")),
      column.datetime("departure_datetime", resourceLabel("hr.business-trips.fields.departure_datetime", "Departure")),
      column.datetime("return_datetime", resourceLabel("hr.business-trips.fields.return_datetime", "Return")),
      column.text("status_label", resourceLabel("hr.business-trips.fields.status", "Status")),
      column.text("destination_summary", resourceLabel("hr.business-trips.fields.destination_summary", "Destination")),

    ],
  })
}