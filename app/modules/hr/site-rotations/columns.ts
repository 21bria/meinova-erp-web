import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { SiteRotationsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SiteRotationsRow) => void
  onDelete?: (row: SiteRotationsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSiteRotationsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SiteRotationsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SiteRotationsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.site-rotations.fields.is_active", "Is active")),
      column.text("document_number", resourceLabel("hr.site-rotations.fields.document_number", "Roster No.")),
      column.text("employee_name", resourceLabel("hr.site-rotations.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.site-rotations.fields.employee_number", "Employee No.")),
      column.text("location_name", resourceLabel("hr.site-rotations.fields.location", "Site / Location")),
      column.text("roster_policy_name", resourceLabel("hr.site-rotations.fields.roster_policy", "Roster Policy")),
      column.text("cycle_work_days", resourceLabel("hr.site-rotations.fields.cycle_work_days", "Work Days")),
      column.text("cycle_off_days", resourceLabel("hr.site-rotations.fields.cycle_off_days", "Off Days")),
      column.text("cycle_travel_days", resourceLabel("hr.site-rotations.fields.cycle_travel_days", "Travel Days")),
      column.date("start_date", resourceLabel("hr.site-rotations.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("hr.site-rotations.fields.end_date", "End Date")),
      column.text("status_label", resourceLabel("hr.site-rotations.fields.status", "Status")),

    ],
  })
}