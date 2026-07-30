import { createFilters, filter } from "@framework"

export const religionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search religions...",
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