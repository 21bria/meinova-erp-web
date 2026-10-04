import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BpjsRiskClassesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BpjsRiskClassesRow) => void
  onDelete?: (row: BpjsRiskClassesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBpjsRiskClassesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BpjsRiskClassesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BpjsRiskClassesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.bpjs-risk-classes.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.bpjs-risk-classes.fields.name", "Name")),
      column.text("sequence", resourceLabel("payroll.bpjs-risk-classes.fields.sequence", "Order")),
      column.status("is_active", resourceLabel("payroll.bpjs-risk-classes.fields.is_active", "Active")),
    ],
  })
}