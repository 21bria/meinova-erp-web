import { createFilters, filter } from "@framework"

export const rosterCrewFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search rosterCrew...",
    placeholderKey: "administration.calendar.roster-crew.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "administration.calendar.roster-crew.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "administration.calendar.roster-crew.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("work_schedule", "Work Schedule", "/api/administration/references/hr/lookup/work-schedules/", {
    placement: "advanced",
    labelKey: "administration.calendar.roster-crew.filters.work_schedule",
    lookupParams: {"schedule_type":"ROSTER"},
  }),
  filter.text("cycle_start_date", "Cycle Start Date", {
    placement: "advanced",
    labelKey: "administration.calendar.roster-crew.filters.cycle_start_date",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.roster-crew.filters.is_active",
  }),
  ],
})