import type {
  OvertimeWorkspaceTab,
} from "./composables/useOvertimeWorkspace"

import type {
  OvertimeOverviewItem,
} from "./components/OvertimeOverview.vue"

export const overtimeWorkspaceTabs: OvertimeWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.overtime.tabs.general",
    "type": "form",
    "fields": [
      "employee",
      "work_date",
      "overtime_type",
      "status",
      "is_paid"
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
    "key": "time",
    "label": "Time & Duration",
    "labelKey": "hr.overtime.tabs.time",
    "type": "form",
    "fields": [
      "start_time",
      "end_time",
      "duration_minutes"
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
    "labelKey": "hr.overtime.tabs.organization",
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
    "key": "notes",
    "label": "Reason & Notes",
    "labelKey": "hr.overtime.tabs.notes",
    "type": "form",
    "fields": [
      "reason",
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
  }
]

export const overtimeWorkspaceDefaultTab: string =
  "general"

export const overtimeOverviewItems: OvertimeOverviewItem[] =
  [
  {
    key: "employee_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "work_date",
    label: "Work Date",
    fallback: "-",
  },
  {
    key: "duration_minutes",
    label: "Duration (minutes)",
    fallback: "-",
  }
]