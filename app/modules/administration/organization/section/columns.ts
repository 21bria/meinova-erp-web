import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { SectionRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SectionRow) => void
  onDelete?: (row: SectionRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSectionColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SectionRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SectionRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("company_name", "Company"),
      column.text("branch_name", "Branch"),
      column.text("site_name", "Site"),
      column.text("division_name", "Division"),
      column.text("department_name", "Department"),
      column.text("code", "Section Code"),
      column.text("name", "Section Name"),
      column.text("company_name", "Company name"),
      column.text("branch_name", "Branch name"),
      column.text("site_name", "Site name"),
      column.text("division_name", "Division name"),
      column.text("department_name", "Department name"),
    ],
  })
}