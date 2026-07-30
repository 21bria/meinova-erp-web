import { createFilters, filter } from "@framework"

export const divisionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search division...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
  }),
  filter.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
    placement: "quick",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
  }),
  filter.lookup("branch", "Branch", null, {
    placement: "advanced",
  }),
  ],
})