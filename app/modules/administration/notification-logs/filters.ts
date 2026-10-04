import { createFilters, filter } from "@framework"

export const notificationLogsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search notificationLogs...",
    placeholderKey: "administration.notification-logs.placeholder.search",
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
    labelKey: "administration.notification-logs.filters.event",
  }),
  filter.select("channel", "Channel", [
    { label: "In-App", value: "in_app" },
    { label: "Email", value: "email" },
    { label: "Push", value: "push" },
    { label: "SMS", value: "sms" },
  ], {
    placement: "quick",
    labelKey: "administration.notification-logs.filters.channel",
  }),
  filter.select("status", "Status", [
    { label: "Menunggu", value: "pending" },
    { label: "Terkirim", value: "sent" },
    { label: "Gagal", value: "failed" },
    { label: "Dilewati", value: "skipped" },
  ], {
    placement: "quick",
    labelKey: "administration.notification-logs.filters.status",
  }),
  ],
})