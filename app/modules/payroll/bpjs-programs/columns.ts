import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BpjsProgramsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BpjsProgramsRow) => void
  onDelete?: (row: BpjsProgramsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBpjsProgramsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BpjsProgramsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BpjsProgramsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.bpjs-programs.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.bpjs-programs.fields.name", "Name")),
      column.text("sequence", resourceLabel("payroll.bpjs-programs.fields.sequence", "Order")),
      column.status("uses_risk_class", resourceLabel("payroll.bpjs-programs.fields.uses_risk_class", "Uses Risk Class")),
      column.status("is_active", resourceLabel("payroll.bpjs-programs.fields.is_active", "Active")),
    ],
  })
}