import type {
  RosterAdjustmentsWorkspaceTab,
} from "./composables/useRosterAdjustmentsWorkspace"

import type {
  RosterAdjustmentsOverviewItem,
} from "./components/RosterAdjustmentsOverview.vue"

export const rosterAdjustmentsWorkspaceTabs: RosterAdjustmentsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "Document",
    "labelKey": "hr.roster-adjustments.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "plan",
      "plan_label",
      "employee",
      "employee_number",
      "adjustment_kind",
      "effective_date",
      "reason",
      "reference",
      "status",
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
    "labelKey": "hr.roster-adjustments.tabs.change",
    "type": "form",
    "fields": [
      "days",
      "new_cycle_start",
      "segment",
      "credit_impact",
      "credit_days",
      "credit_balance"
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

export const rosterAdjustmentsWorkspaceDefaultTab: string =
  "general"

export const rosterAdjustmentsOverviewItems: RosterAdjustmentsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Document No.",
    fallback: "-",
  },
  {
    key: "plan_label",
    label: "Roster Plan",
    fallback: "-",
  },
  {
    key: "employee_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "adjustment_kind_label",
    label: "Adjustment Type",
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