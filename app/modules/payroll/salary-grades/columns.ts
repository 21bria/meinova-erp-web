import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { SalaryGradesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SalaryGradesRow) => void
  onDelete?: (row: SalaryGradesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSalaryGradesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SalaryGradesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SalaryGradesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("code", resourceLabel("payroll.salary-grades.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.salary-grades.fields.name", "Name")),
      column.text("minimum_salary", resourceLabel("payroll.salary-grades.fields.minimum_salary", "Minimum salary")),
      column.text("maximum_salary", resourceLabel("payroll.salary-grades.fields.maximum_salary", "Maximum salary")),
      column.status("is_active", resourceLabel("payroll.salary-grades.fields.is_active", "Is active")),
    ],
  })
}