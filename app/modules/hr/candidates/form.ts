import { createForm, field } from "@framework"

export const candidatesForm = createForm([
  field.text("candidate_number", "Candidate Number", {
      "labelKey": "hr.candidates.fields.candidate_number",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("full_name", "Full Name", {
      "labelKey": "hr.candidates.fields.full_name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("vacancy", "Vacancy", "/api/hr/lookup/job-vacancies/", {
      "labelKey": "hr.candidates.fields.vacancy",
      "displayKey": "vacancy_title",
      "tab": "general",
      "order": 30
    }),

  field.lookup("status", "Status", "/api/administration/references/hr/lookup/candidate-statuses/", {
      "labelKey": "hr.candidates.fields.status",
      "displayKey": "status_name",
      "tab": "general",
      "order": 40
    }),

  field.lookup("source", "Source", "/api/administration/references/hr/lookup/recruitment-sources/", {
      "labelKey": "hr.candidates.fields.source",
      "displayKey": "source_name",
      "tab": "general",
      "order": 50
    }),

  field.date("applied_date", "Applied Date", {
      "labelKey": "hr.candidates.fields.applied_date",
      "required": true,
      "tab": "general",
      "order": 60
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.candidates.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.email("email", "Email", {
      "labelKey": "hr.candidates.fields.email",
      "default": "",
      "tab": "profile",
      "order": 110
    }),

  field.text("phone", "Phone", {
      "labelKey": "hr.candidates.fields.phone",
      "default": "",
      "tab": "profile",
      "order": 120
    }),

  field.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
      "labelKey": "hr.candidates.fields.gender",
      "displayKey": "gender_name",
      "tab": "profile",
      "order": 130
    }),

  field.date("birth_date", "Birth Date", {
      "labelKey": "hr.candidates.fields.birth_date",
      "tab": "profile",
      "order": 140
    }),

  field.lookup("education", "Education", "/api/administration/references/hr/lookup/educations/", {
      "labelKey": "hr.candidates.fields.education",
      "displayKey": "education_name",
      "tab": "profile",
      "order": 150
    }),

  field.file("resume_file", "Resume", {
      "labelKey": "hr.candidates.fields.resume_file",
      "multiple": false,
      "tab": "profile",
      "order": 160,
      "widget": "upload",
      "accept": ".pdf,.doc,.docx",
      "maxSizeMb": 10,
      "category": "attachment",
      "public": false,
      "preview": true,
      "download": true,
      "replace": true,
      "delete": true,
      "uploadEndpoint": "/api/uploads/",
      "uploadMode": "separate",
      "valueMode": "id",
      "detailField": "resume_file_detail"
    }),

  field.number("expected_salary", "Expected Salary", {
      "labelKey": "hr.candidates.fields.expected_salary",
      "tab": "offer",
      "order": 210
    }),

  field.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
      "labelKey": "hr.candidates.fields.currency",
      "displayKey": "currency_code",
      "tab": "offer",
      "order": 220
    }),

  field.lookup("rejection_reason", "Rejection Reason", "/api/administration/references/hr/lookup/rejection-reasons/", {
      "labelKey": "hr.candidates.fields.rejection_reason",
      "displayKey": "rejection_reason_name",
      "tab": "offer",
      "order": 230
    }),

  field.lookup("hired_employee", "Hired Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.candidates.fields.hired_employee",
      "displayKey": "hired_employee_name",
      "hint": "Diisi setelah kandidat diterima dan datanya dibuat jadi pegawai — supaya asal-usulnya tidak hilang.",
      "tab": "offer",
      "order": 240
    }),

  field.date("hired_date", "Hired Date", {
      "labelKey": "hr.candidates.fields.hired_date",
      "tab": "offer",
      "order": 250
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.candidates.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "offer",
      "order": 260
    }),
], {
  columns: 3,
})