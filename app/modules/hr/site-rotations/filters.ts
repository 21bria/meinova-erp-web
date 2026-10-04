import { createFilters, filter } from "@framework"

export const siteRotationsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search siteRotations...",
    placeholderKey: "hr.site-rotations.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.employee",
    lookupParams: {"feature":"roster"},
  }),
  filter.lookup("roster_crew", "Roster Crew", "/api/administration/calendar/lookup/roster-crews/", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.roster_crew",
    lookupParams: {"company_id":"$company","location_id":"$location"},
  }),
  filter.lookup("roster_policy", "Roster Policy", "/api/administration/references/hr/lookup/roster-policies/", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.roster_policy",
  }),
  filter.select("status", "Status", [
    { label: "Planned", value: "planned" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.site-rotations.filters.status",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.end_date",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.branch",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Site / Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.site-rotations.filters.location",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.site-rotations.filters.is_active",
  }),
  ],
})