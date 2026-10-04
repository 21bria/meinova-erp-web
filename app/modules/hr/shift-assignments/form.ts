import { createForm, field } from "@framework"

export const shiftAssignmentsForm = createForm([
  field.text("employee_number", "Employee No.", {
      "labelKey": "hr.shift-assignments.fields.employee_number",
      "readonly": true,
      "tab": "general",
      "order": 5
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.shift-assignments.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.select("kind", "Kind", {
      "labelKey": "hr.shift-assignments.fields.kind",
      "required": true,
      "displayKey": "kind_label",
      "hint": "Recovery / Rest = hari pemulihan: tidak menunjuk shift, dan tanggalnya tidak menerbitkan kewajiban presensi. Disisipkan generator saat jeda antar pergantian shift kurang dari Minimum Rest di Roster Policy.",
      "default": "work",
      "multiple": false,
      "tab": "general",
      "order": 15,
      "options": [
        {
          "label": "Working Shift",
          "value": "work"
        },
        {
          "label": "Recovery / Rest",
          "value": "rest"
        }
      ]
    }),

  field.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
      "labelKey": "hr.shift-assignments.fields.shift",
      "displayKey": "shift_name",
      "visibleWhen": {
        "field": "kind",
        "op": "eq",
        "value": "work"
      },
      "hint": "Jam kerjanya milik master Shift. Mengubah jam di sana mengubah jadwal seluruh pegawai yang memakainya. Dikosongkan untuk baris Recovery / Rest.",
      "tab": "general",
      "order": 20
    }),

  field.text("shift_start_time", "Start", {
      "labelKey": "hr.shift-assignments.fields.shift_start_time",
      "readonly": true,
      "tab": "general",
      "order": 22
    }),

  field.text("shift_end_time", "End", {
      "labelKey": "hr.shift-assignments.fields.shift_end_time",
      "readonly": true,
      "tab": "general",
      "order": 24
    }),

  field.select("layer", "Layer", {
      "labelKey": "hr.shift-assignments.fields.layer",
      "required": true,
      "displayKey": "layer_label",
      "hint": "Adjustment menang pada rentangnya; tanggal di luar rentang kembali ke rencana dari Roster. Di alur normal kolom ini tidak pernah ditanyakan — Roster yang menulis rencananya, kalender yang membuat penyesuaiannya.",
      "default": "baseline",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Roster Baseline",
          "value": "baseline"
        },
        {
          "label": "Adjustment",
          "value": "override"
        }
      ]
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "hr.shift-assignments.fields.start_date",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.date("end_date", "End Date", {
      "labelKey": "hr.shift-assignments.fields.end_date",
      "required": true,
      "hint": "Inklusif. Rentang terbuka tidak diizinkan — dua rentang terbuka pada satu lapis tidak punya jawaban yang bisa ditebak.",
      "tab": "general",
      "order": 50
    }),

  field.number("day_count", "Days", {
      "labelKey": "hr.shift-assignments.fields.day_count",
      "readonly": true,
      "tab": "general",
      "order": 55
    }),

  field.text("reason", "Reason", {
      "labelKey": "hr.shift-assignments.fields.reason",
      "hint": "Wajib untuk Adjustment.",
      "default": "",
      "tab": "general",
      "order": 60
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.shift-assignments.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.shift-assignments.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})