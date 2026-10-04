import type {
  AccountingPoliciesWorkspaceTab,
} from "./composables/useAccountingPoliciesWorkspace"

import type {
  AccountingPoliciesOverviewItem,
} from "./components/AccountingPoliciesOverview.vue"

export const accountingPoliciesWorkspaceTabs: AccountingPoliciesWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "finance.accounting-policies.fields.general",
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
    "key": "rules",
    "label": "Rules",
    "labelKey": "finance.accounting-policies.tabs.rules",
    "type": "resource",
    "fields": [
      {
        "key": "sequence",
        "type": "integer",
        "widget": "integer",
        "label": "No.",
        "labelKey": "finance.accounting-policies.rules.fields.sequence",
        "default": 1,
        "table": true,
        "order": 10,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "sequence"
      },
      {
        "key": "name",
        "type": "text",
        "widget": "text",
        "label": "Rule",
        "labelKey": "finance.accounting-policies.rules.fields.name",
        "required": true,
        "table": true,
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "name"
      },
      {
        "key": "conditions",
        "type": "json",
        "widget": "json",
        "label": "Conditions",
        "labelKey": "finance.accounting-policies.rules.fields.conditions",
        "required": false,
        "table": false,
        "order": 30,
        "help_text": "Bentuknya sama dengan syarat step approval: {\"field\": ..., \"op\": ..., \"value\": ...} digabung all/any/not. Kosong = selalu cocok.",
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "conditions"
      },
      {
        "key": "iterate_over",
        "type": "text",
        "widget": "text",
        "label": "Iterate Over",
        "labelKey": "finance.accounting-policies.rules.fields.iterate_over",
        "required": false,
        "table": true,
        "order": 40,
        "help_text": "Kunci daftar di dalam data kejadian yang dijalankan per baris, mis. `components`. Kosong = data dinilai utuh.",
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "iterate_over"
      },
      {
        "key": "stop_on_match",
        "type": "boolean",
        "widget": "switch",
        "label": "Stop On Match",
        "labelKey": "finance.accounting-policies.rules.fields.stop_on_match",
        "default": false,
        "table": false,
        "order": 50,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "stop_on_match"
      }
    ],
    "modes": null,
    "endpoint": "/api/finance/accounting-policy-rules/",
    "module": null,
    "foreignKey": "policy",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 20
  }
]

export const accountingPoliciesWorkspaceDefaultTab: string =
  "general"

export const accountingPoliciesOverviewItems: AccountingPoliciesOverviewItem[] =
  [
  {
    key: "code",
    label: "Code",
    fallback: "-",
  },
  {
    key: "event_type",
    label: "Event Type",
    fallback: "-",
  }
]