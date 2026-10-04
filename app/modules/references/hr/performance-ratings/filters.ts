import { createFilters, filter } from "@framework"

export const performanceRatingsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search performanceRatings...",
    placeholderKey: "references.hr.performance-ratings.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.performance-ratings.filters.is_active",
  }),
  ],
})