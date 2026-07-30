import { createFilters, filter } from "@framework"

export const maritalStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search maritalStatuses...",
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