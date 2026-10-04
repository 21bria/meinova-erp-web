import { createForm, field } from "@framework"

export const usersForm = createForm([
  field.text("username", "Username", {
      "labelKey": "administration.security.users.fields.username",
      "required": true,
      "hint": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
      "tab": "general",
      "order": 10
    }),

  field.text("full_name", "Name", {
      "labelKey": "administration.security.users.fields.full_name",
      "readonly": true,
      "tab": "general",
      "order": 20
    }),

  field.email("email", "Email", {
      "labelKey": "administration.security.users.fields.email",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.text("role_names", "Roles", {
      "labelKey": "administration.security.users.fields.role_names",
      "readonly": true,
      "hint": "Hak akses yang sebenarnya berlaku. Kolom `groups` bawaan Django ada di model tapi tidak dibaca satu baris kode pun.",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.security.users.fields.is_active",
      "hint": "Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
      "default": true,
      "tab": "general",
      "order": 50
    }),

  field.switch("is_staff", "Staff", {
      "labelKey": "administration.security.users.fields.is_staff",
      "hint": "Designates whether the user can log into this admin site.",
      "default": false,
      "tab": "general",
      "order": 60
    }),

  field.switch("is_superuser", "Superuser", {
      "labelKey": "administration.security.users.fields.is_superuser",
      "readonly": true,
      "hint": "Designates that this user has all permissions without explicitly assigning them.",
      "default": false,
      "tab": "general",
      "order": 70
    }),

  field.datetime("last_login", "Last Login", {
      "labelKey": "administration.security.users.fields.last_login",
      "readonly": true,
      "tab": "general",
      "order": 80
    }),

  field.text("password", "Password", {
      "labelKey": "administration.security.users.fields.password",
      "tab": "general"
    }),

  field.text("first_name", "First name", {
      "labelKey": "administration.security.users.fields.first_name",
      "tab": "general"
    }),

  field.text("last_name", "Last name", {
      "labelKey": "administration.security.users.fields.last_name",
      "tab": "general"
    }),

  field.datetime("date_joined", "date joined", {
      "labelKey": "administration.security.users.fields.date_joined",
      "tab": "general"
    }),

  field.select("language", "language", {
      "labelKey": "administration.security.users.fields.language",
      "hint": "Bahasa antarmuka. Tidak memengaruhi zona waktu maupun data bisnis.",
      "default": "en",
      "multiple": false,
      "tab": "general",
      "options": [
        {
          "value": "en",
          "label": "English"
        },
        {
          "value": "id",
          "label": "Bahasa Indonesia"
        }
      ]
    }),
], {
  columns: 2,
})