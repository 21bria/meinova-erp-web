import { createFilters, filter } from "@framework"

export const recruitmentSourcesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search recruitmentSources...",
    placeholderKey: "references.hr.recruitment-sources.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.recruitment-sources.filters.is_active",
  }),
  ],
})