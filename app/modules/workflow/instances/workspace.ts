import type {
  InstancesWorkspaceTab,
} from "./composables/useInstancesWorkspace"

import type {
  InstancesOverviewItem,
} from "./components/InstancesOverview.vue"

export const instancesWorkspaceTabs: InstancesWorkspaceTab[] =
  [
  {
    "key": "document",
    "label": "Document",
    "labelKey": "workflow.instances.tabs.document",
    "type": "form",
    "fields": [
      "document_number",
      "document_label",
      "module",
      "document_type",
      "subject_employee",
      "company_name",
      "location_name"
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
    "key": "state",
    "label": "Workflow",
    "labelKey": "workflow.instances.tabs.state",
    "type": "form",
    "fields": [
      "status",
      "current_step_name",
      "definition_name",
      "submitted_at",
      "completed_at",
      "submitted_by_name",
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
    "order": 20
  }
]

export const instancesWorkspaceDefaultTab: string =
  "document"

export const instancesOverviewItems: InstancesOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Document No.",
    fallback: "-",
  },
  {
    key: "document_label",
    label: "Document",
    fallback: "-",
  },
  {
    key: "subject_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "current_step_name",
    label: "Waiting At",
    fallback: "-",
  }
]