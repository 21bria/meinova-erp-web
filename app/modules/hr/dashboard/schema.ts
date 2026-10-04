import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/hr/dashboard/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate hr/dashboard`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const hrDashboardSchema: DashboardSchema = {
  "module": "hr/dashboard",
  "type": "dashboard",
  "title": "HR Dashboard",
  "slug": "dashboard",
  "entity": "HRDashboard",
  "description": "Ringkasan data SDM pada periode berjalan.",
  "endpoint": "/api/hr/dashboard/",
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
      "placement": "quick"
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
    }
  ],
  "widgets": [
    {
      "key": "total_employees",
      "type": "stat",
      "label": "Total Employees",
      "span": 2,
      "order": 10,
      "icon": "users",
      "format": "number",
      "trend": true
    },
    {
      "key": "attendance_rate",
      "type": "stat",
      "label": "Attendance (Average)",
      "span": 2,
      "order": 20,
      "icon": "calendar-check",
      "format": "percent",
      "precision": 1,
      "trend": true
    },
    {
      "key": "active_leaves",
      "type": "stat",
      "label": "Active Leave",
      "span": 2,
      "order": 30,
      "icon": "clock-3",
      "format": "number",
      "trend": true
    },
    {
      "key": "overtime_hours",
      "type": "stat",
      "label": "Overtime Hours",
      "span": 2,
      "order": 40,
      "icon": "briefcase-business",
      "format": "number",
      "precision": 1,
      "trend": true
    },
    {
      "key": "turnover_rate",
      "type": "stat",
      "label": "Turnover Rate",
      "span": 2,
      "order": 50,
      "icon": "trending-down",
      "format": "percent",
      "precision": 2,
      "trend": true
    },
    {
      "key": "open_vacancies",
      "type": "stat",
      "label": "Open Vacancies",
      "span": 2,
      "order": 60,
      "icon": "user-plus",
      "format": "number",
      "trend": true
    },
    {
      "key": "attendance_trend",
      "type": "chart",
      "label": "Daily Attendance",
      "description": "Jumlah pegawai hadir, telat, dan tidak hadir. Cuti dan hari libur tidak dihitung.",
      "span": 8,
      "order": 110,
      "chart": "bar",
      "x_label": "Period",
      "y_format": "number",
      "stacked": true,
      "horizontal": false
    },
    {
      "key": "employees_by_unit",
      "type": "chart",
      "label": "Employee Distribution by Work Unit",
      "span": 4,
      "order": 120,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "employees_by_education",
      "type": "chart",
      "label": "Employee Distribution by Education Level",
      "span": 4,
      "order": 130,
      "chart": "bar",
      "x_label": "Level",
      "y_format": "number"
    },
    {
      "key": "leave_recap",
      "type": "list",
      "label": "Leave Recap",
      "description": "Pemakaian cuti per tipe pada periode terpilih.",
      "span": 4,
      "order": 140,
      "columns": [
        {
          "key": "label",
          "label": "Leave Type",
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
          "key": "days",
          "label": "Days",
          "format": "number"
        }
      ],
      "empty_text": "No leave recorded for this period.",
      "link": "/hr/leave"
    },
    {
      "key": "recent_leaves",
      "type": "list",
      "label": "Recent Leave",
      "description": "Cuti terbaru yang dicatat pada periode terpilih.",
      "span": 4,
      "order": 150,
      "columns": [
        {
          "key": "name",
          "label": "Employees",
          "format": "text"
        },
        {
          "key": "type",
          "label": "Type",
          "format": "text"
        },
        {
          "key": "date",
          "label": "Date",
          "format": "date"
        },
        {
          "key": "days",
          "label": "Days",
          "format": "number"
        }
      ],
      "empty_text": "No leave recorded yet.",
      "link": "/hr/leave",
      "limit": 5
    },
    {
      "key": "upcoming_trainings",
      "type": "list",
      "label": "Upcoming Training",
      "span": 4,
      "order": 160,
      "columns": [
        {
          "key": "name",
          "label": "Program",
          "format": "text"
        },
        {
          "key": "date",
          "label": "Start",
          "format": "date"
        },
        {
          "key": "participants",
          "label": "Participants",
          "format": "number"
        }
      ],
      "empty_text": "No training programme scheduled.",
      "link": "/hr/training",
      "limit": 5
    },
    {
      "key": "employment_reminders",
      "type": "list",
      "label": "Employment Reminders",
      "description": "Masa percobaan, kontrak, dan ulang tahun yang mendekat. Ambang harinya diatur di Reminder Policy.",
      "span": 8,
      "order": 170,
      "columns": [
        {
          "key": "name",
          "label": "Employees",
          "format": "text"
        },
        {
          "key": "kind_label",
          "label": "Type",
          "format": "text"
        },
        {
          "key": "date",
          "label": "Date",
          "format": "date"
        },
        {
          "key": "days_left",
          "label": "Days Remaining",
          "format": "number"
        }
      ],
      "empty_text": "No upcoming dates.",
      "link": "/hr/employees",
      "limit": 8
    }
  ],
  "i18n": {
    "namespace": "hr.dashboard"
  }
}
