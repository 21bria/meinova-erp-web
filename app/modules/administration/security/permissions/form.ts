import { createForm, field } from "@framework"

export const permissionsForm = createForm([
  field.text("name", "Permission", {
      "labelKey": "administration.security.permissions.fields.name",
      "readonly": true,
      "tab": "general",
      "order": 10
    }),

  field.text("module", "Module", {
      "labelKey": "administration.security.permissions.fields.module",
      "readonly": true,
      "tab": "general",
      "order": 20
    }),

  field.text("model", "Object", {
      "labelKey": "administration.security.permissions.fields.model",
      "readonly": true,
      "tab": "general",
      "order": 30
    }),

  field.text("code", "Codename", {
      "labelKey": "administration.security.permissions.fields.code",
      "readonly": true,
      "tab": "general",
      "order": 40
    }),

  field.text("codename", "codename", {
      "labelKey": "administration.security.permissions.fields.codename",
      "required": true,
      "tab": "general"
    }),
], {
  columns: 2,
})