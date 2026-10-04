import { createFilters, filter } from "@framework"

export const countriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search countries...",
    placeholderKey: "references.geography.countries.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.geography.countries.filters.is_active",
  }),
  ],
})