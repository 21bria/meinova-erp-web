import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/reports/hr/period-summary/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate reports/hr/period-summary`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const reportsHrPeriodSummarySchema: DashboardSchema = {
  "module": "reports/hr/period-summary",
  "type": "dashboard",
  "title": "HR Period Summary",
  "slug": "period-summary",
  "entity": "HRPeriodSummary",
  "description": "Rekap kehadiran, cuti, dan lembur per pegawai pada periode terpilih.",
  "endpoint": "/api/reports/hr/period-summary/",
  "columns": 12,
  "filters": [
    {
      "key": "period",
      "type": "period",
      "label": "Period",
      "mode": "month",
      "modes": [
        "day",
        "week",
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
    }
  ],
  "widgets": [
    {
      "key": "headcount",
      "type": "stat",
      "label": "Headcount",
      "span": 2,
      "order": 10,
      "icon": "users",
      "format": "number",
      "trend": true
    },
    {
      "key": "attendance_rate",
      "type": "stat",
      "label": "Attendance Rate",
      "span": 2,
      "order": 20,
      "icon": "calendar-check",
      "format": "percent",
      "precision": 1,
      "trend": true
    },
    {
      "key": "present_days",
      "type": "stat",
      "label": "Present",
      "span": 2,
      "order": 30,
      "icon": "user-check",
      "format": "number",
      "trend": true
    },
    {
      "key": "absent_days",
      "type": "stat",
      "label": "Absent",
      "span": 2,
      "order": 40,
      "icon": "user-x",
      "format": "number",
      "trend": true
    },
    {
      "key": "leave_days",
      "type": "stat",
      "label": "Leave",
      "span": 2,
      "order": 50,
      "icon": "palmtree",
      "format": "number",
      "precision": 1,
      "trend": true
    },
    {
      "key": "overtime_hours",
      "type": "stat",
      "label": "Total OT",
      "span": 2,
      "order": 60,
      "icon": "briefcase-business",
      "format": "number",
      "precision": 1,
      "trend": true
    },
    {
      "key": "attendance_trend",
      "type": "chart",
      "label": "Attendance Trend",
      "description": "Hadir, telat, dan tidak hadir per satuan periode. Cuti, libur, dan hari off tidak dihitung sebagai peluang hadir.",
      "span": 8,
      "order": 110,
      "chart": "bar",
      "x_label": "Period",
      "y_format": "number",
      "stacked": true,
      "horizontal": false
    },
    {
      "key": "leave_breakdown",
      "type": "chart",
      "label": "Leave Breakdown",
      "description": "Annual, Sick, Other Leave, dan Unpaid adalah pengelompokan laporan; tipe cuti aslinya tetap terbaca di drill-down.",
      "span": 4,
      "order": 120,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "overtime_trend",
      "type": "chart",
      "label": "Overtime Trend",
      "description": "Jam lembur per kategori hari — terjadwal, off, dan libur.",
      "span": 8,
      "order": 130,
      "chart": "bar",
      "x_label": "Period",
      "y_format": "number",
      "stacked": true,
      "horizontal": false
    },
    {
      "key": "department_comparison",
      "type": "chart",
      "label": "Department Comparison",
      "description": "Hadir dan tidak hadir per department.",
      "span": 4,
      "order": 140,
      "chart": "bar",
      "x_label": "Department",
      "y_format": "number",
      "stacked": true,
      "horizontal": true
    },
    {
      "key": "employee_period_summary",
      "type": "table",
      "label": "Employee Period Summary",
      "description": "Satu baris per pegawai untuk periode dan filter yang sedang dipilih. Tekan angkanya untuk melihat catatan sumbernya.",
      "span": 12,
      "order": 200,
      "columns": [
        {
          "key": "employee_number",
          "label": "Employee ID",
          "format": "text",
          "width": 104
        },
        {
          "key": "employee",
          "label": "Employee",
          "format": "text"
        },
        {
          "key": "location",
          "label": "Location",
          "format": "text"
        },
        {
          "key": "scheduled",
          "label": "Scheduled",
          "format": "number",
          "drilldown": "scheduled"
        },
        {
          "key": "present",
          "label": "Present",
          "format": "number",
          "drilldown": "present"
        },
        {
          "key": "absent",
          "label": "Absent",
          "format": "number",
          "drilldown": "absent"
        },
        {
          "key": "business_trip",
          "label": "Business Trip",
          "format": "number",
          "drilldown": "business_trip"
        },
        {
          "key": "annual",
          "label": "Annual",
          "format": "number",
          "drilldown": "annual"
        },
        {
          "key": "sick",
          "label": "Sick",
          "format": "number",
          "drilldown": "sick"
        },
        {
          "key": "other_leave",
          "label": "Other Leave",
          "format": "number",
          "drilldown": "other_leave"
        },
        {
          "key": "unpaid",
          "label": "Unpaid",
          "format": "number",
          "drilldown": "unpaid"
        },
        {
          "key": "field_break",
          "label": "Field Break",
          "format": "number",
          "drilldown": "field_break"
        },
        {
          "key": "off_worked",
          "label": "Off Worked",
          "format": "number",
          "drilldown": "off_worked"
        },
        {
          "key": "holiday_worked",
          "label": "Holiday Worked",
          "format": "number",
          "drilldown": "holiday_worked"
        },
        {
          "key": "late",
          "label": "Late",
          "format": "number",
          "drilldown": "late",
          "suffix": "x"
        },
        {
          "key": "early",
          "label": "Early",
          "format": "number",
          "drilldown": "early",
          "suffix": "x"
        },
        {
          "key": "ot_regular",
          "label": "Regular OT",
          "format": "number",
          "drilldown": "ot_regular",
          "suffix": "h"
        },
        {
          "key": "ot_off",
          "label": "Off OT",
          "format": "number",
          "drilldown": "ot_off",
          "suffix": "h"
        },
        {
          "key": "ot_holiday",
          "label": "Holiday OT",
          "format": "number",
          "drilldown": "ot_holiday",
          "suffix": "h"
        },
        {
          "key": "ot_total",
          "label": "Total OT",
          "format": "number",
          "drilldown": "ot_total",
          "suffix": "h"
        }
      ],
      "empty_text": "No employees for this period and filters.",
      "sticky_columns": 2,
      "page_size": 25,
      "page_size_options": [
        25,
        50,
        100
      ],
      "searchable": true,
      "search_placeholder": "Cari nama atau nomor pegawai",
      "search_placeholder_key": "employee"
    }
  ],
  "i18n": {
    "namespace": "reports.hr.period-summary"
  }
}
