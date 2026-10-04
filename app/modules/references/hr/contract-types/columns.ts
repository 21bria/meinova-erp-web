import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ContractTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ContractTypesRow) => void
  onDelete?: (row: ContractTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getContractTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ContractTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ContractTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.contract-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.contract-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.contract-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.contract-types.fields.sort_order", "Sort order")),
    ],
  })
}