import { createFilters, filter } from "@framework"

export const kpiPeriodsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search kpiPeriods...",
    placeholderKey: "references.hr.kpi-periods.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.kpi-periods.filters.is_active",
  }),
  ],
})