import { createFilters, filter } from "@framework"

export const departmentFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search department...",
    placeholderKey: "administration.organization.department.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.organization.department.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "quick",
    labelKey: "administration.organization.department.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
    labelKey: "administration.organization.department.filters.division",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.department.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): branch
  ],
})