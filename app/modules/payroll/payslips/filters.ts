import { createFilters, filter } from "@framework"

export const payslipsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search payslips...",
    placeholderKey: "payroll.payslips.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("period", "Payroll Period", "/api/payroll/payroll-periods/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payslips.filters.period",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "payroll.payslips.filters.employee",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "payroll.payslips.filters.company",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "payroll.payslips.filters.department",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ], {
    placement: "quick",
    labelKey: "payroll.payslips.filters.status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.payslips.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): run_employee, run, branch, location, division, section, published_by
  ],
})