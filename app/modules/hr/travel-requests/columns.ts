import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { TravelRequestsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: TravelRequestsRow) => void
  onDelete?: (row: TravelRequestsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getTravelRequestsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<TravelRequestsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<TravelRequestsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.travel-requests.fields.is_active", "Is active")),
      column.text("document_number", resourceLabel("hr.travel-requests.fields.document_number", "TR No.")),
      column.text("employee_name", resourceLabel("hr.travel-requests.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.travel-requests.fields.employee_number", "Employee No.")),
      column.date("start_date", resourceLabel("hr.travel-requests.fields.start_date", "Off Start")),
      column.date("end_date", resourceLabel("hr.travel-requests.fields.end_date", "Off End")),
      column.text("total_days", resourceLabel("hr.travel-requests.fields.total_days", "Total Days")),
      column.text("status_label", resourceLabel("hr.travel-requests.fields.status", "Status")),

    ],
  })
}