import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("administration.organization.division.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.division.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.division.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("administration.organization.division.fields.location", "Location")),
      column.text("code", resourceLabel("administration.organization.division.fields.code", "Code")),
      column.text("name", resourceLabel("administration.organization.division.fields.name", "Name")),
    ],
  })
}