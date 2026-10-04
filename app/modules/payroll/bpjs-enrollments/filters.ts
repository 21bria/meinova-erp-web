import { createFilters, filter } from "@framework"

export const bpjsEnrollmentsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search bpjsEnrollments...",
    placeholderKey: "payroll.bpjs-enrollments.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-enrollments.filters.employee",
  }),
  filter.lookup("program", "Program", "/api/payroll/bpjs-programs/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-enrollments.filters.program",
  }),
  filter.select("participates", "Participates", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-enrollments.filters.participates",
  }),
  filter.text("enrolled_from", "Enrolled From", {
    placement: "advanced",
    labelKey: "payroll.bpjs-enrollments.filters.enrolled_from",
  }),
  filter.lookup("risk_class", "Risk Class", "/api/payroll/bpjs-risk-classes/lookup/", {
    placement: "advanced",
    labelKey: "payroll.bpjs-enrollments.filters.risk_class",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "payroll.bpjs-enrollments.filters.is_active",
  }),
  ],
})