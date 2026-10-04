import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayrollRunEmployeesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollRunEmployeesRow) => void
  onDelete?: (row: PayrollRunEmployeesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollRunEmployeesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollRunEmployeesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollRunEmployeesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.payroll-run-employees.fields.is_active", "Is active")),
      column.text("run_document_number", resourceLabel("payroll.payroll-run-employees.fields.run", "Payroll Run")),
      column.text("employee_name", resourceLabel("payroll.payroll-run-employees.fields.employee", "Employee")),
      column.text("payroll_assignment_name", resourceLabel("payroll.payroll-run-employees.fields.payroll_assignment", "Payroll assignment")),
      column.text("company_name", resourceLabel("payroll.payroll-run-employees.fields.company", "Company")),
      column.text("branch_name", resourceLabel("payroll.payroll-run-employees.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("payroll.payroll-run-employees.fields.location", "Location")),
      column.text("division_name", resourceLabel("payroll.payroll-run-employees.fields.division", "Division")),
      column.text("department_name", resourceLabel("payroll.payroll-run-employees.fields.department", "Department")),
      column.text("section_name", resourceLabel("payroll.payroll-run-employees.fields.section", "Section")),
      column.text("cost_center_name", resourceLabel("payroll.payroll-run-employees.fields.cost_center", "Cost center")),
      column.text("position_name", resourceLabel("payroll.payroll-run-employees.fields.position", "Position")),
      column.text("currency_name", resourceLabel("payroll.payroll-run-employees.fields.currency", "Currency")),
      column.text("payment_method", resourceLabel("payroll.payroll-run-employees.fields.payment_method", "Payment method")),
      column.text("basic_salary", resourceLabel("payroll.payroll-run-employees.fields.basic_salary", "Basic Salary")),
      column.text("absent_days", resourceLabel("payroll.payroll-run-employees.fields.absent_days", "Absent Days")),
      column.text("unpaid_leave_days", resourceLabel("payroll.payroll-run-employees.fields.unpaid_leave_days", "Unpaid Leave Days")),
      column.text("overtime_hours", resourceLabel("payroll.payroll-run-employees.fields.overtime_hours", "Overtime Hours")),
      column.text("absence_deduction", resourceLabel("payroll.payroll-run-employees.fields.absence_deduction", "Absence Deduction")),
      column.text("unpaid_leave_deduction", resourceLabel("payroll.payroll-run-employees.fields.unpaid_leave_deduction", "Unpaid Leave Deduction")),
      column.text("gross_earning", resourceLabel("payroll.payroll-run-employees.fields.gross_earning", "Gross Earning")),
      column.text("taxable_earning", resourceLabel("payroll.payroll-run-employees.fields.taxable_earning", "Taxable earning")),
      column.text("total_deduction", resourceLabel("payroll.payroll-run-employees.fields.total_deduction", "Total Deduction")),
      column.text("tax_amount", resourceLabel("payroll.payroll-run-employees.fields.tax_amount", "Tax")),
      column.text("net_pay", resourceLabel("payroll.payroll-run-employees.fields.net_pay", "Net Pay")),
      column.text("status", resourceLabel("payroll.payroll-run-employees.fields.status", "Status")),
      column.status("is_excluded", resourceLabel("payroll.payroll-run-employees.fields.is_excluded", "Excluded")),
      column.text("payroll_policy_label", resourceLabel("payroll.payroll-run-employees.fields.payroll_policy_label", "Calculation Policy")),
      column.text("attendance_deduction_method_label", resourceLabel("payroll.payroll-run-employees.fields.attendance_deduction_method_label", "Attendance Deduction Method")),

    ],
  })
}