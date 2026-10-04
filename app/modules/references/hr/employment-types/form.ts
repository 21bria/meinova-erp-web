import { createForm, field } from "@framework"

export const employmentTypesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.employment-types.fields.code",
      "required": true,
      "placeholder": "e.g. CODE",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.employment-types.fields.name",
      "required": true,
      "placeholder": "Name",
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.employment-types.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.employment-types.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("requires_contract", "Requires contract", {
      "labelKey": "references.hr.employment-types.fields.requires_contract",
      "hint": "Jenis ini terikat masa kontrak — Contract Type, Contract Start, dan Contract End berlaku untuknya. Kosongkan untuk pegawai tetap.",
      "default": false,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.employment-types.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})