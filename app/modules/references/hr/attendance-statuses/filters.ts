import { createFilters, filter } from "@framework"

export const attendanceStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search attendanceStatuses...",
    placeholderKey: "references.hr.attendance-statuses.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.attendance-statuses.filters.is_active",
  }),
  ],
})