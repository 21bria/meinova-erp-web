import { createFilters, filter } from "@framework"

export const exitClearanceStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search exitClearanceStatuses...",
    placeholderKey: "references.hr.exit-clearance-statuses.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.exit-clearance-statuses.filters.is_active",
  }),
  ],
})