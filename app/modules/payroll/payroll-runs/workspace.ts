import type {
  PayrollRunsWorkspaceTab,
} from "./composables/usePayrollRunsWorkspace"

import type {
  PayrollRunsOverviewItem,
} from "./components/PayrollRunsOverview.vue"

export const payrollRunsWorkspaceTabs: PayrollRunsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "payroll.payroll-runs.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "period",
      "name",
      "run_type",
      "branch",
      "location",
      "department",
      "section",
      "status",
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
    "key": "result",
    "label": "Result",
    "labelKey": "payroll.payroll-runs.tabs.result",
    "type": "form",
    "fields": [
      "employee_count",
      "total_earning",
      "total_deduction",
      "total_tax",
      "total_net",
      "calculated_at",
      "finalized_at",
      "warnings_acknowledged"
    ],
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 20
  },
  {
    "key": "employees",
    "label": "Employees",
    "labelKey": "payroll.payroll-runs.tabs.employees",
    "type": "resource",
    "fields": [
      {
        "key": "employee",
        "type": "lookup",
        "widget": "lookup",
        "label": "Employee",
        "labelKey": "payroll.payroll-runs.employees.fields.employee",
        "display_key": "employee_name",
        "table": true,
        "order": 10,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "employee_name"
      },
      {
        "key": "department",
        "type": "lookup",
        "widget": "lookup",
        "label": "Department",
        "labelKey": "payroll.payroll-runs.employees.fields.department",
        "display_key": "department_name",
        "table": true,
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "department_name"
      },
      {
        "key": "basic_salary",
        "type": "currency",
        "widget": "currency",
        "label": "Basic",
        "labelKey": "payroll.payroll-runs.employees.fields.basic_salary",
        "table": true,
        "order": 30,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "basic_salary"
      },
      {
        "key": "gross_earning",
        "type": "currency",
        "widget": "currency",
        "label": "Gross",
        "labelKey": "payroll.payroll-runs.employees.fields.gross_earning",
        "table": true,
        "order": 40,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "gross_earning"
      },
      {
        "key": "total_deduction",
        "type": "currency",
        "widget": "currency",
        "label": "Deduction",
        "labelKey": "payroll.payroll-runs.employees.fields.total_deduction",
        "table": true,
        "order": 50,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "total_deduction"
      },
      {
        "key": "tax_amount",
        "type": "currency",
        "widget": "currency",
        "label": "Tax",
        "labelKey": "payroll.payroll-runs.employees.fields.tax_amount",
        "table": true,
        "order": 60,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "tax_amount"
      },
      {
        "key": "net_pay",
        "type": "currency",
        "widget": "currency",
        "label": "Net Pay",
        "labelKey": "payroll.payroll-runs.employees.fields.net_pay",
        "table": true,
        "order": 70,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "net_pay"
      },
      {
        "key": "status",
        "type": "text",
        "widget": "text",
        "label": "Status",
        "labelKey": "payroll.payroll-runs.employees.fields.status",
        "table": true,
        "order": 80,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "status"
      },
      {
        "key": "is_excluded",
        "type": "boolean",
        "widget": "switch",
        "label": "Excluded",
        "labelKey": "payroll.payroll-runs.employees.fields.is_excluded",
        "table": true,
        "order": 90,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "is_excluded"
      }
    ],
    "modes": null,
    "endpoint": "/api/payroll/payroll-run-employees/",
    "module": "payroll/payroll-run-employees",
    "foreignKey": "run",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": true,
    "canCreate": false,
    "showOnCreate": true,
    "order": 30
  }
]

export const payrollRunsWorkspaceDefaultTab: string =
  "general"

export const payrollRunsOverviewItems: PayrollRunsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Run No.",
    fallback: "-",
  },
  {
    key: "employee_count",
    label: "Employees",
    fallback: "-",
  },
  {
    key: "period_name",
    label: "Payroll Period",
    fallback: "-",
  },
  {
    key: "total_earning",
    label: "Total Earning",
    fallback: "-",
  },
  {
    key: "run_type",
    label: "Run Type",
    fallback: "-",
  },
  {
    key: "total_net",
    label: "Total Net Pay",
    fallback: "-",
  },
  {
    key: "status",
    label: "Status",
    fallback: "-",
  }
]