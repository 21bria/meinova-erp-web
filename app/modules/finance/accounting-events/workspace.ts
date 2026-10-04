import type {
  AccountingEventsWorkspaceTab,
} from "./composables/useAccountingEventsWorkspace"

import type {
  AccountingEventsOverviewItem,
} from "./components/AccountingEventsOverview.vue"

export const accountingEventsWorkspaceTabs: AccountingEventsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "finance.accounting-events.fields.general",
    "type": "form",
    "fields": null,
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
    "labelKey": "finance.accounting-events.fields.source",
    "type": "form",
    "fields": null,
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
    "key": "payload",
    "label": "Payload",
    "labelKey": "finance.accounting-events.fields.payload",
    "type": "form",
    "fields": null,
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
  }
]

export const accountingEventsWorkspaceDefaultTab: string =
  "general"

export const accountingEventsOverviewItems: AccountingEventsOverviewItem[] =
  [
  {
    key: "event_type",
    label: "Event Type",
    fallback: "-",
  },
  {
    key: "event_date",
    label: "Event Date",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  }
]