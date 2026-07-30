import { createFilters, filter } from "@framework"

export const taxStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search taxStatuses...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})