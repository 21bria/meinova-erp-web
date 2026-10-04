import { createFilters, filter } from "@framework"

export const positionFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search position...",
    placeholderKey: "administration.organization.position.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.organization.position.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "quick",
    labelKey: "administration.organization.position.filters.branch",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "administration.organization.position.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
    labelKey: "administration.organization.position.filters.division",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch","location_id":"$location"},
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "administration.organization.position.filters.department",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location","division_id":"$division"},
  }),
  filter.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
    placement: "advanced",
    labelKey: "administration.organization.position.filters.section",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","location_id":"$location","division_id":"$division","department_id":"$department"},
  }),
  filter.lookup("job_category", "Job Category", "/api/administration/references/hr/lookup/job-categories/", {
    placement: "advanced",
    labelKey: "administration.organization.position.filters.job_category",
  }),
  filter.lookup("job_level", "Job Level", "/api/administration/references/hr/lookup/job-levels/", {
    placement: "advanced",
    labelKey: "administration.organization.position.filters.job_level",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.position.filters.is_active",
  }),
  filter.select("is_manager", "Is manager", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.organization.position.filters.is_manager",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): reports_to
  ],
})