import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { SalaryLevelsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SalaryLevelsRow) => void
  onDelete?: (row: SalaryLevelsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSalaryLevelsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SalaryLevelsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SalaryLevelsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("salary_grade_name", "Salary Grade"),
      column.text("code", "Level Code"),
      column.text("name", "Level Name"),
      column.text("sequence", "Sequence"),
      column.text("minimum_salary", "Minimum Salary"),
      column.text("maximum_salary", "Maximum Salary"),
      column.status("is_active", "Active"),
      column.text("salary_grade_name", "Salary grade name"),
    ],
  })
}