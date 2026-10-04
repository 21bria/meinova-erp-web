import { createFilters, filter } from "@framework"

export const degreesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search degrees...",
    placeholderKey: "references.hr.degrees.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.degrees.filters.is_active",
  }),
  ],
})