import { createFilters, filter } from "@framework"

export const competenciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search competencies...",
    placeholderKey: "references.hr.competencies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.competencies.filters.is_active",
  }),
  ],
})