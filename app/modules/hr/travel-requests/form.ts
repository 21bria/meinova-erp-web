import { createForm, field } from "@framework"

export const travelRequestsForm = createForm([
  field.text("document_number", "TR No.", {
      "labelKey": "hr.travel-requests.fields.document_number",
      "disabled": true,
      "hint": "Terisi otomatis dari pola penomoran hr/travel_request. Kosong berarti pola itu belum diseed — jalankan seed_administration --only=numbering.",
      "default": "",
      "tab": "general",
      "order": 10
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.travel-requests.fields.employee",
      "required": true,
      "autofill": {
        "company": "company",
        "branch": "branch",
        "location": "location"
      },
      "lookupParams": {
        "feature": "field_break"
      },
      "displayKey": "employee_name",
      "tab": "general",
      "order": 20
    }),

  field.lookup("rotation_period", "Roster Block", "/api/hr/lookup/rotation-periods/", {
      "labelKey": "hr.travel-requests.fields.rotation_period",
      "autofill": {
        "start_date": "start_date",
        "end_date": "end_date"
      },
      "dependsOn": "employee",
      "lookupParams": {
        "employee_id": "$employee"
      },
      "displayKey": "rotation_period_label",
      "hint": "Blok Off pada jadwal roster yang diambil. Dikosongkan = pengajuan berdiri sendiri; tanggalnya diisi manual.",
      "tab": "general",
      "order": 30
    }),

  field.date("start_date", "Off Start", {
      "labelKey": "hr.travel-requests.fields.start_date",
      "required": true,
      "hint": "Terisi otomatis dari Blok Jadwal. Dirapatkan ulang ke baris Travel Purpose setelah disimpan.",
      "tab": "general",
      "order": 40
    }),

  field.date("end_date", "Off End", {
      "labelKey": "hr.travel-requests.fields.end_date",
      "required": true,
      "hint": "Terisi otomatis dari Blok Jadwal. Dirapatkan ulang ke baris Travel Purpose setelah disimpan.",
      "tab": "general",
      "order": 50
    }),

  field.number("total_days", "Total Days", {
      "labelKey": "hr.travel-requests.fields.total_days",
      "disabled": true,
      "readonly": true,
      "hint": "Dijumlahkan dari baris Travel Purpose.",
      "tab": "general",
      "order": 60
    }),

  field.select("status", "Status", {
      "labelKey": "hr.travel-requests.fields.status",
      "disabled": true,
      "readonly": true,
      "displayKey": "status_label",
      "hint": "Berpindah lewat tombol Submit/Approve/Reject, bukan diketik.",
      "default": "draft",
      "multiple": false,
      "tab": "general",
      "order": 70,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Pending Approval",
          "value": "submitted"
        },
        {
          "label": "Approved",
          "value": "approved"
        },
        {
          "label": "Rejected",
          "value": "rejected"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.travel-requests.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("employee_number", "Employee No.", {
      "labelKey": "hr.travel-requests.fields.employee_number",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 110
    }),

  field.text("department_name", "Department", {
      "labelKey": "hr.travel-requests.fields.department_name",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 120
    }),

  field.text("section_name", "Section", {
      "labelKey": "hr.travel-requests.fields.section_name",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 130
    }),

  field.text("position_name", "Job Title", {
      "labelKey": "hr.travel-requests.fields.position_name",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 140
    }),

  field.text("work_email", "Email Address", {
      "labelKey": "hr.travel-requests.fields.work_email",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 150
    }),

  field.text("phone_number", "Phone Number", {
      "labelKey": "hr.travel-requests.fields.phone_number",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 160
    }),

  field.date("join_date", "Date Of Hire", {
      "labelKey": "hr.travel-requests.fields.join_date",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 170
    }),

  field.text("location_name", "Site / Location", {
      "labelKey": "hr.travel-requests.fields.location_name",
      "disabled": true,
      "readonly": true,
      "tab": "employee",
      "order": 180
    }),

  field.text("point_of_hire_name", "Point Of Hire", {
      "labelKey": "hr.travel-requests.fields.point_of_hire_name",
      "disabled": true,
      "readonly": true,
      "hint": "Kota rekrut — tujuan tiket pulang. Diubah dari master Employee, bukan dari sini.",
      "tab": "employee",
      "order": 190
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.travel-requests.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "notes",
      "order": 210
    }),
], {
  columns: 3,
})