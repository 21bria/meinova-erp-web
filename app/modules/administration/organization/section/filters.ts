import { createFilters, filter } from "@framework"

export const sectionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search section...",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
  }),
  filter.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
    placement: "quick",
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
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