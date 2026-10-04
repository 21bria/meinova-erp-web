import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayslipsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayslipsRow) => void
  onDelete?: (row: PayslipsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayslipsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayslipsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayslipsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.payslips.fields.is_active", "Is active")),
      column.text("run_employee_name", resourceLabel("payroll.payslips.fields.run_employee", "Run employee")),
      column.text("document_number", resourceLabel("payroll.payslips.fields.document_number", "Payslip No.")),
      column.text("run_name", resourceLabel("payroll.payslips.fields.run", "Run")),
      column.text("period_name", resourceLabel("payroll.payslips.fields.period", "Payroll Period")),
      column.text("employee_name", resourceLabel("payroll.payslips.fields.employee", "Employee")),
      column.text("company_name", resourceLabel("payroll.payslips.fields.company", "Company")),
      column.text("branch_name", resourceLabel("payroll.payslips.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("payroll.payslips.fields.location", "Location")),
      column.text("division_name", resourceLabel("payroll.payslips.fields.division", "Division")),
      column.text("department_name", resourceLabel("payroll.payslips.fields.department", "Department")),
      column.text("section_name", resourceLabel("payroll.payslips.fields.section", "Section")),
      column.date("issue_date", resourceLabel("payroll.payslips.fields.issue_date", "Issue Date")),
      column.text("basic_salary", resourceLabel("payroll.payslips.fields.basic_salary", "Basic Salary")),
      column.text("gross_earning", resourceLabel("payroll.payslips.fields.gross_earning", "Gross Earning")),
      column.text("total_deduction", resourceLabel("payroll.payslips.fields.total_deduction", "Total Deduction")),
      column.text("tax_amount", resourceLabel("payroll.payslips.fields.tax_amount", "Tax")),
      column.text("net_pay", resourceLabel("payroll.payslips.fields.net_pay", "Net Pay")),
      column.text("employer_contribution", resourceLabel("payroll.payslips.fields.employer_contribution", "Employer contribution")),
      column.text("status", resourceLabel("payroll.payslips.fields.status", "Status")),
      column.datetime("published_at", resourceLabel("payroll.payslips.fields.published_at", "Published at")),
      column.text("published_by_name", resourceLabel("payroll.payslips.fields.published_by", "Published by")),
    ],
  })
}