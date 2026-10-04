import { createFilters, filter } from "@framework"

export const candidateStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search candidateStatuses...",
    placeholderKey: "references.hr.candidate-statuses.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.candidate-statuses.filters.is_active",
  }),
  ],
})