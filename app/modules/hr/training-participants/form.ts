import { createForm, field } from "@framework"

export const trainingParticipantsForm = createForm([
  field.lookup("program", "Program", "/api/hr/lookup/training-programs/", {
      "labelKey": "hr.training-participants.fields.program",
      "required": true,
      "displayKey": "program_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.training-participants.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 20
    }),

  field.select("status", "Status", {
      "labelKey": "hr.training-participants.fields.status",
      "required": true,
      "displayKey": "status_label",
      "default": "registered",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Registered",
          "value": "registered"
        },
        {
          "label": "Attended",
          "value": "attended"
        },
        {
          "label": "Absent",
          "value": "absent"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.training-participants.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.number("score", "Score", {
      "labelKey": "hr.training-participants.fields.score",
      "tab": "result",
      "order": 110
    }),

  field.switch("is_passed", "Passed", {
      "labelKey": "hr.training-participants.fields.is_passed",
      "hint": "Dibiarkan kosong berarti belum dinilai — bukan tidak lulus.",
      "tab": "result",
      "order": 120
    }),

  field.text("certificate_number", "Certificate Number", {
      "labelKey": "hr.training-participants.fields.certificate_number",
      "default": "",
      "tab": "result",
      "order": 130
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.training-participants.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "result",
      "order": 140
    }),
], {
  columns: 2,
})