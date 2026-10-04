import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RotationCreditsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RotationCreditsRow) => void
  onDelete?: (row: RotationCreditsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRotationCreditsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RotationCreditsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RotationCreditsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("employee_name", resourceLabel("hr.rotation-credits.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.rotation-credits.fields.employee_number", "Employee No.")),
      column.text("entry_type_label", resourceLabel("hr.rotation-credits.fields.entry_type", "Entry Type")),
      column.text("days", resourceLabel("hr.rotation-credits.fields.days", "Days")),
      column.date("transaction_date", resourceLabel("hr.rotation-credits.fields.transaction_date", "Recorded On")),
      column.date("effective_date", resourceLabel("hr.rotation-credits.fields.effective_date", "Effective Date")),
      column.text("remainder_days", resourceLabel("hr.rotation-credits.fields.remainder_days", "Carried")),
      column.text("conversion_ratio", resourceLabel("hr.rotation-credits.fields.conversion_ratio", "Ratio")),
      column.text("reason", resourceLabel("hr.rotation-credits.fields.reason", "Reason")),
      column.text("signed_days", resourceLabel("hr.rotation-credits.fields.signed_days", "Effect")),
      column.text("source_label", resourceLabel("hr.rotation-credits.fields.source_label", "Source")),
      column.text("reversed_by_label", resourceLabel("hr.rotation-credits.fields.reversed_by_label", "Reversed By")),
    ],
  })
}