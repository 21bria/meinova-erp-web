import { createForm, field } from "@framework"

export const payrollRunsForm = createForm([
  field.text("document_number", "Run No.", {
      "labelKey": "payroll.payroll-runs.fields.document_number",
      "disabled": true,
      "hint": "Terisi otomatis dari pola penomoran payroll/payroll_run. Kosong berarti pola itu belum diseed — jalankan seed_administration --only=numbering.",
      "default": "",
      "tab": "general",
      "order": 10
    }),

  field.lookup("period", "Payroll Period", "/api/payroll/payroll-periods/lookup/", {
      "labelKey": "payroll.payroll-runs.fields.period",
      "required": true,
      "displayKey": "period_name",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Run Name", {
      "labelKey": "payroll.payroll-runs.fields.name",
      "default": "",
      "tab": "general",
      "order": 30
    }),

  field.select("run_type", "Run Type", {
      "labelKey": "payroll.payroll-runs.fields.run_type",
      "default": "regular",
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "label": "Regular",
          "value": "regular"
        },
        {
          "label": "Off Cycle",
          "value": "off_cycle"
        },
        {
          "label": "Correction",
          "value": "correction"
        }
      ]
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "payroll.payroll-runs.fields.branch",
      "hint": "Kosong = seluruh company.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("location", "Location / Site", "/api/administration/organization/lookup/locations/", {
      "labelKey": "payroll.payroll-runs.fields.location",
      "displayKey": "location_name",
      "hint": "Kosong = seluruh company.",
      "tab": "general",
      "order": 60
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "payroll.payroll-runs.fields.department",
      "displayKey": "department_name",
      "tab": "general",
      "order": 70
    }),

  field.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
      "labelKey": "payroll.payroll-runs.fields.section",
      "dependsOn": "department",
      "lookupParams": {
        "department_id": "$department"
      },
      "tab": "general",
      "order": 80
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.payroll-runs.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.number("total_employer_contribution", "Total employer contribution", {
      "labelKey": "payroll.payroll-runs.fields.total_employer_contribution",
      "default": 0,
      "tab": "general"
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "payroll.payroll-runs.fields.notes",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 100
    }),
], {
  columns: 3,
})