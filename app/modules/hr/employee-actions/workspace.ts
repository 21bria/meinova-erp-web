import type {
  EmployeeActionsWorkspaceTab,
} from "./composables/useEmployeeActionsWorkspace"

import type {
  EmployeeActionsOverviewItem,
} from "./components/EmployeeActionsOverview.vue"

export const employeeActionsWorkspaceTabs: EmployeeActionsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "Document",
    "labelKey": "hr.employee-actions.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "employee",
      "requested_by",
      "action_type",
      "effective_date",
      "status",
      "reason",
      "notes",
      "applied_at",
      "apply_error"
    ],
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 10
  },
  {
    "key": "change",
    "label": "Change Details",
    "labelKey": "hr.employee-actions.tabs.change",
    "type": "form",
    "fields": [
      "current_employment_type_name",
      "proposed_employment_type",
      "proposed_employee_group",
      "confirmation_date",
      "current_employment_status_name",
      "proposed_employment_status",
      "current_contract_type_name",
      "current_contract_start",
      "current_contract_end",
      "proposed_contract_type",
      "proposed_contract_start",
      "proposed_contract_end",
      "current_probation_type_name",
      "proposed_probation_type",
      "proposed_probation_start",
      "proposed_probation_end",
      "current_position_name",
      "current_department_name",
      "current_location_name",
      "proposed_company",
      "proposed_branch",
      "proposed_location",
      "proposed_division",
      "proposed_department",
      "proposed_section",
      "proposed_position",
      "proposed_job_level",
      "proposed_job_grade",
      "proposed_cost_center",
      "proposed_reports_to",
      "current_basic_salary",
      "proposed_basic_salary",
      "proposed_salary_grade",
      "proposed_salary_level",
      "proposed_payroll_group",
      "last_working_date",
      "termination_reason"
    ],
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 20
  }
]

export const employeeActionsWorkspaceDefaultTab: string =
  "general"

export const employeeActionsOverviewItems: EmployeeActionsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Document No.",
    fallback: "-",
  },
  {
    key: "employee_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "action_type_label",
    label: "Action Type",
    fallback: "-",
  },
  {
    key: "effective_date",
    label: "Effective Date",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  }
]