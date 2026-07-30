import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

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
      column.text("code", "Code"),
      column.text("name", "Name"),
      column.text("minimum_salary", "Minimum salary"),
      column.text("maximum_salary", "Maximum salary"),
      column.status("is_active", "Is active"),
    ],
  })
}