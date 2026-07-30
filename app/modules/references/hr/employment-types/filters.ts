import { createFilters, filter } from "@framework"

export const employmentTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employmentTypes...",
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