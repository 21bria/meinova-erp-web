import { createFilters, filter } from "@framework"

export const branchTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search branchTypes...",
    placeholderKey: "references.organization.branch-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.organization.branch-types.filters.is_active",
  }),
  ],
})