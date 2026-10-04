import { createForm, field } from "@framework"

export const facilityTypesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.organization.facility-types.fields.code",
      "required": true,
      "placeholder": "e.g. WORKSHOP",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.organization.facility-types.fields.name",
      "required": true,
      "placeholder": "e.g. Workshop",
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.organization.facility-types.fields.description",
      "default": "",
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "references.organization.facility-types.fields.sort_order",
      "default": 0,
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.organization.facility-types.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})