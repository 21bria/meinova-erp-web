import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BpjsBaseDefinitionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BpjsBaseDefinitionsRow) => void
  onDelete?: (row: BpjsBaseDefinitionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBpjsBaseDefinitionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BpjsBaseDefinitionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BpjsBaseDefinitionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.bpjs-base-definitions.fields.code", "Code")),
      column.text("version", resourceLabel("payroll.bpjs-base-definitions.fields.version", "Version")),
      column.text("name", resourceLabel("payroll.bpjs-base-definitions.fields.name", "Name")),
      column.status("include_basic", resourceLabel("payroll.bpjs-base-definitions.fields.include_basic", "Include Basic Salary")),
      column.text("daily_basic_method", resourceLabel("payroll.bpjs-base-definitions.fields.daily_basic_method", "Daily Employee Base")),
      column.text("daily_basic_factor", resourceLabel("payroll.bpjs-base-definitions.fields.daily_basic_factor", "Daily Factor")),
      column.status("is_active", resourceLabel("payroll.bpjs-base-definitions.fields.is_active", "Active")),
      column.text("component_summary", resourceLabel("payroll.bpjs-base-definitions.fields.component_summary", "Composition")),
      column.status("is_referenced", resourceLabel("payroll.bpjs-base-definitions.fields.is_referenced", "Locked")),
    ],
  })
}