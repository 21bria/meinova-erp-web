import { createFilters, filter } from "@framework"

export const jobLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search jobLevels...",
    placeholderKey: "references.hr.job-levels.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.job-levels.filters.is_active",
  }),
  ],
})