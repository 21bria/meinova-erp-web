import { createFilters, filter } from "@framework"

export const performanceTemplatesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search performanceTemplates...",
    placeholderKey: "references.hr.performance-templates.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "references.hr.performance-templates.filters.is_active",
  }),
  ],
})