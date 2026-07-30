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
    role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmployeesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("user_name", "User"),
      column.text("employee_number", "Employee Number"),
      // column.text("nik", "NIK"),
      column.text("first_name", "First Name"),
      // column.text("middle_name", "Middle Name"),
      // column.text("last_name", "Last Name"),
      // column.text("preferred_name", "Preferred Name"),
      column.text("gender_name", "Gender"),
      column.text("religion_name", "Religion"),
      column.text("nationality_name", "Nationality"),
      column.text("blood_type_name", "Blood Type"),
      column.text("marital_status_name", "Marital Status"),
      column.text("birth_place", "Birth Place"),
      column.text("birth_date", "Birth Date"),
      column.text("personal_email", "Personal Email"),
      column.text("work_email", "Work Email"),
      column.text("phone", "Phone"),
      // column.text("mobile", "Mobile"),
    ],
  })
}