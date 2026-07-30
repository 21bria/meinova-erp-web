import { createFilters, filter } from "@framework"

export const trainingCategoryFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search trainingCategory...",
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