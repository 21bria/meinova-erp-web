import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AllowanceTemplatesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AllowanceTemplatesRow) => void
  onDelete?: (row: AllowanceTemplatesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAllowanceTemplatesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AllowanceTemplatesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AllowanceTemplatesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.allowance-templates.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.allowance-templates.fields.name", "Name")),
      column.status("is_active", resourceLabel("payroll.allowance-templates.fields.is_active", "Is active")),
    ],
  })
}