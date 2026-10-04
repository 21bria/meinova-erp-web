import { createFilters, filter } from "@framework"

export const emergencyRelationshipsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search emergencyRelationships...",
    placeholderKey: "references.hr.emergency-relationships.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.emergency-relationships.filters.is_active",
  }),
  ],
})