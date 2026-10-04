import { createFilters, filter } from "@framework"

export const allowanceTemplateLinesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search allowanceTemplateLines...",
    placeholderKey: "payroll.allowance-template-lines.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("template", "Allowance Template", "/api/payroll/allowance-templates/lookup/", {
    placement: "advanced",
    labelKey: "payroll.allowance-template-lines.filters.template",
  }),
  filter.select("basis", "Calculation Basis", [
    { label: "Fixed Amount", value: "fixed" },
    { label: "% of Basic Salary", value: "percent_of_basic" },
    { label: "Amount x Working Day", value: "per_working_day" },
    { label: "Amount x Paid Day", value: "per_paid_day" },
    { label: "Amount x Attendance Day", value: "per_attendance_day" },
    { label: "Amount x Overtime Hour", value: "per_overtime_hour" },
  ], {
    placement: "quick",
    labelKey: "payroll.allowance-template-lines.filters.basis",
  }),
  filter.select("is_taxable", "Taxable", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.allowance-template-lines.filters.is_taxable",
  }),
  filter.select("is_prorated", "Prorated", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.allowance-template-lines.filters.is_prorated",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.allowance-template-lines.filters.is_active",
  }),
  ],
})