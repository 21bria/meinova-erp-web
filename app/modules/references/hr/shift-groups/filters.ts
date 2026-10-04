import { createFilters, filter } from "@framework"

export const shiftGroupsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search shiftGroups...",
    placeholderKey: "references.hr.shift-groups.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.shift-groups.filters.is_active",
  }),
  ],
})