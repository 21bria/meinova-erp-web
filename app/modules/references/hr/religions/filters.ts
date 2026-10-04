import { createFilters, filter } from "@framework"

export const religionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search religions...",
    placeholderKey: "references.hr.religions.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.religions.filters.is_active",
  }),
  ],
})