import type {
  DefinitionsWorkspaceTab,
} from "./composables/useDefinitionsWorkspace"

import type {
  DefinitionsOverviewItem,
} from "./components/DefinitionsOverview.vue"

export const definitionsWorkspaceTabs: DefinitionsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "workflow.definitions.tabs.general",
    "type": "form",
    "fields": [
      "code",
      "name",
      "module",
      "document_type",
      "status",
      "version",
      "description"
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
    "key": "scope",
    "label": "Scope",
    "labelKey": "workflow.definitions.tabs.scope",
    "type": "form",
    "fields": [
      "company",
      "branch",
      "location",
      "employee_group",
      "scope_label",
      "specificity"
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
    "key": "steps",
    "label": "Approval Steps",
    "labelKey": "workflow.definitions.tabs.steps",
    "type": "resource",
    "fields": [
      {
        "key": "sequence",
        "type": "integer",
        "widget": "integer",
        "tab": "general",
        "label": "Step",
        "labelKey": "workflow.definitions.steps.fields.sequence",
        "required": false,
        "table": true,
        "filter": false,
        "search": false,
        "sortable": true,
        "overview": true,
        "help_text": "Dikosongkan = nomor bebas berikutnya.",
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "sequence"
      },
      {
        "key": "name",
        "type": "text",
        "widget": "text",
        "tab": "general",
        "label": "Step Name",
        "labelKey": "workflow.definitions.steps.fields.name",
        "required": true,
        "table": true,
        "filter": false,
        "search": true,
        "sortable": true,
        "overview": true,
        "help_text": "Judul kotak tanda tangan di formulir tercetak, mis. 'Approved By (Atasan Langsung)'.",
        "order": 30,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "name"
      },
      {
        "key": "description",
        "type": "textarea",
        "widget": "textarea",
        "rows": 2,
        "tab": "general",
        "label": "Description",
        "labelKey": "workflow.definitions.steps.fields.description",
        "required": false,
        "table": false,
        "filter": false,
        "search": true,
        "sortable": false,
        "order": 40,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "description"
      },
      {
        "key": "approver_type",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "Direct Manager",
            "value": "manager"
          },
          {
            "label": "Role Holder",
            "value": "role"
          },
          {
            "label": "Specific User",
            "value": "user"
          },
          {
            "label": "Position Hierarchy",
            "value": "position"
          },
          {
            "label": "Department Head",
            "value": "department_head"
          }
        ],
        "tab": "approver",
        "label": "Approver Type",
        "labelKey": "workflow.definitions.steps.fields.approver_type",
        "display_key": "approver_type_label",
        "required": true,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": true,
        "overview": true,
        "order": 110,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "approver_type_label"
      },
      {
        "key": "level",
        "type": "integer",
        "widget": "integer",
        "tab": "approver",
        "label": "Level",
        "labelKey": "workflow.definitions.steps.fields.level",
        "required": false,
        "table": true,
        "filter": false,
        "search": false,
        "sortable": false,
        "help_text": "Berapa tingkat naik untuk tipe berbasis hierarki. 1 = atasan langsung.",
        "visible_when": {
          "approver_type": [
            "manager",
            "position"
          ]
        },
        "order": 120,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "level"
      },
      {
        "key": "approver_role",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/accounts/lookup/roles/",
        "tab": "approver",
        "label": "Role",
        "labelKey": "workflow.definitions.steps.fields.approver_role",
        "display_key": "approver_role_name",
        "required": false,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": true,
        "help_text": "Wajib diisi kalau tipenya Role Holder.",
        "visible_when": {
          "approver_type": "role"
        },
        "order": 130,
        "endpoint": "/api/accounts/lookup/roles/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "approver_role_name"
      },
      {
        "key": "approver_scope",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "Entire Tenant",
            "value": "tenant"
          },
          {
            "label": "Company",
            "value": "company"
          },
          {
            "label": "Branch",
            "value": "branch"
          },
          {
            "label": "Location",
            "value": "location"
          },
          {
            "label": "Division",
            "value": "division"
          },
          {
            "label": "Department",
            "value": "department"
          },
          {
            "label": "Section",
            "value": "section"
          }
        ],
        "tab": "approver",
        "label": "Role Scope",
        "labelKey": "workflow.definitions.steps.fields.approver_scope",
        "display_key": "approver_scope_label",
        "required": false,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": false,
        "help_text": "Sejauh mana pemegang role dicari, dibandingkan dengan penempatan pegawai yang dokumennya diproses. Location untuk meja yang memang per site (KTT, Admin Site); Company untuk yang melayani lintas site (HRGA, HR Manager). Kolom yang dipilih harus terisi di penempatan pegawainya — kalau kosong, step ini tidak menemukan siapa pun.",
        "visible_when": {
          "approver_type": "role"
        },
        "order": 135,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "approver_scope_label"
      },
      {
        "key": "approver_user",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/accounts/lookup/users/",
        "tab": "approver",
        "label": "User",
        "labelKey": "workflow.definitions.steps.fields.approver_user",
        "display_key": "approver_user_name",
        "required": false,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": false,
        "help_text": "Wajib diisi kalau tipenya Specific User.",
        "visible_when": {
          "approver_type": "user"
        },
        "order": 140,
        "endpoint": "/api/accounts/lookup/users/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "approver_user_name"
      },
      {
        "key": "approver_position",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/administration/organization/lookup/positions/",
        "tab": "approver",
        "label": "Position",
        "labelKey": "workflow.definitions.steps.fields.approver_position",
        "display_key": "approver_position_name",
        "required": false,
        "table": false,
        "filter": true,
        "search": false,
        "sortable": false,
        "help_text": "Dikosongkan = berangkat dari jabatan pengaju sendiri, lalu naik sebanyak Level.",
        "visible_when": {
          "approver_type": "position"
        },
        "order": 150,
        "endpoint": "/api/administration/organization/lookup/positions/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "approver_position_name"
      },
      {
        "key": "fallback_role",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/accounts/lookup/roles/",
        "tab": "approver",
        "label": "Fallback Role",
        "labelKey": "workflow.definitions.steps.fields.fallback_role",
        "display_key": "fallback_role_name",
        "required": false,
        "table": false,
        "filter": false,
        "search": false,
        "sortable": false,
        "help_text": "Dipakai kalau penelusuran struktur organisasi tidak menemukan siapa pun. Kosong = step-nya gagal, kecuali Required dimatikan.",
        "order": 160,
        "endpoint": "/api/accounts/lookup/roles/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "fallback_role_name"
      },
      {
        "key": "approval_mode",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "Any Approver",
            "value": "any"
          },
          {
            "label": "All Approvers",
            "value": "all"
          }
        ],
        "tab": "behavior",
        "label": "Approval Mode",
        "labelKey": "workflow.definitions.steps.fields.approval_mode",
        "display_key": "approval_mode_label",
        "required": false,
        "table": false,
        "filter": true,
        "search": false,
        "sortable": false,
        "help_text": "Hanya berpengaruh kalau step ini menghasilkan lebih dari satu approver — praktisnya tipe Role Holder.",
        "order": 210,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "approval_mode_label"
      },
      {
        "key": "minimum_approvals",
        "type": "integer",
        "widget": "integer",
        "tab": "behavior",
        "label": "Minimum Approvals",
        "labelKey": "workflow.definitions.steps.fields.minimum_approvals",
        "required": false,
        "table": false,
        "filter": false,
        "search": false,
        "sortable": false,
        "visible_when": {
          "approval_mode": "any"
        },
        "order": 220,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "minimum_approvals"
      },
      {
        "key": "is_required",
        "type": "boolean",
        "widget": "switch",
        "tab": "behavior",
        "label": "Required",
        "labelKey": "workflow.definitions.steps.fields.is_required",
        "required": false,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": false,
        "help_text": "Dimatikan: approver yang tidak ketemu membuat step ini dilewati, bukan menggagalkan seluruh pengajuan.",
        "order": 230,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "is_required"
      },
      {
        "key": "can_reject",
        "type": "boolean",
        "widget": "switch",
        "tab": "behavior",
        "label": "Can Reject",
        "labelKey": "workflow.definitions.steps.fields.can_reject",
        "required": false,
        "table": false,
        "filter": true,
        "search": false,
        "sortable": false,
        "order": 240,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "can_reject"
      },
      {
        "key": "can_return",
        "type": "boolean",
        "widget": "switch",
        "tab": "behavior",
        "label": "Can Return",
        "labelKey": "workflow.definitions.steps.fields.can_return",
        "required": false,
        "table": false,
        "filter": true,
        "search": false,
        "sortable": false,
        "help_text": "Approver boleh mengembalikan dokumen ke pengaju untuk diperbaiki, tanpa menolaknya.",
        "order": 250,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "can_return"
      },
      {
        "key": "condition",
        "type": "json",
        "widget": "json",
        "tab": "behavior",
        "label": "Condition",
        "labelKey": "workflow.definitions.steps.fields.condition",
        "required": false,
        "table": false,
        "filter": false,
        "search": false,
        "sortable": false,
        "help_text": "Kosong = step selalu jalan. Contoh: {\"field\": \"total_days\", \"op\": \"gte\", \"value\": 5} — step ini hanya jalan untuk cuti 5 hari ke atas.",
        "order": 260,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "condition"
      }
    ],
    "modes": null,
    "endpoint": "/api/workflow/steps/",
    "module": "workflow/steps",
    "foreignKey": "definition",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": true,
    "canCreate": true,
    "showOnCreate": true,
    "order": 30
  },
  {
    "key": "instances",
    "label": "Running Documents",
    "labelKey": "workflow.definitions.fields.instances",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": "/api/workflow/instances/",
    "module": "workflow/instances",
    "foreignKey": "definition",
    "component": null,
    "icon": null,
    "readonly": true,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": false,
    "showOnCreate": true,
    "order": 40
  }
]

export const definitionsWorkspaceDefaultTab: string =
  "general"

export const definitionsOverviewItems: DefinitionsOverviewItem[] =
  [
  {
    key: "code",
    label: "Code",
    fallback: "-",
  },
  {
    key: "name",
    label: "Name",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "scope_label",
    label: "Applies To",
    fallback: "-",
  }
]