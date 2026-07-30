import { createForm, field } from "@framework"

export const bankBranchesForm = createForm([
  field.lookup("bank", "Bank", "/api/administration/references/bank/lookup/banks/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Code", {
      "required": true,
      "placeholder": "e.g. BCA-JKT",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "required": true,
      "placeholder": "Branch name",
      "tab": "general",
      "order": 30
    }),

  field.text("branch_code", "Branch Code", {
      "required": true,
      "placeholder": "e.g. 001",
      "tab": "general",
      "order": 40
    }),

  field.text("swift_code", "SWIFT Code", {
      "placeholder": "e.g. CENAIDJA",
      "tab": "general",
      "order": 50
    }),

  field.textarea("address", "Address", {
      "required": true,
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 60
    }),

  field.text("phone", "Phone", {
      "required": true,
      "tab": "general"
    }),

  field.text("email", "Email", {
      "required": true,
      "tab": "general"
    }),

  field.text("contact_person", "Contact person", {
      "required": true,
      "tab": "general"
    }),

  field.switch("is_head_office", "Is head office", {
      "required": true,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})