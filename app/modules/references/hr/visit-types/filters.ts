import { createFilters, filter } from "@framework"

export const visitTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search visitTypes...",
    placeholderKey: "references.hr.visit-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.visit-types.filters.is_active",
  }),
  ],
})