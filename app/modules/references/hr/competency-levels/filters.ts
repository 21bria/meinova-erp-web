import { createFilters, filter } from "@framework"

export const competencyLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search competencyLevels...",
    placeholderKey: "references.hr.competency-levels.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.competency-levels.filters.is_active",
  }),
  ],
})