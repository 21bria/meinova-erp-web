import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RosterAdjustmentsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RosterAdjustmentsRow) => void
  onDelete?: (row: RosterAdjustmentsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRosterAdjustmentsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RosterAdjustmentsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RosterAdjustmentsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("document_number", resourceLabel("hr.roster-adjustments.fields.document_number", "Document No.")),
      column.text("plan_label", resourceLabel("hr.roster-adjustments.fields.plan", "Roster Plan")),
      column.text("employee_name", resourceLabel("hr.roster-adjustments.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.roster-adjustments.fields.employee_number", "Employee No.")),
      column.text("adjustment_kind_label", resourceLabel("hr.roster-adjustments.fields.adjustment_kind", "Adjustment Type")),
      column.date("effective_date", resourceLabel("hr.roster-adjustments.fields.effective_date", "Effective Date")),
      column.text("days", resourceLabel("hr.roster-adjustments.fields.days", "Days")),
      column.text("credit_impact_label", resourceLabel("hr.roster-adjustments.fields.credit_impact", "Rotation Credit")),
      column.text("credit_days", resourceLabel("hr.roster-adjustments.fields.credit_days", "Credit Days")),
      column.text("reason", resourceLabel("hr.roster-adjustments.fields.reason", "Reason")),
      column.text("reference", resourceLabel("hr.roster-adjustments.fields.reference", "Reference")),
      column.text("status_label", resourceLabel("hr.roster-adjustments.fields.status", "Status")),
      column.datetime("applied_at", resourceLabel("hr.roster-adjustments.fields.applied_at", "Applied At")),

    ],
  })
}