import { createFilters, filter } from "@framework"

export const competenciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search competencies...",
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