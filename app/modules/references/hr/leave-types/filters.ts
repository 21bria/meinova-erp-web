import { createFilters, filter } from "@framework"

export const leaveTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveTypes...",
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