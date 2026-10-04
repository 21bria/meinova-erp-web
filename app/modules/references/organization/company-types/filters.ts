import { createFilters, filter } from "@framework"

export const companyTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search companyTypes...",
    placeholderKey: "references.organization.company-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.organization.company-types.filters.is_active",
  }),
  ],
})