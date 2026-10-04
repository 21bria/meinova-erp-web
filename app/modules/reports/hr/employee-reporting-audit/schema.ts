import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/reports/hr/employee-reporting-audit/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate reports/hr/employee-reporting-audit`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const reportsHrEmployeeReportingAuditSchema: DashboardSchema = {
  "module": "reports/hr/employee-reporting-audit",
  "type": "dashboard",
  "title": "Employee Reporting Audit",
  "slug": "employee-reporting-audit",
  "entity": "EmployeeReportingAudit",
  "description": "Struktur pegawai, garis pelaporan, dan akun login dalam satu tabel.",
  "endpoint": "/api/reports/hr/employee-reporting-audit/",
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
      "placement": "advanced"
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
      "key": "employee",
      "type": "lookup",
      "label": "Employee",
      "lookup_endpoint": "/api/hr/employees/lookup/",
      "placement": "advanced"
    },
    {
      "key": "reporting_status",
      "type": "lookup",
      "label": "Reporting Status",
      "lookup_endpoint": "/api/reports/hr/employee-reporting-audit/reporting-status/",
      "placement": "advanced"
    }
  ],
  "widgets": [
    {
      "key": "employee_reporting_audit",
      "type": "table",
      "label": "Employee Reporting Audit",
      "description": "Satu baris per pegawai aktif: penempatan organisasi, garis pelaporan, dan akun login yang menempel padanya. Isi master apa adanya — tidak ada periode dan tidak ada angka transaksi.",
      "span": 12,
      "order": 10,
      "columns": [
        {
          "key": "employee_number",
          "label": "Employee ID",
          "format": "text",
          "width": 104
        },
        {
          "key": "employee_name",
          "label": "Employee Name",
          "format": "text",
          "width": 208
        },
        {
          "key": "company",
          "label": "Company",
          "format": "text"
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
          "key": "section",
          "label": "Section",
          "format": "text"
        },
        {
          "key": "position",
          "label": "Position",
          "format": "text"
        },
        {
          "key": "employee_group",
          "label": "Employee Group",
          "format": "text"
        },
        {
          "key": "employment_type",
          "label": "Employment Type",
          "format": "text"
        },
        {
          "key": "join_date",
          "label": "Join Date",
          "format": "date"
        },
        {
          "key": "tenure",
          "label": "Length of Service",
          "format": "text"
        },
        {
          "key": "report_to_number",
          "label": "Report To ID",
          "format": "text"
        },
        {
          "key": "report_to_name",
          "label": "Report To Name",
          "format": "text"
        },
        {
          "key": "account",
          "label": "Account",
          "format": "text"
        },
        {
          "key": "account_email",
          "label": "Account Email",
          "format": "text"
        },
        {
          "key": "report_account",
          "label": "Report To Account",
          "format": "text"
        },
        {
          "key": "report_account_email",
          "label": "Report To Account Email",
          "format": "text"
        },
        {
          "key": "account_status",
          "label": "Account Status",
          "format": "text"
        },
        {
          "key": "reporting_status",
          "label": "Reporting Status",
          "format": "text"
        }
      ],
      "empty_text": "No employees match these filters.",
      "sticky_columns": 2,
      "page_size": 25,
      "page_size_options": [
        25,
        50,
        100
      ],
      "searchable": true,
      "search_placeholder": "Cari nomor/nama pegawai, akun, email, atau atasannya"
    }
  ],
  "i18n": {
    "namespace": "reports.hr.employee-reporting-audit"
  }
}
