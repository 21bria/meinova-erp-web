import { createFilters, filter } from "@framework"

export const languagesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search languages...",
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