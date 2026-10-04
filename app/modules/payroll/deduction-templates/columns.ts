import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { DeductionTemplatesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DeductionTemplatesRow) => void
  onDelete?: (row: DeductionTemplatesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDeductionTemplatesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DeductionTemplatesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DeductionTemplatesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.deduction-templates.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.deduction-templates.fields.name", "Name")),
      column.status("is_active", resourceLabel("payroll.deduction-templates.fields.is_active", "Is active")),
    ],
  })
}