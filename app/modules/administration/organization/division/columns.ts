import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { DivisionRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DivisionRow) => void
  onDelete?: (row: DivisionRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDivisionColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DivisionRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DivisionRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("company_name", "Company"),
      column.text("branch_name", "Branch"),
      column.text("site_name", "Site"),
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("company_name", "Company name"),
      column.text("branch_name", "Branch name"),
      column.text("site_name", "Site name"),
    ],
  })
}