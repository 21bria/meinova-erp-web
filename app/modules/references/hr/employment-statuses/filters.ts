import { createFilters, filter } from "@framework"

export const employmentStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employmentStatuses...",
    placeholderKey: "references.hr.employment-statuses.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.employment-statuses.filters.is_active",
  }),
  ],
})