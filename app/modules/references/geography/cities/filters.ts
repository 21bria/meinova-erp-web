import { createFilters, filter } from "@framework"

export const citiesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search cities...",
  },

  advanced: true,

  items: [
  filter.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})