import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/reports/hr/manpower-movement/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate reports/hr/manpower-movement`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const reportsHrManpowerMovementSchema: DashboardSchema = {
  "module": "reports/hr/manpower-movement",
  "type": "dashboard",
  "title": "Manpower Movement",
  "slug": "manpower-movement",
  "entity": "ManpowerMovement",
  "description": "Perubahan jumlah tenaga kerja pada periode terpilih: join, mutasi, dan keluar, beserta Opening dan Closing Headcount-nya.",
  "endpoint": "/api/reports/hr/manpower-movement/",
  "columns": 12,
  "filters": [
    {
      "key": "period",
      "type": "period",
      "label": "Period",
      "mode": "month",
      "modes": [
        "month",
        "quarter",
        "year",
        "custom"
      ],
      "default": "current"
    },
    {
      "key": "company",
      "type": "lookup",
      "label": "Company",
      "lookup_endpoint": "/api/administration/organization/lookup/companies/",
      "multiple": true,
      "placement": "quick"
    },
    {
      "key": "branch",
      "type": "lookup",
      "label": "Branch",
      "lookup_endpoint": "/api/administration/organization/lookup/branches/",
      "depends_on": "company",
      "lookup_params": {
        "company_id": "$company"
      },
      "placement": "advanced"
    },
    {
      "key": "location",
      "type": "lookup",
      "label": "Location",
      "lookup_endpoint": "/api/administration/organization/lookup/locations/",
      "depends_on": "company",
      "lookup_params": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "multiple": true,
      "placement": "quick",
      "self_filter": "$me.data_scope.self_filter.location",
      "self_filter_label": "My Location"
    },
    {
      "key": "department",
      "type": "lookup",
      "label": "Department",
      "lookup_endpoint": "/api/administration/organization/lookup/departments/",
      "depends_on": "company",
      "lookup_params": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location"
      },
      "multiple": true,
      "placement": "quick"
    },
    {
      "key": "section",
      "type": "lookup",
      "label": "Section",
      "lookup_endpoint": "/api/administration/organization/lookup/sections/",
      "depends_on": "department",
      "lookup_params": {
        "company_id": "$company",
        "branch_id": "$branch",
        "location_id": "$location",
        "department_id": "$department"
      },
      "multiple": true,
      "placement": "advanced"
    },
    {
      "key": "employee_group",
      "type": "lookup",
      "label": "Employee Group",
      "lookup_endpoint": "/api/administration/references/hr/lookup/employee-groups/",
      "multiple": true,
      "placement": "advanced"
    },
    {
      "key": "employment_type",
      "type": "lookup",
      "label": "Employment Type",
      "lookup_endpoint": "/api/administration/references/hr/lookup/employment-types/",
      "multiple": true,
      "placement": "advanced"
    },
    {
      "key": "employment_status",
      "type": "lookup",
      "label": "Employment Status",
      "lookup_endpoint": "/api/administration/references/hr/lookup/employment-statuses/",
      "multiple": true,
      "placement": "advanced"
    }
  ],
  "widgets": [
    {
      "key": "opening_headcount",
      "type": "stat",
      "label": "Opening Headcount",
      "span": 2,
      "order": 10,
      "icon": "users",
      "format": "number",
      "trend": false
    },
    {
      "key": "joins",
      "type": "stat",
      "label": "Join",
      "span": 2,
      "order": 20,
      "icon": "user-plus",
      "format": "number",
      "trend": false
    },
    {
      "key": "transfers_in",
      "type": "stat",
      "label": "Transfer In",
      "span": 2,
      "order": 30,
      "icon": "log-in",
      "format": "number",
      "trend": false
    },
    {
      "key": "transfers_out",
      "type": "stat",
      "label": "Transfer Out",
      "span": 2,
      "order": 40,
      "icon": "log-out",
      "format": "number",
      "trend": false
    },
    {
      "key": "exits",
      "type": "stat",
      "label": "Exit",
      "span": 2,
      "order": 50,
      "icon": "user-minus",
      "format": "number",
      "trend": false
    },
    {
      "key": "closing_headcount",
      "type": "stat",
      "label": "Closing Headcount",
      "span": 2,
      "order": 60,
      "icon": "users",
      "format": "number",
      "trend": false
    },
    {
      "key": "net_change",
      "type": "stat",
      "label": "Net Change",
      "span": 6,
      "order": 70,
      "icon": "trending-up",
      "format": "number",
      "trend": false
    },
    {
      "key": "missing_join_date",
      "type": "stat",
      "label": "No Join Date",
      "span": 6,
      "order": 80,
      "icon": "calendar-off",
      "format": "number",
      "trend": false
    },
    {
      "key": "headcount_bridge",
      "type": "chart",
      "label": "Headcount Bridge",
      "description": "Opening + Join + Transfer In − Transfer Out − Exit = Closing. Transfer Out dan Exit digambar negatif.",
      "span": 7,
      "order": 110,
      "chart": "bar",
      "x_label": "Ethnicity",
      "y_format": "number",
      "horizontal": false
    },
    {
      "key": "exit_by_reason",
      "type": "chart",
      "label": "Exit by Reason",
      "description": "Alasan keluar pada periode ini, terbanyak dulu. Delapan teratas; sisanya dijumlahkan ke \"Lainnya\".",
      "span": 5,
      "order": 120,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "movement_table",
      "type": "table",
      "label": "Manpower Movement",
      "description": "Satu baris per peristiwa, kronologis. Join + Transfer In − Transfer Out − Exit = Net Change. Internal Move diterbitkan tapi tidak mengubah jumlah kepala.",
      "span": 12,
      "order": 200,
      "columns": [
        {
          "key": "employee_number",
          "label": "Employee ID",
          "format": "text",
          "width": 120
        },
        {
          "key": "employee_name",
          "label": "Employee Name",
          "format": "text",
          "width": 200
        },
        {
          "key": "movement_date",
          "label": "Effective Date",
          "format": "date",
          "width": 130
        },
        {
          "key": "movement_type",
          "label": "Movement",
          "format": "text",
          "width": 130
        },
        {
          "key": "movement_from",
          "label": "From",
          "format": "text",
          "width": 220
        },
        {
          "key": "movement_to",
          "label": "To",
          "format": "text",
          "width": 220
        },
        {
          "key": "company",
          "label": "Company",
          "format": "text",
          "width": 180
        },
        {
          "key": "location",
          "label": "Location",
          "format": "text",
          "width": 160
        },
        {
          "key": "department",
          "label": "Department",
          "format": "text",
          "width": 160
        },
        {
          "key": "position",
          "label": "Position",
          "format": "text",
          "width": 170
        },
        {
          "key": "document_number",
          "label": "Document",
          "format": "text",
          "width": 150
        },
        {
          "key": "reason",
          "label": "Reason",
          "format": "text",
          "width": 220
        }
      ],
      "empty_text": "No movement for this period and filters.",
      "sticky_columns": 2,
      "page_size": 25,
      "page_size_options": [
        25,
        50,
        100
      ],
      "searchable": true,
      "search_placeholder": "Cari nomor pegawai, nama, atau nomor dokumen"
    }
  ],
  "i18n": {
    "namespace": "reports.hr.manpower-movement"
  }
}
