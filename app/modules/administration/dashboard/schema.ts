import type { DashboardSchema } from "@framework"

/*
 * Digenerate dari GET /api/framework/schema/administration/dashboard/
 *
 * Jangan diedit manual — jalankan `pnpm meinova generate administration/dashboard`
 * lagi setelah mengubah schema di backend, kalau tidak susunan widget
 * di sini akan menyimpang dari resolver-nya.
 */
export const administrationDashboardSchema: DashboardSchema = {
  "module": "administration/dashboard",
  "type": "dashboard",
  "title": "Administration Dashboard",
  "slug": "dashboard",
  "entity": "AdministrationDashboard",
  "description": "Struktur organisasi, kesehatan konfigurasi, dan aktivitas sistem.",
  "endpoint": "/api/administration/overview/",
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
    }
  ],
  "widgets": [
    {
      "key": "total_companies",
      "type": "stat",
      "label": "Company",
      "span": 2,
      "order": 10,
      "icon": "building-2",
      "format": "number",
      "trend": false
    },
    {
      "key": "total_branches",
      "type": "stat",
      "label": "Branch",
      "span": 2,
      "order": 20,
      "icon": "network",
      "format": "number",
      "trend": false
    },
    {
      "key": "total_locations",
      "type": "stat",
      "label": "Location",
      "span": 2,
      "order": 30,
      "icon": "map-pin",
      "format": "number",
      "trend": false
    },
    {
      "key": "active_users",
      "type": "stat",
      "label": "Active Users",
      "span": 2,
      "order": 40,
      "icon": "users",
      "format": "number",
      "trend": false
    },
    {
      "key": "audit_events",
      "type": "stat",
      "label": "Recorded Activity",
      "span": 2,
      "order": 50,
      "icon": "activity",
      "format": "number",
      "trend": true
    },
    {
      "key": "configuration_issues",
      "type": "stat",
      "label": "Configuration Issues",
      "span": 2,
      "order": 60,
      "icon": "triangle-alert",
      "format": "number",
      "trend": false
    },
    {
      "key": "activity_trend",
      "type": "chart",
      "label": "Activity Trend",
      "description": "Perubahan data yang tercatat di jejak audit; satuannya mengikuti periode yang dipilih.",
      "span": 8,
      "order": 110,
      "chart": "line",
      "x_label": "Period",
      "y_format": "number"
    },
    {
      "key": "activity_by_module",
      "type": "chart",
      "label": "Activity by Module",
      "span": 4,
      "order": 120,
      "chart": "donut",
      "y_format": "number"
    },
    {
      "key": "organization_structure",
      "type": "chart",
      "label": "Organization Structure",
      "description": "Jumlah baris master per level.",
      "span": 4,
      "order": 130,
      "chart": "bar",
      "x_label": "Level",
      "y_format": "number"
    },
    {
      "key": "configuration_health",
      "type": "list",
      "label": "Configuration Health",
      "description": "Pemeriksaan sungguhan terhadap master yang wajib terisi sebelum modul lain bisa dipakai.",
      "span": 4,
      "order": 140,
      "columns": [
        {
          "key": "name",
          "label": "Item",
          "format": "text"
        },
        {
          "key": "hint",
          "label": "Remarks",
          "format": "text"
        },
        {
          "key": "status",
          "label": "Status",
          "format": "status"
        }
      ],
      "empty_text": "No checks to show."
    },
    {
      "key": "upcoming_holidays",
      "type": "list",
      "label": "Upcoming Holidays",
      "description": "90 hari ke depan, di luar filter periode.",
      "span": 4,
      "order": 150,
      "columns": [
        {
          "key": "name",
          "label": "Name",
          "format": "text"
        },
        {
          "key": "scope",
          "label": "Applies To",
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
      "empty_text": "No holidays registered in the next 90 days.",
      "link": "/administration/calendar",
      "limit": 6
    },
    {
      "key": "recent_audit",
      "type": "list",
      "label": "Recent Activity",
      "description": "Perubahan data terakhir beserta pelakunya.",
      "span": 12,
      "order": 160,
      "columns": [
        {
          "key": "object",
          "label": "Object",
          "format": "text"
        },
        {
          "key": "user",
          "label": "By",
          "format": "text"
        },
        {
          "key": "action",
          "label": "Action",
          "format": "text"
        },
        {
          "key": "module",
          "label": "Module",
          "format": "text"
        },
        {
          "key": "time",
          "label": "Time",
          "format": "datetime"
        }
      ],
      "empty_text": "No activity recorded yet.",
      "link": "/administration/audit",
      "limit": 8
    }
  ],
  "i18n": {
    "namespace": "administration.dashboard"
  }
}
