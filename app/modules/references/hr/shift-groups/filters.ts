import { createFilters, filter } from "@framework"

export const shiftGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search shiftGroups...",
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