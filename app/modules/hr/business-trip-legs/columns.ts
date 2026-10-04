import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BusinessTripLegsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BusinessTripLegsRow) => void
  onDelete?: (row: BusinessTripLegsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBusinessTripLegsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BusinessTripLegsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BusinessTripLegsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.business-trip-legs.fields.is_active", "Is active")),
      column.text("direction_label", resourceLabel("hr.business-trip-legs.fields.direction", "Direction")),
      column.text("sequence", resourceLabel("hr.business-trip-legs.fields.sequence", "Sequence")),
      column.date("travel_start_date", resourceLabel("hr.business-trip-legs.fields.travel_start_date", "Travel Date")),
      column.date("travel_end_date", resourceLabel("hr.business-trip-legs.fields.travel_end_date", "Arrival Date")),
      column.text("origin", resourceLabel("hr.business-trip-legs.fields.origin", "From")),
      column.text("destination", resourceLabel("hr.business-trip-legs.fields.destination", "To")),
      column.text("transport_mode_name", resourceLabel("hr.business-trip-legs.fields.transport_mode", "Transport")),
      column.text("transport_detail", resourceLabel("hr.business-trip-legs.fields.transport_detail", "Transport Detail")),
      column.text("ticket_number", resourceLabel("hr.business-trip-legs.fields.ticket_number", "Ticket No.")),
      column.status("accommodation_needed", resourceLabel("hr.business-trip-legs.fields.accommodation_needed", "Accommodation Needed")),
      column.text("accommodation_type_name", resourceLabel("hr.business-trip-legs.fields.accommodation_type", "Accommodation Type")),
      column.text("accommodation_name", resourceLabel("hr.business-trip-legs.fields.accommodation_name", "Accommodation")),
      column.date("check_in_date", resourceLabel("hr.business-trip-legs.fields.check_in_date", "Check-in")),
      column.date("check_out_date", resourceLabel("hr.business-trip-legs.fields.check_out_date", "Check-out")),

    ],
  })
}