import { createForm, field } from "@framework"

export const branchTypesForm = createForm([
  field.switch("is_active", "Is active", {
      "labelKey": "references.organization.branch-types.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("code", "Code", {
      "labelKey": "references.organization.branch-types.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "references.organization.branch-types.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.organization.branch-types.fields.description",
      "default": "",
      "layout": "full",
      "tab": "general"
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.organization.branch-types.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),
], {
  columns: 2,
})