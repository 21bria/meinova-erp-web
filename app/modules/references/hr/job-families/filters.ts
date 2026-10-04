import { createFilters, filter } from "@framework"

export const jobFamiliesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search jobFamilies...",
    placeholderKey: "references.hr.job-families.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.job-families.filters.is_active",
  }),
  ],
})