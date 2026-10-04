import type {
  AssignmentsWorkspaceTab,
} from "./composables/useAssignmentsWorkspace"

import type {
  AssignmentsOverviewItem,
} from "./components/AssignmentsOverview.vue"

export const assignmentsWorkspaceTabs: AssignmentsWorkspaceTab[] =
  [
  {
    "key": "summary",
    "label": "Summary",
    "labelKey": "assets.assignments.fields.summary",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "AssetMovementSummary",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 5
  },
  {
    "key": "general",
    "label": "General",
    "labelKey": "assets.assignments.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "status",
      "target_custody_type",
      "asset",
      "employee",
      "cross_company_reason",
      "department",
      "pic_employee",
      "location",
      "facility",
      "purpose"
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
    "labelKey": "assets.assignments.tabs.result",
    "type": "form",
    "fields": [
      "company",
      "source_location",
      "is_cross_company",
      "handover_date",
      "handover_condition"
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
    "showOnCreate": false,
    "order": 20
  }
]

export const assignmentsWorkspaceDefaultTab: string =
  "summary"

export const assignmentsOverviewItems: AssignmentsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Document No.",
    fallback: "-",
  },
  {
    key: "status",
    label: "Status",
    fallback: "-",
  }
]