import { createFilters, filter } from "@framework"

export const bpjsRulesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bpjsRules...",
    placeholderKey: "payroll.bpjs-rules.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("program", "Program", "/api/payroll/bpjs-programs/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-rules.filters.program",
  }),
  filter.lookup("risk_class", "Risk Class", "/api/payroll/bpjs-risk-classes/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-rules.filters.risk_class",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-rules.filters.company",
  }),
  filter.text("effective_from", "Effective From", {
    placement: "advanced",
    labelKey: "payroll.bpjs-rules.filters.effective_from",
  }),
  filter.lookup("base_definition", "Contribution Base", "/api/payroll/bpjs-base-definitions/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-rules.filters.base_definition",
  }),
  filter.select("reduces_taxable", "Reduces Taxable Income", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-rules.filters.reduces_taxable",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-rules.filters.is_active",
  }),
  ],
})