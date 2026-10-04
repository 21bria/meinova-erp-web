import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { HolidayRow } from "./types"

type ColumnActions = {
  onEdit?: (row: HolidayRow) => void
  onDelete?: (row: HolidayRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getHolidayColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<HolidayRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<HolidayRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.calendar.holiday.fields.is_active", "Is active")),
      column.text("scope", resourceLabel("administration.calendar.holiday.fields.scope", "Scope")),
      column.text("applies_to", resourceLabel("administration.calendar.holiday.fields.applies_to", "Applies To")),
      column.text("company_name", resourceLabel("administration.calendar.holiday.fields.company", "Company")),
      column.text("location_name", resourceLabel("administration.calendar.holiday.fields.location", "Location")),
      column.date("date", resourceLabel("administration.calendar.holiday.fields.date", "Date")),
      column.text("code", resourceLabel("administration.calendar.holiday.fields.code", "Code")),
      column.text("name", resourceLabel("administration.calendar.holiday.fields.name", "Name")),
      column.text("country_code", resourceLabel("administration.calendar.holiday.fields.country_code", "Country code")),
      column.status("is_national", resourceLabel("administration.calendar.holiday.fields.is_national", "Is national")),
      column.status("is_recurring", resourceLabel("administration.calendar.holiday.fields.is_recurring", "Is recurring")),
      column.text("source", resourceLabel("administration.calendar.holiday.fields.source", "Source")),
      column.text("sync_status", resourceLabel("administration.calendar.holiday.fields.sync_status", "Sync status")),
    ],
  })
}