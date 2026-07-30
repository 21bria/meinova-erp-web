import { createForm, field } from "@framework"

export const banksForm = createForm([
  field.text("code", "Code", {
      "required": true,
      "placeholder": "e.g. BCA",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "required": true,
      "placeholder": "Bank name",
      "tab": "general",
      "order": 20
    }),

  field.text("short_name", "Short Name", {
      "required": true,
      "placeholder": "e.g. BCA",
      "tab": "general",
      "order": 30
    }),

  field.text("swift_code", "SWIFT Code", {
      "required": true,
      "placeholder": "e.g. CENAIDJA",
      "tab": "general",
      "order": 40
    }),

  field.textarea("description", "Description", {
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})