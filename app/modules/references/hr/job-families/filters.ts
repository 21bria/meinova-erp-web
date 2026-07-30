import { createFilters, filter } from "@framework"

export const jobFamiliesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search jobFamilies...",
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