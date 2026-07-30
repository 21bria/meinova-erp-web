import { createFilters, filter } from "@framework"

export const branchFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search branch...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
  }),
  filter.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
    placement: "advanced",
  }),
  filter.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
    placement: "advanced",
  }),
  filter.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
    placement: "advanced",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  ],
})