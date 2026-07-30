import { createFilters, filter } from "@framework"

export const competencyCategoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search competencyCategories...",
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