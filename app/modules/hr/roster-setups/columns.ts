import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RosterSetupsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RosterSetupsRow) => void
  onDelete?: (row: RosterSetupsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRosterSetupsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RosterSetupsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RosterSetupsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("document_number", resourceLabel("hr.roster-setups.fields.document_number", "Document No.")),
      column.text("location_name", resourceLabel("hr.roster-setups.fields.location", "Site")),
      column.text("department_name", resourceLabel("hr.roster-setups.fields.department", "Department")),
      column.text("section_name", resourceLabel("hr.roster-setups.fields.section", "Section")),
      column.date("as_of_date", resourceLabel("hr.roster-setups.fields.as_of_date", "As Of Date")),
      column.text("horizon_months", resourceLabel("hr.roster-setups.fields.horizon_months", "Horizon (Months)")),
      column.text("status_label", resourceLabel("hr.roster-setups.fields.status", "Status")),
      column.text("line_count", resourceLabel("hr.roster-setups.fields.line_count", "Employees")),
      column.text("committed_count", resourceLabel("hr.roster-setups.fields.committed_count", "Committed")),

    ],
  })
}