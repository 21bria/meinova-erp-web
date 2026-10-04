import type {
  TransfersWorkspaceTab,
} from "./composables/useTransfersWorkspace"

import type {
  TransfersOverviewItem,
} from "./components/TransfersOverview.vue"

export const transfersWorkspaceTabs: TransfersWorkspaceTab[] =
  [
  {
    "key": "summary",
    "label": "Summary",
    "labelKey": "assets.transfers.fields.summary",
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
    "labelKey": "assets.transfers.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "status",
      "asset",
      "target_custody_type",
      "reason",
      "target_employee",
      "cross_company_reason",
      "target_department",
      "target_pic_employee",
      "target_location",
      "target_facility",
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
    "labelKey": "assets.transfers.tabs.source",
    "type": "form",
    "fields": [
      "company",
      "source_custody_type",
      "source_employee",
      "source_department",
      "source_pic_employee",
      "source_location",
      "source_facility"
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
    "labelKey": "assets.transfers.tabs.result",
    "type": "form",
    "fields": [
      "is_cross_company",
      "transfer_date",
      "transfer_condition"
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

export const transfersWorkspaceDefaultTab: string =
  "summary"

export const transfersOverviewItems: TransfersOverviewItem[] =
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