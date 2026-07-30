import { createFilters, filter } from "@framework"

export const roleFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search role...",
  },
  advanced: false,
  items: [
    filter.select("is_active", "Status", [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ], { placement: "quick" })
  ],
})