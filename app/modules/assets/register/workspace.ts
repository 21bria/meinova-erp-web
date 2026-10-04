import type {
  RegisterWorkspaceTab,
} from "./composables/useRegisterWorkspace"

import type {
  RegisterOverviewItem,
} from "./components/RegisterOverview.vue"

export const registerWorkspaceTabs: RegisterWorkspaceTab[] =
  [
  {
    "key": "overview",
    "label": "Overview",
    "labelKey": "assets.register.fields.overview",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "AssetOverview",
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
    "labelKey": "assets.register.tabs.general",
    "type": "form",
    "fields": [
      "asset_code",
      "status",
      "company",
      "category",
      "name",
      "description",
      "manufacturer",
      "model",
      "serial_number",
      "tag_number",
      "condition"
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
    "key": "placement",
    "label": "Placement",
    "labelKey": "assets.register.tabs.placement",
    "type": "form",
    "fields": [
      "location",
      "facility",
      "custody_type",
      "custody_holder",
      "custody_started_on"
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
    "key": "acquisition",
    "label": "Acquisition",
    "labelKey": "assets.register.tabs.acquisition",
    "type": "form",
    "fields": [
      "acquisition_date",
      "acquisition_reference",
      "supplier_name",
      "warranty_until"
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
    "key": "custody_history",
    "label": "Custody History",
    "labelKey": "assets.register.fields.custody_history",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "AssetCustodyHistory",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 40
  },
  {
    "key": "condition_history",
    "label": "Condition History",
    "labelKey": "assets.register.fields.condition_history",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "AssetConditionHistory",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 50
  },
  {
    "key": "documents",
    "label": "Documents",
    "labelKey": "assets.register.fields.documents",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "AssetDocuments",
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

export const registerWorkspaceDefaultTab: string =
  "overview"

export const registerOverviewItems: RegisterOverviewItem[] =
  [
  {
    key: "asset_code",
    label: "Asset Code",
    fallback: "-",
  },
  {
    key: "status",
    label: "Status",
    fallback: "-",
  },
  {
    key: "name",
    label: "Name",
    fallback: "-",
  }
]