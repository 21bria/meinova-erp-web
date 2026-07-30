import { createFilters, filter } from "@framework"

export const educationsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search educations...",
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