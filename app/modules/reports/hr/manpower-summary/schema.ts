import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/reports/hr/manpower-summary/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate reports/hr/manpower-summary`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const reportsHrManpowerSummarySchema: DashboardSchema = {
  "module": "reports/hr/manpower-summary",
  "type": "dashboard",
  "title": "Manpower Summary",
  "slug": "manpower-summary",
  "entity": "ManpowerSummary",
  "description": "Jumlah dan komposisi tenaga kerja per struktur organisasi dan jenis kepegawaian. Potret hari ini, bukan laporan periode.",
  "endpoint": "/api/reports/hr/manpower-summary/",
  "columns": 12,
  "filters": [
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
      "key": "headcount",
      "type": "stat",
      "label": "Total Headcount",
      "span": 3,
      "order": 10,
      "icon": "users",
      "format": "number",
      "trend": false
    },
    {
      "key": "permanent",
      "type": "stat",
      "label": "Permanent",
      "span": 3,
      "order": 20,
      "icon": "user-check",
      "format": "number",
      "trend": false
    },
    {
      "key": "contract",
      "type": "stat",
      "label": "Contract",
      "span": 3,
      "order": 30,
      "icon": "file-signature",
      "format": "number",
      "trend": false
    },
    {
      "key": "unspecified_employment_type",
      "type": "stat",
      "label": "No Employment Type",
      "span": 3,
      "order": 40,
      "icon": "circle-help",
      "format": "number",
      "trend": false
    },
    {
      "key": "company_breakdown",
      "type": "chart",
      "label": "Headcount by Company",
      "description": "Tinggi batang = headcount company itu, dipecah Permanent dan Contract.",
      "span": 6,
      "order": 110,
      "chart": "bar",
      "x_label": "Company",
      "y_format": "number",
      "stacked": true
    },
    {
      "key": "location_breakdown",
      "type": "chart",
      "label": "Headcount by Location",
      "description": "Delapan lokasi terbesar; sisanya dijumlahkan ke \"Lainnya\" supaya totalnya tetap utuh.",
      "span": 6,
      "order": 120,
      "chart": "bar",
      "x_label": "Location",
      "y_format": "number",
      "stacked": true
    },
    {
      "key": "department_breakdown",
      "type": "chart",
      "label": "Headcount by Department",
      "description": "Department yang belum ditentukan tetap ikut sebagai kelompok tersendiri — orangnya tetap dihitung.",
      "span": 12,
      "order": 130,
      "chart": "bar",
      "x_label": "Department",
      "y_format": "number",
      "stacked": true
    },
    {
      "key": "employee_group_breakdown",
      "type": "chart",
      "label": "Headcount by Employee Group",
      "description": "Proporsi per klasifikasi pegawai. Group yang seluruh Feature Applicability-nya mati tetap ikut — manpower adalah angka organisasi, bukan angka proses.",
      "span": 6,
      "order": 140,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "employment_type_breakdown",
      "type": "chart",
      "label": "Headcount by Employment Type",
      "description": "Per jenis kepegawaian apa adanya dari master — bukan hanya Permanent dan Contract.",
      "span": 6,
      "order": 150,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "manpower_table",
      "type": "table",
      "label": "Manpower Summary",
      "description": "Agregat per company, location, dan department. Headcount = jumlah pegawai aktif pada kelompok itu; Permanent + Contract + Belum Ditentukan = Headcount.",
      "span": 12,
      "order": 200,
      "columns": [
        {
          "key": "company",
          "label": "Company",
          "format": "text",
          "width": 200
        },
        {
          "key": "location",
          "label": "Location",
          "format": "text"
        },
        {
          "key": "department",
          "label": "Department",
          "format": "text"
        },
        {
          "key": "headcount",
          "label": "Headcount",
          "format": "number"
        },
        {
          "key": "permanent",
          "label": "Permanent",
          "format": "number"
        },
        {
          "key": "contract",
          "label": "Contract",
          "format": "number"
        },
        {
          "key": "unspecified",
          "label": "Unspecified",
          "format": "number"
        }
      ],
      "empty_text": "No employees match these filters.",
      "sticky_columns": 1,
      "page_size": 25,
      "page_size_options": [
        25,
        50,
        100
      ],
      "searchable": true,
      "search_placeholder": "Cari company, location, atau department",
      "total_label": "Group"
    }
  ],
  "i18n": {
    "namespace": "reports.hr.manpower-summary"
  }
}
