import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { EmployeesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmployeesRow) => void
  onDelete?: (row: EmployeesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmployeesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmployeesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmployeesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("employee_number", "Employee Number"),
      column.text("nik", "NIK"),
      column.text("first_name", "First Name"),
      column.text("last_name", "Last Name"),
      column.text("gender_name", "Gender"),
      column.text("work_email", "Work Email"),
      column.text("mobile", "Mobile"),
      column.status("is_active", "Active"),
      column.text("employment_status_name", "Employment Status"),
      column.text("employment_type_name", "Employment Type"),
      column.text("join_date", "Join Date"),
      column.text("full_name", "Full name"),
      column.text("display_name", "Display name"),

    ],
  })
}