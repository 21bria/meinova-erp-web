import { createForm, field } from "@framework"

export const rolesForm = createForm([
  // Tanpa field cakupan. Sampai Stage 4F keduanya masih bisa
  // disunting di sini, dan itulah bahayanya: menyunting cakupan pada
  // Role menggeser kewenangan **setiap** pemegangnya sekaligus.
  // Sejak Stage 4I kolomnya tidak dikirim backend sama sekali.
  // Penggantinya tab User Roles -> Kewenangan, per orang per role.
  field.switch("is_active", "Is active", {
      "labelKey": "administration.security.roles.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("code", "Code", {
      "labelKey": "administration.security.roles.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "administration.security.roles.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "administration.security.roles.fields.description",
      "layout": "full",
      "tab": "general"
    }),
], {
  columns: 2,
})