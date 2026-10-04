import { createFilters, filter } from "@framework"

export const trainingParticipantsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search trainingParticipants...",
    placeholderKey: "hr.training-participants.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("program", "Program", "/api/hr/lookup/training-programs/", {
    placement: "advanced",
    labelKey: "hr.training-participants.filters.program",
  }),
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.training-participants.filters.employee",
  }),
  filter.select("status", "Status", [
    { label: "Registered", value: "registered" },
    { label: "Attended", value: "attended" },
    { label: "Absent", value: "absent" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.training-participants.filters.status",
  }),
  filter.select("is_passed", "Passed", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.training-participants.filters.is_passed",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.training-participants.filters.is_active",
  }),
  ],
})