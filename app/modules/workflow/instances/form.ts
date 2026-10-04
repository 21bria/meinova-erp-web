import { createForm, field } from "@framework"

export const instancesForm = createForm([
  field.text("document_number", "Document No.", {
      "labelKey": "workflow.instances.fields.document_number",
      "readonly": true,
      "default": "",
      "tab": "document",
      "order": 10
    }),

  field.text("document_label", "Document", {
      "labelKey": "workflow.instances.fields.document_label",
      "readonly": true,
      "hint": "Ringkasan yang ditampilkan di kotak masuk approver — disalin, bukan dibaca lewat relasi, karena engine ini tidak mengenal model dokumennya.",
      "default": "",
      "tab": "document",
      "order": 20
    }),

  field.text("module", "Module", {
      "labelKey": "workflow.instances.fields.module",
      "readonly": true,
      "tab": "document",
      "order": 30
    }),

  field.text("document_type", "Document Type", {
      "labelKey": "workflow.instances.fields.document_type",
      "readonly": true,
      "tab": "document",
      "order": 40
    }),

  field.lookup("subject_employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "workflow.instances.fields.subject_employee",
      "readonly": true,
      "displayKey": "subject_name",
      "tab": "document",
      "order": 50
    }),

  field.text("company_name", "Company", {
      "labelKey": "workflow.instances.fields.company_name",
      "readonly": true,
      "tab": "document",
      "order": 60
    }),

  field.text("location_name", "Location", {
      "labelKey": "workflow.instances.fields.location_name",
      "readonly": true,
      "tab": "document",
      "order": 70
    }),

  field.select("status", "Status", {
      "labelKey": "workflow.instances.fields.status",
      "readonly": true,
      "displayKey": "status_label",
      "default": "draft",
      "multiple": false,
      "tab": "state",
      "order": 110,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Pending",
          "value": "pending"
        },
        {
          "label": "Approved",
          "value": "approved"
        },
        {
          "label": "Rejected",
          "value": "rejected"
        },
        {
          "label": "Returned",
          "value": "returned"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.text("current_step_name", "Waiting At", {
      "labelKey": "workflow.instances.fields.current_step_name",
      "readonly": true,
      "hint": "Kotak tanda tangan yang sedang ditunggu.",
      "tab": "state",
      "order": 120
    }),

  field.text("definition_name", "Workflow", {
      "labelKey": "workflow.instances.fields.definition_name",
      "readonly": true,
      "tab": "state",
      "order": 130
    }),

  field.datetime("submitted_at", "Submitted At", {
      "labelKey": "workflow.instances.fields.submitted_at",
      "readonly": true,
      "tab": "state",
      "order": 140
    }),

  field.datetime("completed_at", "Completed At", {
      "labelKey": "workflow.instances.fields.completed_at",
      "readonly": true,
      "tab": "state",
      "order": 150
    }),

  field.text("submitted_by_name", "Submitted By", {
      "labelKey": "workflow.instances.fields.submitted_by_name",
      "readonly": true,
      "tab": "state",
      "order": 160
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "workflow.instances.fields.notes",
      "readonly": true,
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "state",
      "order": 170
    }),
], {
  columns: 3,
})