import { createFilters, filter } from "@framework"

export const bloodTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bloodTypes...",
    placeholderKey: "references.hr.blood-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.blood-types.filters.is_active",
  }),
  ],
})