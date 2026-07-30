import { createFilters, filter } from "@framework"

export const countriesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search countries...",
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