import { createFilters, filter } from "@framework"

export const locationTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search locationTypes...",
    placeholderKey: "references.organization.location-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.organization.location-types.filters.is_active",
  }),
  ],
})