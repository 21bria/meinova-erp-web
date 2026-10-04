import { createFilters, filter } from "@framework"

export const jobCategoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search jobCategories...",
    placeholderKey: "references.hr.job-categories.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.job-categories.filters.is_active",
  }),
  ],
})