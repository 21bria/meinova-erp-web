import { createFilters, filter } from "@framework"

export const bpjsRiskClassesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bpjsRiskClasses...",
    placeholderKey: "payroll.bpjs-risk-classes.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-risk-classes.filters.is_active",
  }),
  ],
})