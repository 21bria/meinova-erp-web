import { createForm, field } from "@framework"

export const bankBranchesForm = createForm([
  field.lookup("bank", "Bank", "/api/administration/references/bank/lookup/banks/", {
      "labelKey": "references.bank.bank-branches.fields.bank",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Code", {
      "labelKey": "references.bank.bank-branches.fields.code",
      "required": true,
      "placeholder": "e.g. BCA-JKT",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "references.bank.bank-branches.fields.name",
      "required": true,
      "placeholder": "Branch name",
      "tab": "general",
      "order": 30
    }),

  field.text("branch_code", "Branch Code", {
      "labelKey": "references.bank.bank-branches.fields.branch_code",
      "required": true,
      "placeholder": "e.g. 001",
      "tab": "general",
      "order": 40
    }),

  field.text("swift_code", "SWIFT Code", {
      "labelKey": "references.bank.bank-branches.fields.swift_code",
      "placeholder": "e.g. CENAIDJA",
      "tab": "general",
      "order": 50
    }),

  field.textarea("address", "Address", {
      "labelKey": "references.bank.bank-branches.fields.address",
      "required": true,
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 60
    }),

  field.text("phone", "Phone", {
      "labelKey": "references.bank.bank-branches.fields.phone",
      "required": true,
      "tab": "general"
    }),

  field.text("email", "Email", {
      "labelKey": "references.bank.bank-branches.fields.email",
      "required": true,
      "tab": "general"
    }),

  field.text("contact_person", "Contact person", {
      "labelKey": "references.bank.bank-branches.fields.contact_person",
      "required": true,
      "tab": "general"
    }),

  field.switch("is_head_office", "Is head office", {
      "labelKey": "references.bank.bank-branches.fields.is_head_office",
      "required": true,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.bank.bank-branches.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})