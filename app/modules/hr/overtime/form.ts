import { createForm, field } from "@framework"

export const overtimeForm = createForm([
  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.overtime.fields.employee",
      "required": true,
      "autofill": {
        "company": "company",
        "branch": "branch",
        "location": "location"
      },
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.date("work_date", "Work Date", {
      "labelKey": "hr.overtime.fields.work_date",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("overtime_type", "Overtime Type", "/api/administration/references/hr/lookup/overtime-types/", {
      "labelKey": "hr.overtime.fields.overtime_type",
      "displayKey": "overtime_type_name",
      "tab": "general",
      "order": 30
    }),

  field.select("status", "Status", {
      "labelKey": "hr.overtime.fields.status",
      "required": true,
      "displayKey": "status_label",
      "default": "recorded",
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "label": "Recorded",
          "value": "recorded"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.switch("is_paid", "Paid", {
      "labelKey": "hr.overtime.fields.is_paid",
      "hint": "Matikan kalau lembur diganti libur pengganti, bukan uang.",
      "default": true,
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.overtime.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.time("start_time", "Start Time", {
      "labelKey": "hr.overtime.fields.start_time",
      "required": true,
      "tab": "time",
      "order": 110
    }),

  field.time("end_time", "End Time", {
      "labelKey": "hr.overtime.fields.end_time",
      "required": true,
      "hint": "Lebih kecil dari jam mulai dianggap lewat tengah malam.",
      "tab": "time",
      "order": 120
    }),

  field.number("duration_minutes", "Duration (minutes)", {
      "labelKey": "hr.overtime.fields.duration_minutes",
      "hint": "Dikosongkan = dihitung otomatis dari jam mulai dan selesai.",
      "tab": "time",
      "order": 130
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.overtime.fields.company",
      "disabled": true,
      "displayKey": "company_name",
      "hint": "Terisi otomatis dari penempatan pegawai.",
      "tab": "organization",
      "order": 210
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.overtime.fields.branch",
      "disabled": true,
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "branch_name",
      "tab": "organization",
      "order": 220
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.overtime.fields.location",
      "disabled": true,
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "tab": "organization",
      "order": 230
    }),

  field.text("reason", "Reason", {
      "labelKey": "hr.overtime.fields.reason",
      "default": "",
      "tab": "notes",
      "order": 310
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.overtime.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "notes",
      "order": 320
    }),
], {
  columns: 3,
})