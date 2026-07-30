import { createFilters, filter } from "@framework"

export const competencyLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search competencyLevels...",
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