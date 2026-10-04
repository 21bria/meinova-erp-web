import type {
  AttendanceWorkspaceTab,
} from "./composables/useAttendanceWorkspace"

import type {
  AttendanceOverviewItem,
} from "./components/AttendanceOverview.vue"

export const attendanceWorkspaceTabs: AttendanceWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.attendance.tabs.general",
    "type": "form",
    "fields": [
      "employee",
      "company",
      "branch",
      "location",
      "work_date",
      "shift",
      "status",
      "source"
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
    "labelKey": "hr.attendance.tabs.time",
    "type": "form",
    "fields": [
      "scheduled_check_in",
      "scheduled_check_out",
      "check_in",
      "check_out",
      "first_check_in",
      "last_check_out",
      "worked_minutes",
      "break_minutes",
      "late_minutes",
      "early_leave_minutes",
      "overtime_minutes",
      "leave_required_days",
      "leave_required_reason",
      "leave_required_override",
      "leave_required_waived",
      "leave_required_waiver_reason",
      "review_decision",
      "review_notes",
      "reviewed_at",
      "leave"
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
    "key": "location",
    "label": "Location",
    "labelKey": "hr.attendance.tabs.location",
    "type": "form",
    "fields": [
      "check_in_latitude",
      "check_in_longitude",
      "check_out_latitude",
      "check_out_longitude",
      "check_in_address",
      "check_out_address",
      "is_geofence_valid"
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
    "key": "approval",
    "label": "Approval",
    "labelKey": "hr.attendance.tabs.approval",
    "type": "form",
    "fields": [
      "approval_status",
      "is_manual_adjustment",
      "adjustment_reason"
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
    "key": "system",
    "label": "System",
    "labelKey": "hr.attendance.tabs.system",
    "type": "form",
    "fields": [
      "external_id",
      "device_code",
      "import_batch_id",
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
    "order": 50
  }
]

export const attendanceWorkspaceDefaultTab: string =
  "general"

export const attendanceOverviewItems: AttendanceOverviewItem[] =
  [
  {
    key: "leave_required_effective",
    label: "Leave Required",
    fallback: "-",
  },
  {
    key: "leave_obligation_label",
    label: "Obligation",
    fallback: "-",
  }
]