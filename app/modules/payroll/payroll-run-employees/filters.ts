import { createFilters, filter } from "@framework"

export const payrollRunEmployeesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payrollRunEmployees...",
    placeholderKey: "payroll.payroll-run-employees.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("run", "Payroll Run", "/api/payroll/payroll-runs/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.run",
  }),
  filter.lookup("payroll_group", "Payroll Group", "/api/payroll/payroll-groups/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.payroll_group",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.employee",
  }),
  filter.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.salary_grade",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.department",
  }),
  filter.lookup("salary_level", "Salary Level", "/api/payroll/salary-levels/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.salary_level",
  }),
  filter.lookup("tax_status", "Tax Status", "/api/payroll/tax-statuses/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.tax_status",
  }),
  filter.lookup("overtime_group", "Overtime Group", "/api/payroll/overtime-groups/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.overtime_group",
  }),
  filter.lookup("allowance_template", "Allowance Template", "/api/payroll/allowance-templates/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.allowance_template",
  }),
  filter.lookup("deduction_template", "Deduction Template", "/api/payroll/deduction-templates/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.deduction_template",
  }),
  filter.lookup("payroll_policy", "Payroll Policy", "/api/payroll/payroll-policies/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payroll-run-employees.filters.payroll_policy",
  }),
  filter.select("status", "Status", [
    { label: "Pending", value: "pending" },
    { label: "Calculated", value: "calculated" },
    { label: "Excluded", value: "excluded" },
    { label: "Error", value: "error" },
    { label: "Finalized", value: "finalized" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-run-employees.filters.status",
  }),
  filter.select("is_excluded", "Excluded", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-run-employees.filters.is_excluded",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payroll-run-employees.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): payroll_assignment, company, branch, location, division, section, cost_center, position, currency
  ],
})