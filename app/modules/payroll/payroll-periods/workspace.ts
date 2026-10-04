import type {
  PayrollPeriodsWorkspaceTab,
} from "./composables/usePayrollPeriodsWorkspace"

import type {
  PayrollPeriodsOverviewItem,
} from "./components/PayrollPeriodsOverview.vue"

export const payrollPeriodsWorkspaceTabs: PayrollPeriodsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "payroll.payroll-periods.tabs.general",
    "type": "form",
    "fields": [
      "code",
      "name",
      "company",
      "payroll_group",
      "start_date",
      "end_date",
      "cutoff_date",
      "payment_date",
      "working_days",
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
    "key": "runs",
    "label": "Payroll Runs",
    "labelKey": "payroll.payroll-periods.tabs.runs",
    "type": "resource",
    "fields": [
      {
        "key": "document_number",
        "type": "text",
        "widget": "text",
        "label": "Run No.",
        "labelKey": "payroll.payroll-periods.runs.fields.document_number",
        "table": true,
        "order": 10,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "document_number"
      },
      {
        "key": "run_type",
        "type": "text",
        "widget": "text",
        "label": "Type",
        "labelKey": "payroll.payroll-periods.runs.fields.run_type",
        "table": true,
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "run_type"
      },
      {
        "key": "status",
        "type": "text",
        "widget": "text",
        "label": "Status",
        "labelKey": "payroll.payroll-periods.runs.fields.status",
        "table": true,
        "order": 30,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "status"
      },
      {
        "key": "employee_count",
        "type": "integer",
        "widget": "integer",
        "label": "Employees",
        "labelKey": "payroll.payroll-periods.runs.fields.employee_count",
        "table": true,
        "order": 40,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "employee_count"
      },
      {
        "key": "total_net",
        "type": "currency",
        "widget": "currency",
        "label": "Net Pay",
        "labelKey": "payroll.payroll-periods.runs.fields.total_net",
        "table": true,
        "order": 50,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "total_net"
      }
    ],
    "modes": null,
    "endpoint": "/api/payroll/payroll-runs/",
    "module": "payroll/payroll-runs",
    "foreignKey": "period",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": false,
    "showOnCreate": true,
    "order": 20
  }
]

export const payrollPeriodsWorkspaceDefaultTab: string =
  "general"

export const payrollPeriodsOverviewItems: PayrollPeriodsOverviewItem[] =
  [
  {
    key: "code",
    label: "Period Code",
    fallback: "-",
  },
  {
    key: "name",
    label: "Period Name",
    fallback: "-",
  },
  {
    key: "company_name",
    label: "Company",
    fallback: "-",
  },
  {
    key: "payroll_group_name",
    label: "Payroll Group",
    fallback: "-",
  },
  {
    key: "start_date",
    label: "Start Date",
    fallback: "-",
  },
  {
    key: "end_date",
    label: "End Date",
    fallback: "-",
  },
  {
    key: "status",
    label: "Status",
    fallback: "-",
  }
]