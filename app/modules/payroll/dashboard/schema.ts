import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/payroll/dashboard/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate payroll/dashboard`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const payrollDashboardSchema: DashboardSchema = {
  "module": "payroll/dashboard",
  "type": "dashboard",
  "title": "Payroll Dashboard",
  "slug": "dashboard",
  "entity": "PayrollDashboard",
  "description": "Posisi payroll periode berjalan: total, progress run, temuan yang perlu ditindaklanjuti, dan bentuk biayanya.",
  "endpoint": "/api/payroll/dashboard/",
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
      "key": "payroll_period",
      "type": "lookup",
      "label": "Payroll Period",
      "lookup_endpoint": "/api/payroll/payroll-periods/lookup/",
      "lookup_params": {
        "company_id": "$company"
      },
      "placement": "quick"
    },
    {
      "key": "payroll_run",
      "type": "lookup",
      "label": "Payroll Run",
      "lookup_endpoint": "/api/payroll/payroll-runs/lookup/",
      "lookup_params": {
        "company_id": "$company",
        "period_id": "$payroll_period"
      },
      "placement": "quick"
    }
  ],
  "widgets": [
    {
      "key": "employees",
      "type": "stat",
      "label": "Employees",
      "span": 2,
      "order": 10,
      "icon": "users",
      "format": "number",
      "trend": false
    },
    {
      "key": "gross_payroll",
      "type": "stat",
      "label": "Gross Payroll",
      "span": 2,
      "order": 20,
      "icon": "wallet",
      "format": "currency",
      "trend": false
    },
    {
      "key": "total_deduction",
      "type": "stat",
      "label": "Total Deductions",
      "span": 2,
      "order": 30,
      "icon": "minus-circle",
      "format": "currency",
      "trend": false
    },
    {
      "key": "net_payroll",
      "type": "stat",
      "label": "Net Payroll",
      "span": 2,
      "order": 40,
      "icon": "banknote",
      "format": "currency",
      "trend": false
    },
    {
      "key": "overtime",
      "type": "stat",
      "label": "Overtime",
      "span": 2,
      "order": 50,
      "icon": "timer",
      "format": "currency",
      "trend": false
    },
    {
      "key": "absence_unpaid",
      "type": "stat",
      "label": "Absent / Unpaid Leave",
      "span": 2,
      "order": 60,
      "icon": "calendar-x",
      "format": "currency",
      "trend": false
    },
    {
      "key": "employer_contribution",
      "type": "stat",
      "label": "Employer Cost",
      "span": 3,
      "order": 70,
      "icon": "building-2",
      "format": "currency",
      "trend": false
    },
    {
      "key": "total_payroll_cost",
      "type": "stat",
      "label": "Total Payroll Cost",
      "span": 3,
      "order": 80,
      "icon": "coins",
      "format": "currency",
      "trend": false
    },
    {
      "key": "run_progress",
      "type": "list",
      "label": "Payroll Run Progress",
      "description": "Tahapan run terpilih, dibaca dari stempel waktu dokumennya sendiri.",
      "span": 4,
      "order": 110,
      "columns": [
        {
          "key": "label",
          "label": "Stage",
          "format": "text"
        },
        {
          "key": "hint",
          "label": "Remarks",
          "format": "text"
        },
        {
          "key": "count",
          "label": "Employees",
          "format": "number"
        },
        {
          "key": "status",
          "label": "Status",
          "format": "status"
        }
      ],
      "empty_text": "No payroll run for this period."
    },
    {
      "key": "attention",
      "type": "list",
      "label": "Needs Follow-Up",
      "description": "Temuan validasi run terpilih, dikelompokkan per jenis. Error mengunci Finalize; peringatan boleh dilanjutkan setelah diakui.",
      "span": 8,
      "order": 120,
      "columns": [
        {
          "key": "label",
          "label": "Findings",
          "format": "text"
        },
        {
          "key": "hint",
          "label": "Remarks",
          "format": "text"
        },
        {
          "key": "count",
          "label": "Count",
          "format": "number"
        },
        {
          "key": "level",
          "label": "Level",
          "format": "status"
        }
      ],
      "empty_text": "No findings for this run.",
      "limit": 12
    },
    {
      "key": "run_employees",
      "type": "table",
      "label": "Running Payroll Run",
      "description": "Hasil perhitungan per pegawai pada run terpilih. Dasar Upah adalah angka yang benar-benar terbentuk — untuk pegawai harian itu tarif x hari yang dibayar, bukan gaji sebulan.",
      "span": 12,
      "order": 130,
      "columns": [
        {
          "key": "employee",
          "label": "Employees",
          "format": "text",
          "width": 220
        },
        {
          "key": "employee_number",
          "label": "NIK",
          "format": "text"
        },
        {
          "key": "policy",
          "label": "Policy",
          "format": "text"
        },
        {
          "key": "pay_basis",
          "label": "Basis",
          "format": "text"
        },
        {
          "key": "base_earning",
          "label": "Wage Basis",
          "format": "currency"
        },
        {
          "key": "allowance",
          "label": "Allowances & Inputs",
          "format": "currency"
        },
        {
          "key": "overtime",
          "label": "Overtime",
          "format": "currency"
        },
        {
          "key": "deduction",
          "label": "Deductions",
          "format": "currency"
        },
        {
          "key": "net_pay",
          "label": "Net Pay",
          "format": "currency"
        },
        {
          "key": "status",
          "label": "Status",
          "format": "status"
        }
      ],
      "empty_text": "No employees in this run.",
      "sticky_columns": 1,
      "page_size": 25,
      "searchable": true,
      "search_placeholder": "Cari nama atau NIK…"
    },
    {
      "key": "cost_trend",
      "type": "chart",
      "label": "Payroll Cost Trend",
      "description": "Enam periode payroll terakhir dalam cakupan yang sama. Kontribusi pemberi kerja belum termasuk — belum dihitung di mana pun.",
      "span": 6,
      "order": 140,
      "chart": "line",
      "x_label": "Period",
      "y_format": "currency",
      "horizontal": false
    },
    {
      "key": "composition",
      "type": "chart",
      "label": "Payroll Composition",
      "description": "Dikelompokkan dari sumber komponen yang tercatat di tiap baris perhitungan, bukan dari pencocokan nama.",
      "span": 6,
      "order": 150,
      "chart": "bar",
      "y_format": "currency",
      "summary": false
    },
    {
      "key": "by_policy",
      "type": "table",
      "label": "By Policy",
      "span": 12,
      "order": 160,
      "columns": [
        {
          "key": "policy",
          "label": "By Policy",
          "format": "text",
          "width": 200
        },
        {
          "key": "employees",
          "label": "Employees",
          "format": "number"
        },
        {
          "key": "gross",
          "label": "Gross",
          "format": "currency"
        },
        {
          "key": "deduction",
          "label": "Deductions",
          "format": "currency"
        },
        {
          "key": "net",
          "label": "Net",
          "format": "currency"
        }
      ],
      "empty_text": "No data for this run.",
      "sticky_columns": 1,
      "total_label": "Rows"
    },
    {
      "key": "by_department",
      "type": "table",
      "label": "By Department",
      "span": 6,
      "order": 170,
      "columns": [
        {
          "key": "department",
          "label": "By Department",
          "format": "text",
          "width": 150
        },
        {
          "key": "employees",
          "label": "Employees",
          "format": "number"
        },
        {
          "key": "gross",
          "label": "Gross",
          "format": "currency"
        },
        {
          "key": "deduction",
          "label": "Deductions",
          "format": "currency"
        },
        {
          "key": "net",
          "label": "Net",
          "format": "currency"
        }
      ],
      "empty_text": "No data for this run.",
      "sticky_columns": 1,
      "total_label": "Rows"
    },
    {
      "key": "by_location",
      "type": "table",
      "label": "By Location",
      "span": 6,
      "order": 180,
      "columns": [
        {
          "key": "location",
          "label": "By Location",
          "format": "text",
          "width": 150
        },
        {
          "key": "employees",
          "label": "Employees",
          "format": "number"
        },
        {
          "key": "gross",
          "label": "Gross",
          "format": "currency"
        },
        {
          "key": "deduction",
          "label": "Deductions",
          "format": "currency"
        },
        {
          "key": "net",
          "label": "Net",
          "format": "currency"
        }
      ],
      "empty_text": "No data for this run.",
      "sticky_columns": 1,
      "total_label": "Rows"
    }
  ],
  "i18n": {
    "namespace": "payroll.dashboard"
  }
}
