import { createFilters, filter } from "@framework"

export const citiesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search cities...",
    placeholderKey: "references.geography.cities.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "quick",
    labelKey: "references.geography.cities.filters.province",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.geography.cities.filters.is_active",
  }),
  ],
})