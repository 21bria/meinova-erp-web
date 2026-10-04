import { createFilters, filter } from "@framework"

export const bpjsBaseDefinitionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bpjsBaseDefinitions...",
    placeholderKey: "payroll.bpjs-base-definitions.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("include_basic", "Include Basic Salary", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-base-definitions.filters.include_basic",
  }),
  filter.select("daily_basic_method", "Daily Employee Base", [
    { label: "Not configured", value: "none" },
    { label: "Daily Wage x Multiplier", value: "daily_rate_x_factor" },
    { label: "Paid Days x Daily Wage", value: "paid_days_x_daily_rate" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-base-definitions.filters.daily_basic_method",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-base-definitions.filters.is_active",
  }),
  ],
})