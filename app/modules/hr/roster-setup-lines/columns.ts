import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RosterSetupLinesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RosterSetupLinesRow) => void
  onDelete?: (row: RosterSetupLinesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRosterSetupLinesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RosterSetupLinesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RosterSetupLinesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("employee_name", resourceLabel("hr.roster-setup-lines.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.roster-setup-lines.fields.employee_number", "Employee No.")),
      column.text("roster_policy_code", resourceLabel("hr.roster-setup-lines.fields.roster_policy", "Roster Policy")),
      column.date("current_cycle_start", resourceLabel("hr.roster-setup-lines.fields.current_cycle_start", "Current Cycle Start")),
      column.text("opening_rotation_credit", resourceLabel("hr.roster-setup-lines.fields.opening_rotation_credit", "Opening Credit")),
      column.text("note", resourceLabel("hr.roster-setup-lines.fields.note", "Note")),
      column.text("status_label", resourceLabel("hr.roster-setup-lines.fields.status", "Status")),
      column.text("commit_error", resourceLabel("hr.roster-setup-lines.fields.commit_error", "Error")),
    ],
  })
}