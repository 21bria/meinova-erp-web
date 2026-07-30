import { createFilters, filter } from "@framework"

export const interviewTypesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search interviewTypes...",
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