import { createFilters, filter } from "@framework"

export const kpiWeightTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search kpiWeightTypes...",
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