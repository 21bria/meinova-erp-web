import { createFilters, filter } from "@framework"

export const contractTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search contractTypes...",
    placeholderKey: "references.hr.contract-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.contract-types.filters.is_active",
  }),
  ],
})