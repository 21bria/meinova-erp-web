import { createFilters, filter } from "@framework"

export const performanceCyclesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search performanceCycles...",
    placeholderKey: "references.hr.performance-cycles.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.performance-cycles.filters.is_active",
  }),
  ],
})