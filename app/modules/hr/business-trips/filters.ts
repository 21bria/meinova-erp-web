import { createFilters, filter } from "@framework"

export const businessTripsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search businessTrips...",
    placeholderKey: "hr.business-trips.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("document_number", "Document No.", {
    placement: "advanced",
    labelKey: "hr.business-trips.filters.document_number",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.business-trips.filters.employee",
    lookupParams: {"feature":"business_trip"},
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.business-trips.filters.company",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "On Trip", value: "on_trip" },
    { label: "Completed", value: "completed" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.business-trips.filters.status",
  }),
  filter.select("purpose_category", "Purpose", [
    { label: "Official Duty", value: "duty" },
    { label: "Site Visit", value: "site_visit" },
    { label: "Meeting", value: "meeting" },
    { label: "Training", value: "training" },
    { label: "Audit / Inspection", value: "audit" },
    { label: "Other", value: "other" },
  ], {
    placement: "quick",
    labelKey: "hr.business-trips.filters.purpose_category",
  }),
  filter.select("destination_type", "Destination Type", [
    { label: "Company Location", value: "internal_location" },
    { label: "External — Domestic", value: "external_domestic" },
    { label: "External — International", value: "external_international" },
  ], {
    placement: "quick",
    labelKey: "hr.business-trips.filters.destination_type",
  }),
  filter.lookup("destination_location", "Destination Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.business-trips.filters.destination_location",
  }),
  ],
})