import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BpjsBaseComponentsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BpjsBaseComponentsRow) => void
  onDelete?: (row: BpjsBaseComponentsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBpjsBaseComponentsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BpjsBaseComponentsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BpjsBaseComponentsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.bpjs-base-components.fields.is_active", "Active")),
      column.text("definition_label", resourceLabel("payroll.bpjs-base-components.fields.definition", "Base Definition")),
      column.text("allowance_code", resourceLabel("payroll.bpjs-base-components.fields.allowance_code", "Allowance Code")),
      column.text("sequence", resourceLabel("payroll.bpjs-base-components.fields.sequence", "Order")),
    ],
  })
}