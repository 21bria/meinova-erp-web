import { createFilters, filter } from "@framework"

export const departmentFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search department...",
  },

  advanced: true,

  items: [
  filter.lookup("branch", "Branch", null, {
    placement: "advanced",
  }),
  ],
})