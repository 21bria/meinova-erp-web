import { createFilters, filter } from "@framework"

export const provincesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search provinces...",
    placeholderKey: "references.geography.provinces.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
    placement: "quick",
    labelKey: "references.geography.provinces.filters.country",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.geography.provinces.filters.is_active",
  }),
  ],
})