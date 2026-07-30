import { createFilters, filter } from "@framework"

export const probationTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search probationTypes...",
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