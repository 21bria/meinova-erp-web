import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { WorkSchedulesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: WorkSchedulesRow) => void
  onDelete?: (row: WorkSchedulesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getWorkSchedulesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<WorkSchedulesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<WorkSchedulesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.work-schedules.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.work-schedules.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.work-schedules.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.work-schedules.fields.sort_order", "Sort order")),
      column.text("schedule_type", resourceLabel("references.hr.work-schedules.fields.schedule_type", "Schedule Type")),
      column.text("standard_hours_per_day", resourceLabel("references.hr.work-schedules.fields.standard_hours_per_day", "Standard Hours per Day")),
      column.text("standard_hours_per_week", resourceLabel("references.hr.work-schedules.fields.standard_hours_per_week", "Standard Hours per Week")),
      column.text("work_days", resourceLabel("references.hr.work-schedules.fields.work_days", "Work Days")),
      column.status("is_flexible", resourceLabel("references.hr.work-schedules.fields.is_flexible", "Flexible")),
      column.status("crosses_midnight", resourceLabel("references.hr.work-schedules.fields.crosses_midnight", "Crosses Midnight")),
    ],
  })
}