import { createFilters, filter } from "@framework"

export const skillLevelsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search skillLevels...",
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