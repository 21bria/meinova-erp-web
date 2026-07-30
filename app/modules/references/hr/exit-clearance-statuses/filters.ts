import { createFilters, filter } from "@framework"

export const exitClearanceStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search exitClearanceStatuses...",
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