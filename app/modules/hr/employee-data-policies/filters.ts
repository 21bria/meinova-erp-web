import { createFilters, filter } from "@framework"

export const employeeDataPoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employeeDataPolicies...",
    placeholderKey: "hr.employee-data-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("subject", "Protected Data", [
    { label: "Salary History", value: "history_salary" },
    { label: "Resignation & Termination History", value: "history_separation" },
    { label: "Transfer & Promotion History", value: "history_movement" },
    { label: "Contract & Status History", value: "history_contract" },
    { label: "Identity Numbers (NIK, NPWP, Passport)", value: "field_identity" },
    { label: "Payroll & Salary", value: "field_payroll" },
    { label: "Bank Accounts", value: "field_bank" },
    { label: "Family", value: "field_family" },
    { label: "Medical", value: "field_medical" },
    { label: "Documents", value: "field_document" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-data-policies.filters.subject",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.employee-data-policies.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.employee-data-policies.filters.location",
    dependsOn: ["company"],
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
    labelKey: "hr.employee-data-policies.filters.employee_group",
  }),
  filter.select("allow_self", "The Employee", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-data-policies.filters.allow_self",
  }),
  filter.select("allow_manager", "Direct Manager", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-data-policies.filters.allow_manager",
  }),
  filter.select("allow_department_head", "Department Head", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-data-policies.filters.allow_department_head",
  }),
  filter.lookup("role", "Role", "/api/accounts/lookup/roles/", {
    placement: "advanced",
    labelKey: "hr.employee-data-policies.filters.role",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-data-policies.filters.is_active",
  }),
  ],
})