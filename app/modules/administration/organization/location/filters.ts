import { createFilters, filter } from "@framework"

export const locationFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search location...",
    placeholderKey: "administration.organization.location.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.organization.location.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "quick",
    labelKey: "administration.organization.location.filters.branch",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location_type", "Location Type", "/api/administration/references/organization/lookup/location-types/", {
    placement: "quick",
    labelKey: "administration.organization.location.filters.location_type",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.location.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): country, province, city
  ],
})