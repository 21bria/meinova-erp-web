import { createFilters, filter } from "@framework"

export const nationalitiesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search nationalities...",
    placeholderKey: "references.hr.nationalities.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.nationalities.filters.is_active",
  }),
  ],
})