import { createFilters, filter } from "@framework"

export const trainingCategoryFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search trainingCategory...",
    placeholderKey: "references.hr.training-category.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.training-category.filters.is_active",
  }),
  ],
})