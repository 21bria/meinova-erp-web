import { createFilters, filter } from "@framework"

export const kpiCategoriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search kpiCategories...",
    placeholderKey: "references.hr.kpi-categories.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.kpi-categories.filters.is_active",
  }),
  ],
})