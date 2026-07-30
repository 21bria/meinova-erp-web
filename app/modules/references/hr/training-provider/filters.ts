import { createFilters, filter } from "@framework"

export const trainingProviderFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search trainingProvider...",
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