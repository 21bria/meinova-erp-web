import { createFilters, filter } from "@framework"

export const sectionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search section...",
    placeholderKey: "administration.organization.section.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.organization.section.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "quick",
    labelKey: "administration.organization.section.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
    labelKey: "administration.organization.section.filters.division",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "administration.organization.section.filters.department",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location","division_id":"$division"},
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.section.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): branch
  ],
})