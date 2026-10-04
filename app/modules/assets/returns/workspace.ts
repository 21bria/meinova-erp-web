import type {
  ReturnsWorkspaceTab,
} from "./composables/useReturnsWorkspace"

import type {
  ReturnsOverviewItem,
} from "./components/ReturnsOverview.vue"

export const returnsWorkspaceTabs: ReturnsWorkspaceTab[] =
  [
  {
    "key": "summary",
    "label": "Summary",
    "labelKey": "assets.returns.fields.summary",
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
    "labelKey": "assets.returns.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "status",
      "asset",
      "reason",
      "destination_location",
      "destination_facility",
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
    "key": "source",
    "label": "Source",
    "labelKey": "assets.returns.tabs.source",
    "type": "form",
    "fields": [
      "company",
      "source_custody_type",
      "source_employee",
      "source_department",
      "source_pic_employee",
      "source_location"
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
  },
  {
    "key": "result",
    "label": "Result",
    "labelKey": "assets.returns.tabs.result",
    "type": "form",
    "fields": [
      "return_date",
      "return_condition"
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
    "order": 30
  }
]

export const returnsWorkspaceDefaultTab: string =
  "summary"

export const returnsOverviewItems: ReturnsOverviewItem[] =
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