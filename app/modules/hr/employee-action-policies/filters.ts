import { createFilters, filter } from "@framework"

export const employeeActionPoliciesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employeeActionPolicies...",
    placeholderKey: "hr.employee-action-policies.placeholder.search",
  },

  advanced: true,

  items: [
  filter.select("action_type", "Action Type", [
    { label: "Contract Extension", value: "contract_extension" },
    { label: "Contract Change", value: "contract_change" },
    { label: "Employment Type Change", value: "employment_type_change" },
    { label: "Probation Change", value: "probation_change" },
    { label: "Employment Status Change", value: "status_change" },
    { label: "Transfer", value: "transfer" },
    { label: "Promotion", value: "promotion" },
    { label: "Demotion", value: "demotion" },
    { label: "Position Change", value: "position_change" },
    { label: "Salary Change", value: "salary_change" },
    { label: "Resignation", value: "resignation" },
    { label: "Termination", value: "termination" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-action-policies.filters.action_type",
  }),
  filter.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
    placement: "advanced",
    labelKey: "hr.employee-action-policies.filters.company",
  }),
  filter.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
    placement: "advanced",
    labelKey: "hr.employee-action-policies.filters.location",
    dependsOn: ["company"],
    lookupParams: {"company_id":"$company"},
  }),
  filter.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
    placement: "advanced",
    labelKey: "hr.employee-action-policies.filters.employee_group",
  }),
  filter.select("initiator_type", "Requested By", [
    { label: "Anyone With Permission", value: "any" },
    { label: "Direct Manager", value: "manager" },
    { label: "Department Head", value: "department_head" },
    { label: "Role Holder", value: "role" },
    { label: "The Employee", value: "employee" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-action-policies.filters.initiator_type",
  }),
  filter.select("allow_on_behalf", "Allow On Behalf", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-action-policies.filters.allow_on_behalf",
  }),
  filter.select("is_active", "Active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-action-policies.filters.is_active",
  }),
  ],
})