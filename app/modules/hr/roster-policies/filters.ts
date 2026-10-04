import { createFilters, filter } from "@framework"

export const rosterPoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rosterPolicies...",
    placeholderKey: "hr.roster-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.roster-policies.filters.company",
  }),
  filter.lookup("location", "Site / Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.roster-policies.filters.location",
    lookupParams: {"company_id":"$company"},
  }),
  filter.select("is_default", "Default For This Site", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-policies.filters.is_default",
  }),
  filter.select("roster_start_basis", "Cycle Start Basis", [
    { label: "Work Start Date", value: "work_start" },
    { label: "Site Arrival Date", value: "site_arrival" },
    { label: "Travel Departure Date", value: "travel_departure" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-policies.filters.roster_start_basis",
  }),
  filter.select("travel_day_mode", "Travel Day Mode", [
    { label: "Fixed (from policy)", value: "fixed" },
    { label: "Actual Itinerary", value: "actual" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-policies.filters.travel_day_mode",
  }),
  filter.select("credit_enabled", "Enable Rotation Credit", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-policies.filters.credit_enabled",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.roster-policies.filters.is_active",
  }),
  ],
})