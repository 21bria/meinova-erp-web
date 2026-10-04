import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/reports/hr/contract-expiry/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate reports/hr/contract-expiry`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const reportsHrContractExpirySchema: DashboardSchema = {
  "module": "reports/hr/contract-expiry",
  "type": "dashboard",
  "title": "Contract Expiry",
  "slug": "contract-expiry",
  "entity": "ContractExpiry",
  "description": "Kontrak yang sudah atau akan habis, beserta status perpanjangannya. Potret hari ini, bukan laporan periode.",
  "endpoint": "/api/reports/hr/contract-expiry/",
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
    },
    {
      "key": "expiry_status",
      "type": "lookup",
      "label": "Expiry Status",
      "lookup_endpoint": "/api/reports/hr/contract-expiry/expiry-status/",
      "placement": "advanced"
    },
    {
      "key": "renewal_status",
      "type": "lookup",
      "label": "Renewal Status",
      "lookup_endpoint": "/api/reports/hr/contract-expiry/renewal-status/",
      "placement": "advanced"
    }
  ],
  "widgets": [
    {
      "key": "expired",
      "type": "stat",
      "label": "Expired",
      "span": 2,
      "order": 10,
      "icon": "alert-octagon",
      "format": "number",
      "trend": false
    },
    {
      "key": "expiring_30",
      "type": "stat",
      "label": "≤ 30 Days",
      "span": 2,
      "order": 20,
      "icon": "alert-triangle",
      "format": "number",
      "trend": false
    },
    {
      "key": "expiring_60",
      "type": "stat",
      "label": "31–60 Days",
      "span": 3,
      "order": 30,
      "icon": "clock",
      "format": "number",
      "trend": false
    },
    {
      "key": "expiring_90",
      "type": "stat",
      "label": "61–90 Days",
      "span": 3,
      "order": 40,
      "icon": "calendar-clock",
      "format": "number",
      "trend": false
    },
    {
      "key": "active_contracts",
      "type": "stat",
      "label": "Total Active Contracts",
      "span": 2,
      "order": 50,
      "icon": "file-signature",
      "format": "number",
      "trend": false
    },
    {
      "key": "expiry_timeline",
      "type": "chart",
      "label": "Contract Expiry Timeline",
      "description": "Kontrak yang berakhir dalam 12 bulan ke depan.",
      "span": 8,
      "order": 110,
      "chart": "bar",
      "x_label": "Ending Month",
      "y_format": "number",
      "horizontal": false
    },
    {
      "key": "expiring_by_department",
      "type": "chart",
      "label": "Expiring by Department",
      "description": "Kontrak yang perlu ditindaklanjuti (Expired sampai 90 hari) per Department, terbanyak dulu. Delapan teratas; sisanya dijumlahkan ke \"Lainnya\".",
      "span": 4,
      "order": 120,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "contract_table",
      "type": "table",
      "label": "Contract Expiry",
      "description": "Satu baris per kontrak berjalan, yang paling mendesak lebih dulu. Expired + ≤30 + 31–60 + 61–90 + >90 + Tanpa Tanggal Akhir = Total Kontrak Aktif.",
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
          "key": "section",
          "label": "Section",
          "format": "text",
          "width": 150
        },
        {
          "key": "position",
          "label": "Position",
          "format": "text",
          "width": 170
        },
        {
          "key": "employee_group",
          "label": "Employee Group",
          "format": "text",
          "width": 150
        },
        {
          "key": "employment_type",
          "label": "Employment Type",
          "format": "text",
          "width": 150
        },
        {
          "key": "employment_status",
          "label": "Employment Status",
          "format": "text",
          "width": 150
        },
        {
          "key": "contract_type",
          "label": "Contract Type",
          "format": "text",
          "width": 140
        },
        {
          "key": "contract_start",
          "label": "Contract Start",
          "format": "date",
          "width": 130
        },
        {
          "key": "contract_end",
          "label": "Contract End",
          "format": "date",
          "width": 130
        },
        {
          "key": "days_remaining",
          "label": "Days Remaining",
          "format": "number",
          "width": 130
        },
        {
          "key": "expiry_status",
          "label": "Expiry Status",
          "format": "text",
          "width": 140
        },
        {
          "key": "renewal_status",
          "label": "Renewal Status",
          "format": "text",
          "width": 150
        },
        {
          "key": "renewal_document",
          "label": "Renewal Doc",
          "format": "text",
          "width": 150
        },
        {
          "key": "report_to_name",
          "label": "Report To",
          "format": "text",
          "width": 180
        }
      ],
      "empty_text": "No active contracts match these filters.",
      "sticky_columns": 2,
      "page_size": 25,
      "page_size_options": [
        25,
        50,
        100
      ],
      "searchable": true,
      "search_placeholder": "Cari nomor atau nama pegawai"
    }
  ],
  "i18n": {
    "namespace": "reports.hr.contract-expiry"
  }
}
