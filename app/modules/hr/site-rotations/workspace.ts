import type {
  SiteRotationsWorkspaceTab,
} from "./composables/useSiteRotationsWorkspace"

import type {
  SiteRotationsOverviewItem,
} from "./components/SiteRotationsOverview.vue"

export const siteRotationsWorkspaceTabs: SiteRotationsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.site-rotations.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "employee",
      "roster_crew",
      "roster_policy",
      "status"
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
    "key": "cycle",
    "label": "Cycle",
    "labelKey": "hr.site-rotations.tabs.cycle",
    "type": "form",
    "fields": [
      "start_date",
      "cycle_work_days",
      "cycle_off_days",
      "cycle_travel_days",
      "cycle_count",
      "cycle_length",
      "cycles_per_year",
      "end_date"
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
    "key": "organization",
    "label": "Organization",
    "labelKey": "hr.site-rotations.tabs.organization",
    "type": "form",
    "fields": [
      "company",
      "branch",
      "location",
      "department_name",
      "section_name",
      "position_name",
      "work_email",
      "phone_number",
      "join_date",
      "point_of_hire_name"
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
    "key": "notes",
    "label": "Notes",
    "labelKey": "hr.site-rotations.tabs.notes",
    "type": "form",
    "fields": [
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
    "order": 40
  },
  {
    "key": "periods",
    "label": "Schedule",
    "labelKey": "hr.site-rotations.tabs.periods",
    "type": "resource",
    "fields": [
      {
        "key": "sequence",
        "type": "integer",
        "widget": "integer",
        "tab": "general",
        "label": "No",
        "labelKey": "hr.site-rotations.periods.fields.sequence",
        "required": false,
        "table": true,
        "filter": false,
        "search": false,
        "sortable": true,
        "overview": true,
        "help_text": "Urutan gabungan ON dan OFF: 1 = kerja #1, 2 = off #1, 3 = kerja #2. Dikosongkan = nomor bebas berikutnya, untuk baris yang disisipkan tangan.",
        "order": 20,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "sequence"
      },
      {
        "key": "period_type",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "On Site",
            "value": "work"
          },
          {
            "label": "Off",
            "value": "off"
          }
        ],
        "tab": "general",
        "label": "Type",
        "labelKey": "hr.site-rotations.periods.fields.period_type",
        "display_key": "period_type_label",
        "required": true,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": true,
        "overview": true,
        "order": 30,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "period_type_label"
      },
      {
        "key": "purpose",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/administration/references/hr/lookup/rotation-purposes/",
        "tab": "general",
        "label": "Travel Purpose",
        "labelKey": "hr.site-rotations.periods.fields.purpose",
        "display_key": "purpose_name",
        "required": false,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": true,
        "overview": true,
        "help_text": "Alasan blok off ini: Field Break, Cuti Tahunan, dan seterusnya. Satu blok off boleh dipecah jadi beberapa baris dengan alasan berbeda.",
        "order": 35,
        "endpoint": "/api/administration/references/hr/lookup/rotation-purposes/",
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "purpose_name"
      },
      {
        "key": "employee_leave",
        "type": "lookup",
        "widget": "lookup",
        "lookup_endpoint": "/api/hr/lookup/employee-leaves/",
        "tab": "general",
        "label": "Leave Record",
        "labelKey": "hr.site-rotations.periods.fields.employee_leave",
        "display_key": "employee_leave_label",
        "lookup_params": {
          "employee_id": "$employee"
        },
        "depends_on": "employee",
        "required": false,
        "table": true,
        "filter": false,
        "search": false,
        "sortable": false,
        "help_text": "Catatan cuti yang memotong saldo untuk blok ini. Roster sendiri tidak memotong saldo — angkanya tetap dihitung di modul Cuti supaya tidak ada dua sumber. Baru bisa dipilih setelah barisnya tersimpan, karena pegawainya disalin dari dokumen induk saat simpan.",
        "order": 36,
        "endpoint": "/api/hr/lookup/employee-leaves/",
        "dependsOn": "employee",
        "lookupParams": {
          "employee_id": "$employee"
        },
        "displayKey": "employee_leave_label"
      },
      {
        "key": "status",
        "type": "select",
        "widget": "select",
        "options": [
          {
            "label": "Scheduled",
            "value": "scheduled"
          },
          {
            "label": "Ongoing",
            "value": "ongoing"
          },
          {
            "label": "Completed",
            "value": "completed"
          },
          {
            "label": "Cancelled",
            "value": "cancelled"
          }
        ],
        "tab": "general",
        "label": "Status",
        "labelKey": "hr.site-rotations.periods.fields.status",
        "display_key": "status_label",
        "required": true,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": true,
        "help_text": "Tidak berpindah sendiri — Celery Beat belum aktif, jadi tidak ada yang memajukan status ke Ongoing/Completed.",
        "order": 40,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "status_label"
      },
      {
        "key": "start_date",
        "type": "date",
        "widget": "date",
        "tab": "general",
        "label": "Start Date",
        "labelKey": "hr.site-rotations.periods.fields.start_date",
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
        "displayKey": "start_date"
      },
      {
        "key": "end_date",
        "type": "date",
        "widget": "date",
        "tab": "general",
        "label": "End Date",
        "labelKey": "hr.site-rotations.periods.fields.end_date",
        "required": true,
        "table": true,
        "filter": true,
        "search": false,
        "sortable": true,
        "order": 120,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "end_date"
      },
      {
        "key": "total_days",
        "type": "integer",
        "widget": "integer",
        "tab": "general",
        "label": "Days",
        "labelKey": "hr.site-rotations.periods.fields.total_days",
        "compute": {
          "kind": "date_diff",
          "from": "start_date",
          "to": "end_date",
          "inclusive": true
        },
        "required": false,
        "table": true,
        "filter": false,
        "search": false,
        "sortable": true,
        "help_text": "Dikosongkan = dihitung dari selisih tanggal. Isian manual dihormati untuk blok kerja yang dipotong hari travel.",
        "order": 130,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "total_days"
      },
      {
        "key": "shift_plan",
        "type": "text",
        "widget": "text",
        "tab": "general",
        "label": "Shift Plan",
        "labelKey": "hr.site-rotations.periods.fields.shift_plan",
        "read_only": true,
        "display": true,
        "required": false,
        "table": true,
        "filter": false,
        "search": false,
        "sortable": false,
        "help_text": "Diisi tombol Set Shift Pattern di dokumen roster. Kosong pada hari off dan hari perjalanan — keduanya memang tidak punya shift.",
        "order": 135,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "shift_plan"
      },
      {
        "key": "is_manual_override",
        "type": "boolean",
        "widget": "switch",
        "tab": "general",
        "label": "Manual Override",
        "labelKey": "hr.site-rotations.periods.fields.is_manual_override",
        "required": false,
        "table": false,
        "filter": true,
        "search": false,
        "sortable": true,
        "disabled": true,
        "help_text": "Menyala sendiri begitu tanggalnya digeser tangan. Baris bertanda ini menolak ditimpa Generate Periods.",
        "order": 140,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "is_manual_override"
      },
      {
        "key": "notes",
        "type": "textarea",
        "widget": "textarea",
        "rows": 2,
        "tab": "general",
        "label": "Notes",
        "labelKey": "hr.site-rotations.periods.fields.notes",
        "required": false,
        "table": true,
        "filter": false,
        "search": true,
        "sortable": false,
        "order": 150,
        "endpoint": null,
        "dependsOn": null,
        "lookupParams": {},
        "displayKey": "notes"
      }
    ],
    "modes": null,
    "endpoint": "/api/hr/rotation-periods/",
    "module": "hr/rotation-periods",
    "foreignKey": "rotation",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": true,
    "canCreate": true,
    "showOnCreate": true,
    "order": 50
  }
]

export const siteRotationsWorkspaceDefaultTab: string =
  "general"

export const siteRotationsOverviewItems: SiteRotationsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Roster No.",
    fallback: "-",
  },
  {
    key: "employee_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "roster_crew_name",
    label: "Roster Crew",
    fallback: "-",
  },
  {
    key: "roster_policy_name",
    label: "Roster Policy",
    fallback: "-",
  },
  {
    key: "start_date",
    label: "Start Date",
    fallback: "-",
  },
  {
    key: "cycle_work_days",
    label: "Work Days",
    fallback: "-",
  },
  {
    key: "cycle_travel_days",
    label: "Travel Days",
    fallback: "-",
  },
  {
    key: "cycle_off_days",
    label: "Off Days",
    fallback: "-",
  },
  {
    key: "location_name",
    label: "Site / Location",
    fallback: "-",
  }
]