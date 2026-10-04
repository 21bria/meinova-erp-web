import { createFilters, filter } from "@framework"

export const gendersFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search genders...",
    placeholderKey: "references.hr.genders.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.genders.filters.is_active",
  }),
  ],
})