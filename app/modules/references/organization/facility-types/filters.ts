import { createFilters, filter } from "@framework"

export const facilityTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search facilityTypes...",
    placeholderKey: "references.organization.facility-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.organization.facility-types.filters.is_active",
  }),
  ],
})