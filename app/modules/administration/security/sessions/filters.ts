import { createFilters, filter } from "@framework"

export const sessionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search sessions...",
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