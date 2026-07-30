import { createFilters, filter } from "@framework"

export const skillsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search skills...",
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