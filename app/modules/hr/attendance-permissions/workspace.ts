import type {
  AttendancePermissionsWorkspaceTab,
} from "./composables/useAttendancePermissionsWorkspace"

import type {
  AttendancePermissionsOverviewItem,
} from "./components/AttendancePermissionsOverview.vue"

export const attendancePermissionsWorkspaceTabs: AttendancePermissionsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.attendance-permissions.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "employee",
      "permission_type",
      "date",
      "status"
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
    "label": "Time",
    "labelKey": "hr.attendance-permissions.tabs.time",
    "type": "form",
    "fields": [
      "start_time",
      "end_time"
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
    "key": "reason",
    "label": "Reason & Attachment",
    "labelKey": "hr.attendance-permissions.tabs.reason",
    "type": "form",
    "fields": [
      "reason",
      "supporting_document",
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
    "order": 30
  },
  {
    "key": "override",
    "label": "HR Override",
    "labelKey": "hr.attendance-permissions.tabs.override",
    "type": "form",
    "fields": [
      "allow_outside_shift",
      "outside_shift_reason"
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
    "key": "review",
    "label": "Review & Attendance",
    "labelKey": "hr.attendance-permissions.fields.review",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "AttendancePermissionReview",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 60
  }
]

export const attendancePermissionsWorkspaceDefaultTab: string =
  "general"

export const attendancePermissionsOverviewItems: AttendancePermissionsOverviewItem[] =
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
    key: "permission_type_label",
    label: "Permission Type",
    fallback: "-",
  },
  {
    key: "date",
    label: "Date",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "submitted_at",
    label: "Submitted At",
    fallback: "-",
    format: "datetime",
  },
  {
    key: "approved_at",
    label: "Approved At",
    fallback: "-",
    format: "datetime",
  },
  {
    key: "company_name",
    label: "Company",
    fallback: "-",
  },
  {
    key: "location_name",
    label: "Location",
    fallback: "-",
  }
]