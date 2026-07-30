import { createFilters, filter } from "@framework"

export const familyRelationshipsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search familyRelationships...",
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