import { createFilters, filter } from "@framework"

export const maritalStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search maritalStatuses...",
    placeholderKey: "references.hr.marital-statuses.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.marital-statuses.filters.is_active",
  }),
  ],
})