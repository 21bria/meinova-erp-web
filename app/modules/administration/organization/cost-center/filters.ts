import { createFilters, filter } from "@framework"

export const costCenterFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search costCenter...",
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
  filter.lookup("division", "Division", null, {
    placement: "advanced",
  }),
  filter.lookup("department", "Department", null, {
    placement: "advanced",
  }),
  ],
})