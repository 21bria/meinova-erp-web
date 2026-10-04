import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { WorkCalendarRow } from "./types"

type ColumnActions = {
  onEdit?: (row: WorkCalendarRow) => void
  onDelete?: (row: WorkCalendarRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getWorkCalendarColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<WorkCalendarRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<WorkCalendarRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.calendar.work-calendar.fields.is_active", "Is active")),
      column.text("scope", resourceLabel("administration.calendar.work-calendar.fields.scope", "Scope")),
      column.text("applies_to", resourceLabel("administration.calendar.work-calendar.fields.applies_to", "Applies To")),
      column.text("company_name", resourceLabel("administration.calendar.work-calendar.fields.company", "Company")),
      column.text("location_name", resourceLabel("administration.calendar.work-calendar.fields.location", "Location")),
      column.text("code", resourceLabel("administration.calendar.work-calendar.fields.code", "Code")),
      column.text("name", resourceLabel("administration.calendar.work-calendar.fields.name", "Name")),
      column.text("working_days", resourceLabel("administration.calendar.work-calendar.fields.working_days", "Working Days")),
      column.status("is_default", resourceLabel("administration.calendar.work-calendar.fields.is_default", "Is default")),
    ],
  })
}