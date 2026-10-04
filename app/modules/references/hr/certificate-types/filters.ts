import { createFilters, filter } from "@framework"

export const certificateTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search certificateTypes...",
    placeholderKey: "references.hr.certificate-types.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.certificate-types.filters.is_active",
  }),
  ],
})