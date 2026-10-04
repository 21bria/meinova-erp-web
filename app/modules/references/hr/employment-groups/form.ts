import { createForm, field } from "@framework"

export const employmentGroupsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.employment-groups.fields.code",
      "required": true,
      "placeholder": "e.g. CODE",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.employment-groups.fields.name",
      "required": true,
      "placeholder": "Name",
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.employment-groups.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.switch("attendance_applicable", "Attendance", {
      "labelKey": "references.hr.employment-groups.fields.attendance_applicable",
      "hint": "Pegawai group ini jadi subjek Attendance — jadwal, penutupan hari, dan penandaan mangkir. Matikan untuk direksi: mereka tetap Employee, cuma tidak diabsen.",
      "default": true,
      "tab": "general",
      "order": 40
    }),

  field.switch("leave_applicable", "Leave", {
      "labelKey": "references.hr.employment-groups.fields.leave_applicable",
      "hint": "Pegawai group ini memakai proses Cuti — saldo, pengajuan, dan persetujuan.",
      "default": true,
      "tab": "general",
      "order": 50
    }),

  field.switch("roster_applicable", "Roster", {
      "labelKey": "references.hr.employment-groups.fields.roster_applicable",
      "hint": "Ikut Roster — muncul sebagai kandidat Roster Setup dan Roster Assignment.",
      "default": true,
      "tab": "general",
      "order": 60
    }),

  field.switch("shift_applicable", "Shift", {
      "labelKey": "references.hr.employment-groups.fields.shift_applicable",
      "hint": "Memakai Shift pada pola kerjanya. Mati = kolom Shift tidak berlaku untuk pegawai group ini.",
      "default": true,
      "tab": "general",
      "order": 70
    }),

  field.switch("overtime_applicable", "Overtime", {
      "labelKey": "references.hr.employment-groups.fields.overtime_applicable",
      "hint": "Bisa mengajukan atau dicatatkan Lembur.",
      "default": true,
      "tab": "general",
      "order": 80
    }),

  field.switch("field_break_applicable", "Field Break / Travel Request", {
      "labelKey": "references.hr.employment-groups.fields.field_break_applicable",
      "hint": "Employees in this group may use Travel Request.",
      "default": true,
      "tab": "general",
      "order": 90
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.employment-groups.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("business_trip_applicable", "Business Trip", {
      "labelKey": "references.hr.employment-groups.fields.business_trip_applicable",
      "hint": "Employees in this group may use Business Trip.",
      "default": true,
      "tab": "general",
      "order": 100
    }),

  field.select("travel_document", "Travel Document", {
      "labelKey": "references.hr.employment-groups.fields.travel_document",
      "readonly": true,
      "hint": "Derived from Field Break / Travel Request and Business Trip after saving.",
      "modes": [
        "edit",
        "detail"
      ],
      "multiple": false,
      "tab": "general",
      "order": 110,
      "options": [
        {
          "value": "travel_request",
          "label": "Travel Request"
        },
        {
          "value": "business_trip",
          "label": "Business Trip"
        },
        {
          "value": "both",
          "label": "Travel Request + Business Trip"
        },
        {
          "value": "none",
          "label": "No travel document enabled"
        }
      ]
    }),

  field.warnings("travel_document_warnings", "Travel Document Warnings", {
      "labelKey": "references.hr.employment-groups.fields.travel_document_warnings",
      "readonly": true,
      "modes": [
        "edit",
        "detail"
      ],
      "layout": "full",
      "tab": "general",
      "order": 120
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.employment-groups.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})