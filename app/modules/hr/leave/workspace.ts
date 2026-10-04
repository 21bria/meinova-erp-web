import type {
  LeaveWorkspaceTab,
} from "./composables/useLeaveWorkspace"

import type {
  LeaveOverviewItem,
} from "./components/LeaveOverview.vue"

export const leaveWorkspaceTabs: LeaveWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.leave.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "employee",
      "leave_type",
      "leave_reason"
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
    "key": "period",
    "label": "Period",
    "labelKey": "hr.leave.tabs.period",
    "type": "form",
    "fields": [
      "start_date",
      "end_date",
      "is_half_day",
      "total_days"
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
    "key": "organization",
    "label": "Organization",
    "labelKey": "hr.leave.tabs.organization",
    "type": "form",
    "fields": [
      "company",
      "branch",
      "location"
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
  },
  {
    "key": "document",
    "label": "Document & Notes",
    "labelKey": "hr.leave.tabs.document",
    "type": "form",
    "fields": [
      "uploaded_file",
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
    "order": 40
  },
  {
    "key": "approval",
    "label": "Approval",
    "labelKey": "hr.leave.fields.approval",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "WorkflowApprovalTrail",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 50
  }
]

export const leaveWorkspaceDefaultTab: string =
  "general"

export const leaveOverviewItems: LeaveOverviewItem[] =
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
    key: "leave_type_name",
    label: "Leave Type",
    fallback: "-",
  },
  {
    key: "start_date",
    label: "Start Date",
    fallback: "-",
  },
  {
    key: "total_days",
    label: "Total Days",
    fallback: "-",
  }
]