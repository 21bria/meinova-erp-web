import { createFilters, filter } from "@framework"

export const notificationRulesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search notificationRules...",
    placeholderKey: "administration.notification-rules.placeholder.search",
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
    labelKey: "administration.notification-rules.filters.event",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "administration.notification-rules.filters.company",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.notification-rules.filters.is_active",
  }),
  filter.select("recipient_type", "Recipient", [
    { label: "Pegawai Bersangkutan", value: "subject" },
    { label: "Pengaju", value: "submitter" },
    { label: "Approver yang Sedang Ditagih", value: "pending_approver" },
    { label: "Penyiap Dokumen", value: "preparer" },
    { label: "Atasan Langsung", value: "manager" },
    { label: "Kepala Departemen", value: "department_head" },
    { label: "Pemegang Role", value: "role" },
    { label: "Pengguna Tertentu", value: "user" },
  ], {
    placement: "quick",
    labelKey: "administration.notification-rules.filters.recipient_type",
  }),
  filter.lookup("role", "Role", "/api/accounts/lookup/roles/", {
    placement: "advanced",
    labelKey: "administration.notification-rules.filters.role",
  }),
  filter.lookup("user", "User", "/api/accounts/lookup/users/", {
    placement: "advanced",
    labelKey: "administration.notification-rules.filters.user",
  }),
  filter.select("send_in_app", "Bell", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.notification-rules.filters.send_in_app",
  }),
  filter.select("send_email", "Email", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.notification-rules.filters.send_email",
  }),
  ],
})