import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveGoLiveRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveGoLiveRow) => void
  onDelete?: (row: LeaveGoLiveRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveGoLiveColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveGoLiveRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveGoLiveRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("hr.leave-go-live.fields.company", "Company")),
      column.date("go_live_date", resourceLabel("hr.leave-go-live.fields.go_live_date", "Go-Live Date")),
      column.status("is_active", resourceLabel("hr.leave-go-live.fields.is_active", "Active")),
      column.date("cutoff_date", resourceLabel("hr.leave-go-live.fields.cutoff_date", "Cut-Off Date")),
      column.text("draft_count", resourceLabel("hr.leave-go-live.fields.draft_count", "Opening Balance — Draft")),
      column.text("posted_count", resourceLabel("hr.leave-go-live.fields.posted_count", "Opening Balance — Posted")),
    ],
  })
}