import { createFilters, filter } from "@framework"

export const rejectionReasonsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rejectionReasons...",
    placeholderKey: "references.hr.rejection-reasons.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.rejection-reasons.filters.is_active",
  }),
  ],
})