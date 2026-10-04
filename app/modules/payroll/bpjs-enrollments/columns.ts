import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BpjsEnrollmentsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BpjsEnrollmentsRow) => void
  onDelete?: (row: BpjsEnrollmentsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBpjsEnrollmentsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BpjsEnrollmentsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BpjsEnrollmentsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("employee_name", resourceLabel("payroll.bpjs-enrollments.fields.employee", "Employee")),
      column.text("program_name", resourceLabel("payroll.bpjs-enrollments.fields.program", "Program")),
      column.status("participates", resourceLabel("payroll.bpjs-enrollments.fields.participates", "Participates")),
      column.date("enrolled_from", resourceLabel("payroll.bpjs-enrollments.fields.enrolled_from", "Enrolled From")),
      column.date("enrolled_to", resourceLabel("payroll.bpjs-enrollments.fields.enrolled_to", "Enrolled To")),
      column.text("risk_class_name", resourceLabel("payroll.bpjs-enrollments.fields.risk_class", "Risk Class")),
      column.text("membership_number", resourceLabel("payroll.bpjs-enrollments.fields.membership_number", "Membership Number")),
      column.status("is_active", resourceLabel("payroll.bpjs-enrollments.fields.is_active", "Active")),
    ],
  })
}