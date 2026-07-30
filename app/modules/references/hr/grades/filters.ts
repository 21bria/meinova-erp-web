import { createFilters, filter } from "@framework"

export const gradesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search grades...",
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