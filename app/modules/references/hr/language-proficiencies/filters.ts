import { createFilters, filter } from "@framework"

export const languageProficienciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search languageProficiencies...",
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