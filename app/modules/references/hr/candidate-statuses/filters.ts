import { createFilters, filter } from "@framework"

export const candidateStatusesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search candidateStatuses...",
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