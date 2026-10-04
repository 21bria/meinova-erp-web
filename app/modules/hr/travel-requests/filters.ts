import { createFilters, filter } from "@framework"

export const travelRequestsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search travelRequests...",
    placeholderKey: "hr.travel-requests.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.travel-requests.filters.employee",
    lookupParams: {"feature":"field_break"},
  }),
  filter.lookup("rotation_period", "Roster Block", "/api/hr/lookup/rotation-periods/", {
    placement: "advanced",
    labelKey: "hr.travel-requests.filters.rotation_period",
    dependsOn: "employee",
    lookupParams: {"employee_id":"$employee"},
  }),
  filter.text("start_date", "Off Start", {
    placement: "advanced",
    labelKey: "hr.travel-requests.filters.start_date",
  }),
  filter.text("end_date", "Off End", {
    placement: "advanced",
    labelKey: "hr.travel-requests.filters.end_date",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.travel-requests.filters.status",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.travel-requests.filters.is_active",
  }),
  ],
})