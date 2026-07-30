import { createFilters, filter } from "@framework"

export const performanceRatingsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search performanceRatings...",
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