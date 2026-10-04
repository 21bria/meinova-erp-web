import { createForm, field } from "@framework"

export const locationTypesForm = createForm([
  field.switch("is_active", "Is active", {
      "labelKey": "references.organization.location-types.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("code", "Code", {
      "labelKey": "references.organization.location-types.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "references.organization.location-types.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.organization.location-types.fields.description",
      "default": "",
      "layout": "full",
      "tab": "general"
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.organization.location-types.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),
], {
  columns: 2,
})