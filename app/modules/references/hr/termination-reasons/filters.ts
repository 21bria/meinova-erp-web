import { createFilters, filter } from "@framework"

export const terminationReasonsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search terminationReasons...",
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