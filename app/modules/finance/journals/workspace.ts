import type {
  JournalsWorkspaceTab,
} from "./composables/useJournalsWorkspace"

import type {
  JournalsOverviewItem,
} from "./components/JournalsOverview.vue"

export const journalsWorkspaceTabs: JournalsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "finance.journals.fields.general",
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
    "label": "Journal Lines",
    "labelKey": "finance.journals.tabs.lines",
    "type": "resource",
    "fields": [
      {
        "key": "account",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/finance/lookup/accounts/",
        "label": "Account",
        "labelKey": "finance.journals.lines.fields.account",
        "lookup_params": {
          "company_id": "$parent.company"
        },
        "display_key": "account_name",
        "required": true,
        "table": true,
        "order": 10,
        "help_text": "Hanya akun posting yang muncul — akun grup dikecualikan.",
        "endpoint": "/api/finance/lookup/accounts/",
        "dependsOn": null,
        "lookupParams": {
          "company_id": "$parent.company"
        },
        "displayKey": "account_name"
      },
      {
        "key": "description",
        "type": "text",
        "widget": "text",
        "label": "Description",
        "labelKey": "finance.journals.lines.fields.description",
        "table": true,
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "description"
      },
      {
        "key": "debit",
        "type": "currency",
        "widget": "currency",
        "label": "Debit",
        "labelKey": "finance.journals.lines.fields.debit",
        "decimal_places": 2,
        "default": 0,
        "table": true,
        "order": 30,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "debit"
      },
      {
        "key": "credit",
        "type": "currency",
        "widget": "currency",
        "label": "Credit",
        "labelKey": "finance.journals.lines.fields.credit",
        "decimal_places": 2,
        "default": 0,
        "table": true,
        "order": 40,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "credit"
      },
      {
        "key": "location",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/administration/organization/lookup/locations/",
        "label": "Site",
        "labelKey": "finance.journals.lines.fields.location",
        "lookup_params": {
          "company_id": "$parent.company"
        },
        "display_key": "location_name",
        "required": false,
        "table": true,
        "order": 50,
        "endpoint": "/api/administration/organization/lookup/locations/",
        "dependsOn": null,
        "lookupParams": {
          "company_id": "$parent.company"
        },
        "displayKey": "location_name"
      },
      {
        "key": "department",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/administration/organization/lookup/departments/",
        "label": "Department",
        "labelKey": "finance.journals.lines.fields.department",
        "lookup_params": {
          "company_id": "$parent.company"
        },
        "display_key": "department_name",
        "required": false,
        "table": false,
        "order": 60,
        "endpoint": "/api/administration/organization/lookup/departments/",
        "dependsOn": null,
        "lookupParams": {
          "company_id": "$parent.company"
        },
        "displayKey": "department_name"
      },
      {
        "key": "cost_center",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/administration/organization/lookup/cost-centers/",
        "label": "Cost Center",
        "labelKey": "finance.journals.lines.fields.cost_center",
        "lookup_params": {
          "company_id": "$parent.company"
        },
        "display_key": "cost_center_name",
        "required": false,
        "table": true,
        "order": 70,
        "endpoint": "/api/administration/organization/lookup/cost-centers/",
        "dependsOn": null,
        "lookupParams": {
          "company_id": "$parent.company"
        },
        "displayKey": "cost_center_name"
      }
    ],
    "modes": null,
    "endpoint": "/api/finance/journal-lines/",
    "module": null,
    "foreignKey": "journal",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 20
  },
  {
    "key": "source",
    "label": "Source Document",
    "labelKey": "finance.journals.fields.source",
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

export const journalsWorkspaceDefaultTab: string =
  "general"

export const journalsOverviewItems: JournalsOverviewItem[] =
  [
  {
    key: "journal_number",
    label: "Journal No.",
    fallback: "-",
  },
  {
    key: "company_name",
    label: "Company",
    fallback: "-",
  },
  {
    key: "posting_date",
    label: "Posting Date",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  }
]