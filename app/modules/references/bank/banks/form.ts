import { createForm, field } from "@framework"

export const banksForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.bank.banks.fields.code",
      "required": true,
      "placeholder": "e.g. BCA",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.bank.banks.fields.name",
      "required": true,
      "placeholder": "Bank name",
      "tab": "general",
      "order": 20
    }),

  field.text("short_name", "Short Name", {
      "labelKey": "references.bank.banks.fields.short_name",
      "required": true,
      "placeholder": "e.g. BCA",
      "tab": "general",
      "order": 30
    }),

  field.text("swift_code", "SWIFT Code", {
      "labelKey": "references.bank.banks.fields.swift_code",
      "required": true,
      "placeholder": "e.g. CENAIDJA",
      "tab": "general",
      "order": 40
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.bank.banks.fields.description",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.bank.banks.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})