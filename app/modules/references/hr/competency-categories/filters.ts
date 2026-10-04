import { createFilters, filter } from "@framework"

export const competencyCategoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search competencyCategories...",
    placeholderKey: "references.hr.competency-categories.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.competency-categories.filters.is_active",
  }),
  ],
})