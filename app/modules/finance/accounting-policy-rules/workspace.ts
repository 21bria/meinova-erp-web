import type {
  AccountingPolicyRulesWorkspaceTab,
} from "./composables/useAccountingPolicyRulesWorkspace"

import type {
  AccountingPolicyRulesOverviewItem,
} from "./components/AccountingPolicyRulesOverview.vue"

export const accountingPolicyRulesWorkspaceTabs: AccountingPolicyRulesWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "finance.accounting-policy-rules.fields.general",
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
    "key": "lines",
    "label": "Journal Line Templates",
    "labelKey": "finance.accounting-policy-rules.tabs.lines",
    "type": "resource",
    "fields": [
      {
        "key": "sequence",
        "type": "integer",
        "widget": "integer",
        "label": "No.",
        "labelKey": "finance.accounting-policy-rules.lines.fields.sequence",
        "default": 1,
        "table": true,
        "order": 10,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "sequence"
      },
      {
        "key": "side",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "Debit",
            "value": "debit"
          },
          {
            "label": "Credit",
            "value": "credit"
          }
        ],
        "label": "Side",
        "labelKey": "finance.accounting-policy-rules.lines.fields.side",
        "display_key": "side_label",
        "required": true,
        "table": true,
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "side_label"
      },
      {
        "key": "mapping_key",
        "type": "text",
        "widget": "text",
        "label": "Mapping Key",
        "labelKey": "finance.accounting-policy-rules.lines.fields.mapping_key",
        "required": false,
        "table": true,
        "order": 30,
        "help_text": "Peran akuntansi yang dicari di Account Mapping. Isi ini atau Account — salah satunya wajib.",
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "mapping_key"
      },
      {
        "key": "account",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/finance/lookup/accounts/",
        "label": "Account (direct)",
        "labelKey": "finance.accounting-policy-rules.lines.fields.account",
        "display_key": "account_name",
        "required": false,
        "table": true,
        "order": 40,
        "help_text": "Untuk kasus yang memang tidak bercabang.",
        "endpoint": "/api/finance/lookup/accounts/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "account_name"
      },
      {
        "key": "amount_source",
        "type": "text",
        "widget": "text",
        "label": "Amount Source",
        "labelKey": "finance.accounting-policy-rules.lines.fields.amount_source",
        "required": true,
        "table": true,
        "order": 50,
        "help_text": "Jalur nilai di data kejadian, boleh menembus titik (`employer.bpjs_health`).",
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "amount_source"
      },
      {
        "key": "dimension_sources",
        "type": "json",
        "widget": "json",
        "label": "Dimension Sources",
        "labelKey": "finance.accounting-policy-rules.lines.fields.dimension_sources",
        "required": false,
        "table": false,
        "order": 60,
        "help_text": "Peta {kode dimensi: jalur data}, mis. {\"cost_center\": \"cost_center_id\"}.",
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "dimension_sources"
      },
      {
        "key": "description_template",
        "type": "text",
        "widget": "text",
        "label": "Description Template",
        "labelKey": "finance.accounting-policy-rules.lines.fields.description_template",
        "required": false,
        "table": false,
        "order": 70,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "description_template"
      },
      {
        "key": "skip_when_zero",
        "type": "boolean",
        "widget": "switch",
        "label": "Skip When Zero",
        "labelKey": "finance.accounting-policy-rules.lines.fields.skip_when_zero",
        "default": true,
        "table": false,
        "order": 80,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "skip_when_zero"
      }
    ],
    "modes": null,
    "endpoint": "/api/finance/accounting-policy-lines/",
    "module": null,
    "foreignKey": "rule",
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

export const accountingPolicyRulesWorkspaceDefaultTab: string =
  "general"

export const accountingPolicyRulesOverviewItems: AccountingPolicyRulesOverviewItem[] =
  []