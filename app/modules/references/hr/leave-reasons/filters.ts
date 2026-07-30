import { createFilters, filter } from "@framework"

export const leaveReasonsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveReasons...",
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