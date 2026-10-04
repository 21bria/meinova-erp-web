import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RosterCrewRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RosterCrewRow) => void
  onDelete?: (row: RosterCrewRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRosterCrewColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RosterCrewRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RosterCrewRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.calendar.roster-crew.fields.is_active", "Is active")),
      column.text("company_name", resourceLabel("administration.calendar.roster-crew.fields.company", "Company")),
      column.text("location_name", resourceLabel("administration.calendar.roster-crew.fields.location", "Location")),
      column.text("code", resourceLabel("administration.calendar.roster-crew.fields.code", "Code")),
      column.text("name", resourceLabel("administration.calendar.roster-crew.fields.name", "Crew Name")),
      column.text("work_schedule_name", resourceLabel("administration.calendar.roster-crew.fields.work_schedule", "Work Schedule")),
      column.date("cycle_start_date", resourceLabel("administration.calendar.roster-crew.fields.cycle_start_date", "Cycle Start Date")),
      column.text("cycle_pattern", resourceLabel("administration.calendar.roster-crew.fields.cycle_pattern", "Cycle")),
    ],
  })
}