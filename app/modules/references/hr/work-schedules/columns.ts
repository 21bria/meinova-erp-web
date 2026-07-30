import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

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
      column.status("is_active", "Active"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("sort_order", "Sort order"),
      column.text("schedule_type", "Schedule Type"),
      column.text("standard_hours_per_day", "Standard Hours per Day"),
      column.text("standard_hours_per_week", "Standard Hours per Week"),
      column.text("work_days", "Work Days"),
      column.status("is_flexible", "Flexible"),
      column.status("crosses_midnight", "Crosses Midnight"),
      column.text("schedule_days", "Schedule days"),
      column.text("schedule_type_name", "Schedule type name"),
    ],
  })
}