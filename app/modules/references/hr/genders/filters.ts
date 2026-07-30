import { createFilters, filter } from "@framework"

export const gendersFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search genders...",
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