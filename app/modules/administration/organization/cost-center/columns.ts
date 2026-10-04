import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CostCenterRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CostCenterRow) => void
  onDelete?: (row: CostCenterRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCostCenterColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CostCenterRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CostCenterRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.organization.cost-center.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.cost-center.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.cost-center.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("administration.organization.cost-center.fields.location", "Location")),
      column.text("division_name", resourceLabel("administration.organization.cost-center.fields.division", "Division")),
      column.text("department_name", resourceLabel("administration.organization.cost-center.fields.department", "Department")),
      column.text("code", resourceLabel("administration.organization.cost-center.fields.code", "Cost Center Code")),
      column.text("name", resourceLabel("administration.organization.cost-center.fields.name", "Cost Center Name")),
    ],
  })
}