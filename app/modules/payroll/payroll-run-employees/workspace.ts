import type {
  PayrollRunEmployeesWorkspaceTab,
} from "./composables/usePayrollRunEmployeesWorkspace"

import type {
  PayrollRunEmployeesOverviewItem,
} from "./components/PayrollRunEmployeesOverview.vue"

export const payrollRunEmployeesWorkspaceTabs: PayrollRunEmployeesWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "payroll.payroll-run-employees.tabs.general",
    "type": "form",
    "fields": [
      "run",
      "employee",
      "department",
      "basic_salary",
      "gross_earning",
      "total_deduction",
      "tax_amount",
      "net_pay",
      "employer_contribution",
      "status",
      "is_excluded",
      "exclusion_reason",
      "notes"
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
    "key": "days",
    "label": "Days & Hours",
    "labelKey": "payroll.payroll-run-employees.tabs.days",
    "type": "form",
    "fields": [
      "period_days",
      "working_days",
      "paid_days",
      "attendance_days",
      "absent_days",
      "leave_days",
      "unpaid_leave_days",
      "overtime_hours",
      "proration_method",
      "attendance_deduction_method",
      "proration_method_label",
      "proration_base_days",
      "proration_factor",
      "paid_leave_days",
      "attendance_deduction_method_label",
      "deduction_base_days",
      "absence_deduction",
      "unpaid_leave_deduction"
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
  },
  {
    "key": "breakdown",
    "label": "Component Breakdown",
    "labelKey": "payroll.payroll-run-employees.tabs.breakdown",
    "type": "form",
    "fields": [
      "components_summary"
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
    "order": 25
  },
  {
    "key": "snapshot",
    "label": "Payroll Snapshot",
    "labelKey": "payroll.payroll-run-employees.tabs.snapshot",
    "type": "form",
    "fields": [
      "payroll_group",
      "salary_grade",
      "salary_level",
      "tax_status",
      "overtime_group",
      "allowance_template",
      "deduction_template",
      "payroll_policy",
      "pay_basis",
      "payroll_policy_label",
      "daily_rate",
      "join_date",
      "termination_date"
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
    "order": 30
  }
]

export const payrollRunEmployeesWorkspaceDefaultTab: string =
  "general"

export const payrollRunEmployeesOverviewItems: PayrollRunEmployeesOverviewItem[] =
  [
  {
    key: "employee_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "basic_salary",
    label: "Basic Salary",
    fallback: "-",
  },
  {
    key: "gross_earning",
    label: "Gross Earning",
    fallback: "-",
  },
  {
    key: "net_pay",
    label: "Net Pay",
    fallback: "-",
  }
]