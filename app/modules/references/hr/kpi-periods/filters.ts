import { createFilters, filter } from "@framework"

export const kpiPeriodsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search kpiPeriods...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})