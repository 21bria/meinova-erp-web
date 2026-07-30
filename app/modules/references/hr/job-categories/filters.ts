import { createFilters, filter } from "@framework"

export const jobCategoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search jobCategories...",
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