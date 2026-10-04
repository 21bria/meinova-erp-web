import { createFilters, filter } from "@framework"

export const workCalendarFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search workCalendar...",
    placeholderKey: "administration.calendar.work-calendar.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("scope", "Scope", [
    { label: "All Companies", value: "GLOBAL" },
    { label: "Company", value: "COMPANY" },
    { label: "Location", value: "LOCATION" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.work-calendar.filters.scope",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.calendar.work-calendar.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "quick",
    labelKey: "administration.calendar.work-calendar.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.work-calendar.filters.is_active",
  }),
  filter.select("is_default", "Is default", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.work-calendar.filters.is_default",
  }),
  ],
})