import { createFilters, filter } from "@framework"

export const skillLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search skillLevels...",
    placeholderKey: "references.hr.skill-levels.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.skill-levels.filters.is_active",
  }),
  ],
})