import { createFilters, filter } from "@framework"

export const visitorRequestsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search visitorRequests...",
    placeholderKey: "hr.visitor-requests.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("request_date", "Request Date", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.request_date",
  }),
  filter.lookup("requester", "Requester", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.requester",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.company",
  }),
  filter.lookup("location", "Visit Location / Site", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.location",
    dependsOn: "company",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "Under Review", value: "under_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Completed", value: "completed" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.status",
  }),
  filter.lookup("external_visitor", "Visitor", "/api/hr/lookup/external-visitors/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.external_visitor",
  }),
  filter.lookup("visit_purpose", "Visit Purpose", "/api/administration/references/hr/lookup/visit-purposes/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.visit_purpose",
  }),
  filter.lookup("visit_type", "Visit Type", "/api/administration/references/hr/lookup/visit-types/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.visit_type",
  }),
  filter.text("visit_start_date", "Visit Start Date", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.visit_start_date",
  }),
  filter.text("visit_end_date", "Visit End Date", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.visit_end_date",
  }),
  filter.lookup("host_employee", "Host Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.host_employee",
  }),
  filter.select("travel_required", "Travel Required", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.travel_required",
  }),
  filter.text("departure_date", "Departure Date", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.departure_date",
  }),
  filter.text("return_date", "Return Date", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.return_date",
  }),
  filter.lookup("transport_mode", "Transportation", "/api/administration/references/hr/lookup/transport-modes/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.transport_mode",
  }),
  filter.select("ticket_required", "Ticket Required", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.ticket_required",
  }),
  filter.select("accommodation_required", "Accommodation Required", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.accommodation_required",
  }),
  filter.lookup("accommodation_type", "Accommodation Type", "/api/administration/references/hr/lookup/accommodation-types/", {
    placement: "advanced",
    labelKey: "hr.visitor-requests.filters.accommodation_type",
  }),
  filter.select("pickup_required", "Airport / Station Pickup", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.pickup_required",
  }),
  filter.select("vehicle_required", "Vehicle Required", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.vehicle_required",
  }),
  filter.select("arrival_status", "Arrival Status", [
    { label: "Expected", value: "expected" },
    { label: "Arrived", value: "arrived" },
    { label: "Checked In", value: "checked_in" },
    { label: "Checked Out", value: "checked_out" },
    { label: "No Show", value: "no_show" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.arrival_status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.visitor-requests.filters.is_active",
  }),
  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu kosong): checked_in_by, checked_out_by
  ],
})