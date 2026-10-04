import { createFilters, filter } from "@framework"

export const jobGradesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search jobGrades...",
    placeholderKey: "references.hr.job-grades.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.job-grades.filters.is_active",
  }),
  ],
})