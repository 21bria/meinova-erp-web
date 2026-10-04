import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayrollRunsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollRunsRow) => void
  onDelete?: (row: PayrollRunsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollRunsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollRunsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollRunsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.payroll-runs.fields.is_active", "Is active")),
      column.text("document_number", resourceLabel("payroll.payroll-runs.fields.document_number", "Run No.")),
      column.text("period_name", resourceLabel("payroll.payroll-runs.fields.period", "Payroll Period")),
      column.text("company_name", resourceLabel("payroll.payroll-runs.fields.company", "Company")),
      column.text("name", resourceLabel("payroll.payroll-runs.fields.name", "Run Name")),
      column.text("run_type", resourceLabel("payroll.payroll-runs.fields.run_type", "Run Type")),
      column.text("location_name", resourceLabel("payroll.payroll-runs.fields.location", "Location / Site")),
      column.text("status", resourceLabel("payroll.payroll-runs.fields.status", "Status")),
      column.text("employee_count", resourceLabel("payroll.payroll-runs.fields.employee_count", "Employees")),
      column.text("total_earning", resourceLabel("payroll.payroll-runs.fields.total_earning", "Total Earning")),
      column.text("total_deduction", resourceLabel("payroll.payroll-runs.fields.total_deduction", "Total Deduction")),
      column.text("total_net", resourceLabel("payroll.payroll-runs.fields.total_net", "Total Net Pay")),
      column.text("total_employer_contribution", resourceLabel("payroll.payroll-runs.fields.total_employer_contribution", "Total employer contribution")),
      column.datetime("acknowledged_at", resourceLabel("payroll.payroll-runs.fields.acknowledged_at", "Acknowledged at")),
      column.text("acknowledged_by_name", resourceLabel("payroll.payroll-runs.fields.acknowledged_by", "Acknowledged by")),
      column.text("calculated_by_name", resourceLabel("payroll.payroll-runs.fields.calculated_by", "Calculated by")),
      column.datetime("submitted_at", resourceLabel("payroll.payroll-runs.fields.submitted_at", "Submitted at")),
      column.text("submitted_by_name", resourceLabel("payroll.payroll-runs.fields.submitted_by", "Submitted by")),
      column.datetime("approved_at", resourceLabel("payroll.payroll-runs.fields.approved_at", "Approved at")),
      column.text("approved_by_name", resourceLabel("payroll.payroll-runs.fields.approved_by", "Approved by")),
      column.text("finalized_by_name", resourceLabel("payroll.payroll-runs.fields.finalized_by", "Finalized by")),
      column.text("error_count", resourceLabel("payroll.payroll-runs.fields.error_count", "Errors")),
      column.text("warning_count", resourceLabel("payroll.payroll-runs.fields.warning_count", "Warnings")),

    ],
  })
}