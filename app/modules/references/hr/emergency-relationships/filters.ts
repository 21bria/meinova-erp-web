import { createFilters, filter } from "@framework"

export const emergencyRelationshipsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search emergencyRelationships...",
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