import type {
  RosterSetupsWorkspaceTab,
} from "./composables/useRosterSetupsWorkspace"

import type {
  RosterSetupsOverviewItem,
} from "./components/RosterSetupsOverview.vue"

export const rosterSetupsWorkspaceTabs: RosterSetupsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "Document",
    "labelKey": "hr.roster-setups.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "company",
      "location",
      "department",
      "section",
      "as_of_date",
      "horizon_months",
      "status",
      "line_count",
      "committed_count",
      "notes",
      "commit_error"
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
    "key": "lines",
    "label": "Employees",
    "labelKey": "hr.roster-setups.tabs.lines",
    "type": "resource",
    "fields": [
      {
        "key": "employee",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/hr/employees/lookup/",
        "label": "Employee",
        "labelKey": "hr.roster-setups.lines.fields.employee",
        "display_key": "employee_name",
        "autofill": {
          "roster_policy": "roster_policy",
          "current_cycle_start": "roster_cycle_start"
        },
        "required": true,
        "table": true,
        "search": true,
        "order": 10,
        "endpoint": "/api/hr/employees/lookup/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "employee_name"
      },
      {
        "key": "roster_policy",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/administration/references/hr/lookup/roster-policies/",
        "label": "Roster Policy",
        "labelKey": "hr.roster-setups.lines.fields.roster_policy",
        "display_key": "roster_policy_code",
        "required": true,
        "table": true,
        "filter": true,
        "help_text": "Yang menentukan pola siklusnya. Policy tanpa pola siklus tidak muncul di sini — ia cuma memuat aturan site.",
        "order": 20,
        "endpoint": "/api/administration/references/hr/lookup/roster-policies/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "roster_policy_code"
      },
      {
        "key": "current_cycle_start",
        "type": "date",
        "widget": "date",
        "label": "Current Cycle Start",
        "labelKey": "hr.roster-setups.lines.fields.current_cycle_start",
        "required": true,
        "table": true,
        "sortable": true,
        "help_text": "Hari pertama blok yang **sedang** dijalani pegawai ini. Boleh tanggal lampau — justru itu yang biasa saat sistem baru dipasang.",
        "order": 30,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "current_cycle_start"
      },
      {
        "key": "opening_rotation_credit",
        "type": "decimal",
        "widget": "decimal",
        "decimal_places": 2,
        "max_digits": 6,
        "label": "Opening Credit",
        "labelKey": "hr.roster-setups.lines.fields.opening_rotation_credit",
        "required": false,
        "table": true,
        "help_text": "Saldo rotation credit yang dibawa dari sistem lama. Dicatat sebagai transaksi Opening Balance, bukan diketik langsung ke saldo.",
        "order": 40,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "opening_rotation_credit"
      },
      {
        "key": "note",
        "type": "text",
        "widget": "text",
        "label": "Note",
        "labelKey": "hr.roster-setups.lines.fields.note",
        "required": false,
        "table": true,
        "order": 50,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "note"
      },
      {
        "key": "status",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "Pending",
            "value": "pending"
          },
          {
            "label": "Committed",
            "value": "committed"
          },
          {
            "label": "Failed",
            "value": "failed"
          },
          {
            "label": "Skipped",
            "value": "skipped"
          }
        ],
        "label": "Status",
        "labelKey": "hr.roster-setups.lines.fields.status",
        "display_key": "status_label",
        "required": false,
        "table": true,
        "filter": true,
        "disabled": true,
        "modes": [
          "edit"
        ],
        "order": 60,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "status_label"
      },
      {
        "key": "commit_error",
        "type": "text",
        "widget": "text",
        "label": "Error",
        "labelKey": "hr.roster-setups.lines.fields.commit_error",
        "required": false,
        "table": true,
        "read_only": true,
        "display": true,
        "order": 70,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "commit_error"
      }
    ],
    "modes": null,
    "endpoint": "/api/hr/roster-setup-lines/",
    "module": "hr/roster-setup-lines",
    "foreignKey": "request",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": true,
    "canCreate": true,
    "showOnCreate": true,
    "order": 20
  }
]

export const rosterSetupsWorkspaceDefaultTab: string =
  "general"

export const rosterSetupsOverviewItems: RosterSetupsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Document No.",
    fallback: "-",
  },
  {
    key: "company_name",
    label: "Company",
    fallback: "-",
  },
  {
    key: "location_name",
    label: "Site",
    fallback: "-",
  },
  {
    key: "department_name",
    label: "Department",
    fallback: "-",
  },
  {
    key: "section_name",
    label: "Section",
    fallback: "-",
  },
  {
    key: "as_of_date",
    label: "As Of Date",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "line_count",
    label: "Employees",
    fallback: "-",
  }
]