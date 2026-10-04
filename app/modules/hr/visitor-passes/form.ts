import { createForm, field } from "@framework"

export const visitorPassesForm = createForm([
  field.text("pass_number", "Pass No.", {
      "labelKey": "hr.visitor-passes.fields.pass_number",
      "disabled": true,
      "readonly": true,
      "default": "",
      "tab": "general",
      "order": 10
    }),

  field.lookup("request", "Visitor Request", "/api/hr/lookup/visitor-requests/", {
      "labelKey": "hr.visitor-passes.fields.request",
      "required": true,
      "displayKey": "request_number",
      "tab": "general",
      "order": 20
    }),

  field.text("visitor_name", "Visitor Name", {
      "labelKey": "hr.visitor-passes.fields.visitor_name",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 30
    }),

  field.text("visitor_type_label", "Visitor Type", {
      "labelKey": "hr.visitor-passes.fields.visitor_type_label",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 40
    }),

  field.text("host_name", "Host", {
      "labelKey": "hr.visitor-passes.fields.host_name",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 50
    }),

  field.text("location_name", "Location", {
      "labelKey": "hr.visitor-passes.fields.location_name",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 60
    }),

  field.date("visit_date", "Visit Date", {
      "labelKey": "hr.visitor-passes.fields.visit_date",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 70
    }),

  field.date("valid_from", "Valid From", {
      "labelKey": "hr.visitor-passes.fields.valid_from",
      "hint": "Dikosongkan = ikut tanggal mulai kunjungannya.",
      "tab": "general",
      "order": 80
    }),

  field.date("valid_until", "Valid Until", {
      "labelKey": "hr.visitor-passes.fields.valid_until",
      "hint": "Dikosongkan = ikut tanggal selesai kunjungannya.",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.visitor-passes.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.select("status", "Status", {
      "labelKey": "hr.visitor-passes.fields.status",
      "disabled": true,
      "displayKey": "status_label",
      "default": "issued",
      "multiple": false,
      "tab": "general",
      "order": 100,
      "options": [
        {
          "label": "Issued",
          "value": "issued"
        },
        {
          "label": "Returned",
          "value": "returned"
        },
        {
          "label": "Expired",
          "value": "expired"
        },
        {
          "label": "Lost",
          "value": "lost"
        }
      ]
    }),

  field.datetime("issued_at", "Issued At", {
      "labelKey": "hr.visitor-passes.fields.issued_at",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 110
    }),

  field.datetime("returned_at", "Returned At", {
      "labelKey": "hr.visitor-passes.fields.returned_at",
      "disabled": true,
      "readonly": true,
      "tab": "general",
      "order": 120
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.visitor-passes.fields.notes",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 130
    }),
], {
  columns: 2,
})