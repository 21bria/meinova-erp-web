import { createFilters, filter } from "@framework"

export const definitionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search definitions...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("company", "Company", null, {
    placement: "advanced",
  }),
  ],
})