import { createFilters, filter } from "@framework"

export const employmentStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employmentStatuses...",
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