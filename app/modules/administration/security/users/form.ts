import { createForm, field } from "@framework"

export const userForm = createForm([
  field.text("username", "Username", {
    required: true,
    placeholder: "admin",
  }),

  field.email("email", "Email", {
    placeholder: "user@company.com",
  }),

  field.text("first_name", "First Name"),
  field.text("last_name", "Last Name"),

  field.password("password", "Password", {
    requiredOnCreate: true,
    placeholder: "Leave blank to keep current password",
  }),

  field.switch("is_active", "Active"),
  field.switch("is_staff", "Staff"),
])