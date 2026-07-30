import { createFilters, filter } from "@framework"

export const performanceTemplatesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search performanceTemplates...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})