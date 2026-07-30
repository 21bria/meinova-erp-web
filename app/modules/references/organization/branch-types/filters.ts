import { createFilters, filter } from "@framework"

export const branchTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search branchTypes...",
  },

  advanced: true,

  items: [
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})