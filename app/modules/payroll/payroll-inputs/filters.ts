import { createFilters, filter } from "@framework"

export const payrollInputsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollInputs...",
    placeholderKey: "payroll.payroll-inputs.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("period", "Payroll Period", "/api/payroll/payroll-periods/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-inputs.filters.period",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-inputs.filters.employee",
  }),
  filter.select("input_type", "Input Type", [
    { label: "Overtime", value: "overtime" },
    { label: "Variable Allowance", value: "allowance" },
    { label: "Incentive / Bonus", value: "incentive" },
    { label: "Deduction", value: "deduction" },
    { label: "Reimbursement", value: "reimbursement" },
    { label: "Correction / Adjustment", value: "adjustment" },
    { label: "Unpaid Leave", value: "unpaid_leave" },
    { label: "Attendance Adjustment", value: "attendance" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-inputs.filters.input_type",
  }),
  filter.select("component_type", "Side", [
    { label: "Earning", value: "earning" },
    { label: "Deduction", value: "deduction" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-inputs.filters.component_type",
  }),
  filter.lookup("allowance_line", "Allowance Component", "/api/payroll/allowance-template-lines/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-inputs.filters.allowance_line",
  }),
  filter.lookup("deduction_line", "Deduction Component", "/api/payroll/deduction-template-lines/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-inputs.filters.deduction_line",
  }),
  filter.select("is_taxable", "Taxable", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-inputs.filters.is_taxable",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-inputs.filters.status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-inputs.filters.is_active",
  }),
  ],
})