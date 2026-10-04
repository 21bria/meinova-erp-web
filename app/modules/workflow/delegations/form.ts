import { createForm, field } from "@framework"

export const delegationsForm = createForm([
  field.lookup("delegator", "Delegator", "/api/accounts/lookup/users/", {
      "labelKey": "workflow.delegations.fields.delegator",
      "required": true,
      "displayKey": "delegator_name",
      "hint": "Approver yang berhalangan.",
      "tab": "general",
      "order": 10
    }),

  field.lookup("delegate", "Delegate", "/api/accounts/lookup/users/", {
      "labelKey": "workflow.delegations.fields.delegate",
      "required": true,
      "displayKey": "delegate_name",
      "hint": "Yang diberi kuasa memutuskan selama periode ini. Keputusannya tetap tercatat atas nama Delegator, dengan namanya sendiri di kolom 'Acted By'.",
      "tab": "general",
      "order": 20
    }),

  field.datetime("starts_at", "Starts", {
      "labelKey": "workflow.delegations.fields.starts_at",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.datetime("ends_at", "Ends", {
      "labelKey": "workflow.delegations.fields.ends_at",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "workflow.delegations.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 50
    }),

  field.switch("is_running", "Currently Active", {
      "labelKey": "workflow.delegations.fields.is_running",
      "readonly": true,
      "hint": "Aktif dan periodenya sedang berjalan hari ini. Aktif saja belum berarti berlaku.",
      "tab": "general",
      "order": 60
    }),

  field.text("module", "Module", {
      "labelKey": "workflow.delegations.fields.module",
      "hint": "Dikosongkan = berlaku untuk semua modul.",
      "default": "",
      "tab": "scope",
      "order": 110
    }),

  field.text("document_type", "Document Type", {
      "labelKey": "workflow.delegations.fields.document_type",
      "hint": "Dikosongkan = berlaku untuk semua jenis dokumen. Kalau diisi, Module wajib ikut diisi.",
      "default": "",
      "tab": "scope",
      "order": 120
    }),

  field.textarea("reason", "Reason", {
      "labelKey": "workflow.delegations.fields.reason",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "scope",
      "order": 130
    }),
], {
  columns: 2,
})