import { createFilters, filter } from "@framework"

export const leaveReasonsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leaveReasons...",
    placeholderKey: "references.hr.leave-reasons.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.leave-reasons.filters.is_active",
  }),
  ],
})