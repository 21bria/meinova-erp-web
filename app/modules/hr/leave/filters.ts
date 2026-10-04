import { createFilters, filter } from "@framework"

export const leaveFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leave...",
    placeholderKey: "hr.leave.placeholder.search",
  },

  advanced: true,

  items: [
  filter.text("document_number", "Document No.", {
    placement: "advanced",
    labelKey: "hr.leave.filters.document_number",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.leave.filters.employee",
  }),
  filter.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
    placement: "advanced",
    labelKey: "hr.leave.filters.leave_type",
  }),
  filter.lookup("leave_reason", "Leave Reason", "/api/administration/references/hr/lookup/leave-reasons/", {
    placement: "advanced",
    labelKey: "hr.leave.filters.leave_reason",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Recorded", value: "recorded" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.leave.filters.status",
  }),
  filter.text("start_date", "Start Date", {
    placement: "advanced",
    labelKey: "hr.leave.filters.start_date",
  }),
  filter.text("end_date", "End Date", {
    placement: "advanced",
    labelKey: "hr.leave.filters.end_date",
  }),
  filter.select("is_half_day", "Half Day", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave.filters.is_half_day",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.leave.filters.company",
  }),
  filter.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
    placement: "advanced",
    labelKey: "hr.leave.filters.branch",
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.leave.filters.location",
    lookupParams: {"company_id":"$company","branch_id":"$branch"},
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave.filters.is_active",
  }),
  ],
})