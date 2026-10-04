import { createForm, field } from "@framework"

export const leaveForm = createForm([
  field.text("document_number", "Document No.", {
      "labelKey": "hr.leave.fields.document_number",
      "readonly": true,
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "hint": "Terisi otomatis dari deret LV saat cuti disimpan. Dipakai mencari dokumennya di layar Workflow.",
      "default": "",
      "tab": "general",
      "order": 5
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.leave.fields.employee",
      "required": true,
      "autofill": {
        "company": "company",
        "branch": "branch",
        "location": "location"
      },
      "displayKey": "employee_name",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "general",
      "order": 10
    }),

  field.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
      "labelKey": "hr.leave.fields.leave_type",
      "required": true,
      "displayKey": "leave_type_name",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("leave_reason", "Leave Reason", "/api/administration/references/hr/lookup/leave-reasons/", {
      "labelKey": "hr.leave.fields.leave_reason",
      "displayKey": "leave_reason_name",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.leave.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "hr.leave.fields.start_date",
      "required": true,
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "period",
      "order": 110
    }),

  field.date("end_date", "End Date", {
      "labelKey": "hr.leave.fields.end_date",
      "required": true,
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "period",
      "order": 120
    }),

  field.switch("is_half_day", "Half Day", {
      "labelKey": "hr.leave.fields.is_half_day",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "hint": "Hanya berlaku kalau Start Date dan End Date sama.",
      "default": false,
      "tab": "period",
      "order": 130
    }),

  field.number("total_days", "Total Days", {
      "labelKey": "hr.leave.fields.total_days",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "hint": "Dikosongkan = dihitung otomatis dari hari kerja pegawai. Akhir pekan dan hari libur tidak memotong saldo.",
      "tab": "period",
      "order": 140
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.leave.fields.company",
      "disabled": true,
      "displayKey": "company_name",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "hint": "Terisi otomatis dari penempatan pegawai.",
      "tab": "organization",
      "order": 210
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.leave.fields.branch",
      "disabled": true,
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "branch_name",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "organization",
      "order": 220
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.leave.fields.location",
      "disabled": true,
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "tab": "organization",
      "order": 230
    }),

  field.file("uploaded_file", "Attachment", {
      "labelKey": "hr.leave.fields.uploaded_file",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "hint": "Surat dokter atau dokumen pendukung lainnya.",
      "multiple": false,
      "tab": "document",
      "order": 310,
      "widget": "upload",
      "accept": ".pdf,.jpg,.jpeg,.png",
      "maxSizeMb": 5,
      "category": "attachment",
      "public": false,
      "preview": true,
      "download": true,
      "replace": true,
      "delete": true,
      "uploadEndpoint": "/api/uploads/",
      "uploadMode": "separate",
      "valueMode": "id",
      "detailField": "uploaded_file_detail"
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.leave.fields.notes",
      "readonlyWhen": {
        "field": "can_edit",
        "op": "is_false"
      },
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "document",
      "order": 320
    }),
], {
  columns: 3,
})