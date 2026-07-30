import { createFilters, filter } from "@framework"

export const recruitmentSourcesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search recruitmentSources...",
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