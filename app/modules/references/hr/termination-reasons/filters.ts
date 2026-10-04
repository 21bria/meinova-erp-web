import { createFilters, filter } from "@framework"

export const terminationReasonsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search terminationReasons...",
    placeholderKey: "references.hr.termination-reasons.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.termination-reasons.filters.is_active",
  }),
  ],
})