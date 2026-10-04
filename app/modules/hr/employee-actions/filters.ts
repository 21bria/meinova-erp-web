import { createFilters, filter } from "@framework"

export const employeeActionsFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search employeeActions...",
    placeholderKey: "hr.employee-actions.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.employee-actions.filters.employee",
  }),
  filter.lookup("requested_by", "Requested By", "/api/hr/employees/lookup/", {
    placement: "advanced",
    labelKey: "hr.employee-actions.filters.requested_by",
  }),
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
    labelKey: "hr.employee-actions.filters.action_type",
  }),
  filter.text("effective_date", "Effective Date", {
    placement: "advanced",
    labelKey: "hr.employee-actions.filters.effective_date",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Applied", value: "applied" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ], {
    placement: "quick",
    labelKey: "hr.employee-actions.filters.status",
  }),
  ],
})