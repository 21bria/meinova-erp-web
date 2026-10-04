import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("administration.organization.section.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.section.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.section.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("administration.organization.section.fields.location", "Location")),
      column.text("division_name", resourceLabel("administration.organization.section.fields.division", "Division")),
      column.text("department_name", resourceLabel("administration.organization.section.fields.department", "Department")),
      column.text("code", resourceLabel("administration.organization.section.fields.code", "Section Code")),
      column.text("name", resourceLabel("administration.organization.section.fields.name", "Section Name")),
    ],
  })
}