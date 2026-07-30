import { createFilters, filter } from "@framework"

export const overtimeTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search overtimeTypes...",
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