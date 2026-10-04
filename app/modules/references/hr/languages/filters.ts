import { createFilters, filter } from "@framework"

export const languagesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search languages...",
    placeholderKey: "references.hr.languages.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.languages.filters.is_active",
  }),
  ],
})