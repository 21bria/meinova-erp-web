import { createFilters, filter } from "@framework"

export const emailTemplatesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search emailTemplates...",
    placeholderKey: "administration.email-templates.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("event", "Event", [
    { label: "Attendance Exception", value: "hr.attendance_exception" },
    { label: "Asked to Submit Leave", value: "hr.attendance_leave_required" },
    { label: "Employee Birthday", value: "hr.birthday" },
    { label: "Contract Ending Soon", value: "hr.contract_end" },
    { label: "Leave Balance Expiring", value: "hr.leave_balance_expiring" },
    { label: "Probation Ending Soon", value: "hr.probation_end" },
    { label: "Departure Reminder", value: "hr.travel_departure_reminder" },
    { label: "Travel Request Issued", value: "hr.travel_request_issued" },
    { label: "Work Anniversary", value: "hr.work_anniversary" },
    { label: "Submission Approved", value: "workflow.approved" },
    { label: "Document Awaiting Your Approval", value: "workflow.pending_approval" },
    { label: "Submission Rejected", value: "workflow.rejected" },
    { label: "Submission Returned for Revision", value: "workflow.returned" },
  ], {
    placement: "quick",
    labelKey: "administration.email-templates.filters.event",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "administration.email-templates.filters.company",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.email-templates.filters.is_active",
  }),
  ],
})