import { createForm, field } from "@framework"

export const apiKeysForm = createForm([
  field.switch("is_active", "Is active", {
      "labelKey": "administration.security.api-keys.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "administration.security.api-keys.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.datetime("expires_at", "Expires at", {
      "labelKey": "administration.security.api-keys.fields.expires_at",
      "tab": "general"
    }),

  field.text("allowed_ips", "Allowed ips", {
      "labelKey": "administration.security.api-keys.fields.allowed_ips",
      "tab": "general"
    }),

  field.text("scopes", "Scopes", {
      "labelKey": "administration.security.api-keys.fields.scopes",
      "tab": "general"
    }),
], {
  columns: 2,
})