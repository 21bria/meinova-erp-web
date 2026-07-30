import { createFilters, filter } from "@framework"

export const userFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search user...",
  },

  advanced: false,

  items: [
    filter.select("is_active", "Status", [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ], {
      placement: "quick",
    }),

    filter.select("is_staff", "Staff", [
      { label: "Staff", value: "true" },
      { label: "Non Staff", value: "false" },
    ], {
      placement: "advanced",
    }),
  ],
})