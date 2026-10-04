import { createFilters, filter } from "@framework"

export const deductionTemplateLinesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search deductionTemplateLines...",
    placeholderKey: "payroll.deduction-template-lines.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("template", "Deduction Template", "/api/payroll/deduction-templates/lookup/", {
    placement: "advanced",
    labelKey: "payroll.deduction-template-lines.filters.template",
  }),
  filter.select("basis", "Calculation Basis", [
    { label: "Fixed Amount", value: "fixed" },
    { label: "% of Basic Salary", value: "percent_of_basic" },
    { label: "% of Gross Earning", value: "percent_of_gross" },
    { label: "% of Taxable Earning", value: "percent_of_taxable" },
    { label: "Amount x Working Day", value: "per_working_day" },
    { label: "Amount x Paid Day", value: "per_paid_day" },
    { label: "Amount x Absent Day", value: "per_absent_day" },
    { label: "Amount x Unpaid Leave Day", value: "per_unpaid_leave_day" },
    { label: "PPh21 Progressive", value: "pph21_progressive" },
  ], {
    placement: "quick",
    labelKey: "payroll.deduction-template-lines.filters.basis",
  }),
  filter.select("reduces_taxable", "Reduces Taxable Income", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.deduction-template-lines.filters.reduces_taxable",
  }),
  filter.select("is_employer_cost", "Employer Cost", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.deduction-template-lines.filters.is_employer_cost",
  }),
  filter.select("is_prorated", "Prorated", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.deduction-template-lines.filters.is_prorated",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.deduction-template-lines.filters.is_active",
  }),
  ],
})