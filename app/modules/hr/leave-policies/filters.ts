import { createFilters, filter } from "@framework"

export const leavePoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search leavePolicies...",
    placeholderKey: "hr.leave-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
    placement: "advanced",
    labelKey: "hr.leave-policies.filters.leave_type",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.leave-policies.filters.company",
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
    labelKey: "hr.leave-policies.filters.employee_group",
  }),
  filter.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
    placement: "advanced",
    labelKey: "hr.leave-policies.filters.employment_type",
  }),
  filter.select("uses_balance", "Uses Balance", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.uses_balance",
  }),
  filter.select("prorate_first_period", "Prorate First Period", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.prorate_first_period",
  }),
  filter.select("accrual", "Accrual", [
    { label: "Upfront", value: "upfront" },
    { label: "Monthly Accrual", value: "monthly" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.accrual",
  }),
  filter.select("period_basis", "Period Basis", [
    { label: "Calendar Year", value: "calendar" },
    { label: "Employment Anniversary", value: "join_date" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.period_basis",
  }),
  filter.select("allow_carry_over", "Allow Carry Over", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.allow_carry_over",
  }),
  filter.select("per_event", "Per Event", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.per_event",
  }),
  filter.select("document_required", "Document Required", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.document_required",
  }),
  filter.select("history_check", "History Check", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.history_check",
  }),
  filter.select("history_action", "History Action", [
    { label: "None", value: "none" },
    { label: "Warning", value: "warn" },
    { label: "Warning + Review", value: "review" },
    { label: "Block", value: "block" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.history_action",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.leave-policies.filters.is_active",
  }),
  ],
})