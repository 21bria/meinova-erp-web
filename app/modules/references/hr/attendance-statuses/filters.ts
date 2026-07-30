import { createFilters, filter } from "@framework"

export const attendanceStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search attendanceStatuses...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})