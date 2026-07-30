import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { DepartmentRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DepartmentRow) => void
  onDelete?: (row: DepartmentRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDepartmentColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DepartmentRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DepartmentRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("company_name", "Company"),
      column.text("branch_name", "Branch"),
      column.text("site_name", "Site"),
      column.text("division_name", "Division"),
      column.text("code", "Department Code"),
      column.text("name", "Department Name"),
      column.text("company_name", "Company name"),
      column.text("branch_name", "Branch name"),
      column.text("site_name", "Site name"),
      column.text("division_name", "Division name"),
    ],
  })
}