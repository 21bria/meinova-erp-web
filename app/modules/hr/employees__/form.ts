import { createForm, field,MRichEditor } from "@framework"

export const employeesForm = createForm([
  field.lookup("user", "User", "/api/accounts/users/lookup/"),

  field.text("employee_number", "Employee Number", {
      "required": true,
      "placeholder": "e.g. EMP-0001"
    }),

  field.text("nik", "NIK", {
      "placeholder": "National identity number"
    }),

  field.text("first_name", "First Name", {
      "required": true
    }),

  field.text("middle_name", "Middle Name"),

  field.text("last_name", "Last Name"),

  field.text("preferred_name", "Preferred Name"),

  field.lookup("gender", "Gender", "/api/administration/lookup/genders/"),

  field.lookup("religion", "Religion", "/api/administration/lookup/religions/"),

  field.lookup("nationality", "Nationality", "/api/administration/lookup/nationalities/"),

  field.lookup("blood_type", "Blood Type", "/api/references/hr/blood-types/lookup/"),

  field.lookup("marital_status", "Marital Status", "/api/references/hr/marital-status/lookup/"),

  field.text("birth_place", "Birth Place"),

  field.date("birth_date", "Birth Date"),

  field.email("personal_email", "Personal Email"),

  field.email("work_email", "Work Email"),

  field.text("phone", "Phone"),

  field.text("mobile", "Mobile"),

  field.text("avatar", "Avatar"),

  field.custom("notes", MRichEditor, {
      "rows": 4,
      "layout": "full"
    }),

  field.switch("is_active", "Active"),
], {
  columns: 3,
})