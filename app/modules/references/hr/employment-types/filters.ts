import { createFilters, filter } from "@framework"

export const employmentTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employmentTypes...",
    placeholderKey: "references.hr.employment-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.employment-types.filters.is_active",
  }),
  filter.select("requires_contract", "Requires contract", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.employment-types.filters.requires_contract",
  }),
  ],
})