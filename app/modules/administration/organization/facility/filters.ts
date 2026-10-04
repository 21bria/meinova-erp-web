import { createFilters, filter } from "@framework"

export const facilityFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search facility...",
    placeholderKey: "administration.organization.facility.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.organization.facility.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "administration.organization.facility.filters.branch",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "quick",
    labelKey: "administration.organization.facility.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.lookup("facility_type", "Facility Type", "/api/administration/references/organization/lookup/facility-types/", {
    placement: "quick",
    labelKey: "administration.organization.facility.filters.facility_type",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.facility.filters.is_active",
  }),
  ],
})