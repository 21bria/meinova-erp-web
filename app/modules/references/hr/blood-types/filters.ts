import { createFilters, filter } from "@framework"

export const bloodTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bloodTypes...",
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