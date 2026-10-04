import { createFilters, filter } from "@framework"

export const recruitmentFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search recruitment...",
    placeholderKey: "hr.recruitment.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Open", value: "open" },
    { label: "On Hold", value: "on_hold" },
    { label: "Filled", value: "filled" },
    { label: "Closed", value: "closed" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.recruitment.filters.status",
  }),
  filter.text("open_date", "Open Date", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.open_date",
  }),
  filter.text("close_date", "Close Date", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.close_date",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.branch",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.division",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch","location_id":"$location"},
  }),
  filter.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.department",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch","location_id":"$location","division_id":"$division"},
  }),
  filter.lookup("position", "Position", "/api/administration/organization/lookup/positions/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.position",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch","location_id":"$location","division_id":"$division","department_id":"$department"},
  }),
  filter.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
    placement: "advanced",
    labelKey: "hr.recruitment.filters.employment_type",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.recruitment.filters.is_active",
  }),
  ],
})