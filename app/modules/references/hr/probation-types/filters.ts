import { createFilters, filter } from "@framework"

export const probationTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search probationTypes...",
    placeholderKey: "references.hr.probation-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.probation-types.filters.is_active",
  }),
  ],
})