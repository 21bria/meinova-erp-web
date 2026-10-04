import { createFilters, filter } from "@framework"

export const holidayFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search holiday...",
    placeholderKey: "administration.calendar.holiday.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("scope", "Scope", [
    { label: "National / All Companies", value: "GLOBAL" },
    { label: "Company", value: "COMPANY" },
    { label: "Location", value: "LOCATION" },
    { label: "Selected Companies", value: "SELECTED_COMPANIES" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.holiday.filters.scope",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "quick",
    labelKey: "administration.calendar.holiday.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "quick",
    labelKey: "administration.calendar.holiday.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company"},
  }),
  filter.select("source", "Source", [
    { label: "Manual", value: "MANUAL" },
    { label: "Import", value: "IMPORT" },
    { label: "Google Calendar", value: "GOOGLE" },
    { label: "Government", value: "GOVERNMENT" },
    { label: "ICS Feed", value: "ICS" },
  ], {
    placement: "advanced",
    labelKey: "administration.calendar.holiday.filters.source",
  }),
  filter.select("sync_status", "Sync status", [
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Pending Review", value: "PENDING" },
    { label: "Rejected", value: "REJECTED" },
  ], {
    placement: "advanced",
    labelKey: "administration.calendar.holiday.filters.sync_status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.holiday.filters.is_active",
  }),
  filter.text("date", "Date", {
    placement: "advanced",
    labelKey: "administration.calendar.holiday.filters.date",
  }),
  filter.text("country_code", "Country code", {
    placement: "advanced",
    labelKey: "administration.calendar.holiday.filters.country_code",
  }),
  filter.select("is_national", "Is national", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.holiday.filters.is_national",
  }),
  filter.select("is_recurring", "Is recurring", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.calendar.holiday.filters.is_recurring",
  }),
  ],
})