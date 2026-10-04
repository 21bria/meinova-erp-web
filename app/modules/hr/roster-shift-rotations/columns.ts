import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RosterShiftRotationsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RosterShiftRotationsRow) => void
  onDelete?: (row: RosterShiftRotationsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRosterShiftRotationsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RosterShiftRotationsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RosterShiftRotationsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.roster-shift-rotations.fields.is_active", "Is active")),
      column.text("sequence", resourceLabel("hr.roster-shift-rotations.fields.sequence", "Step")),
      column.text("shift_name", resourceLabel("hr.roster-shift-rotations.fields.shift", "Shift")),
      column.text("block_days", resourceLabel("hr.roster-shift-rotations.fields.block_days", "Days")),
      column.text("notes", resourceLabel("hr.roster-shift-rotations.fields.notes", "Notes")),
    ],
  })
}