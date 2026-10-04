import { createFilters, filter } from "@framework"

export const leaveTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveTypes...",
    placeholderKey: "references.hr.leave-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.leave-types.filters.is_active",
  }),
  ],
})