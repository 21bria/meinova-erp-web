import { createFilters, filter } from "@framework"

export const employmentGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employmentGroups...",
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