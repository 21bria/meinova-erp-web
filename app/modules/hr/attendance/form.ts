import { createForm, field } from "@framework"

export const attendanceForm = createForm([
  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.attendance.fields.employee",
      "required": true,
      "autofill": {
        "company": "company",
        "branch": "branch",
        "location": "location"
      },
      "lookupParams": {
        "feature": "attendance"
      },
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.select("approval_status", "Approval Status", {
      "labelKey": "hr.attendance.fields.approval_status",
      "required": true,
      "default": "draft",
      "multiple": false,
      "tab": "approval",
      "order": 10,
      "options": [
        {
          "value": "draft",
          "label": "Draft"
        },
        {
          "value": "pending",
          "label": "Pending Approval"
        },
        {
          "value": "approved",
          "label": "Approved"
        },
        {
          "value": "rejected",
          "label": "Rejected"
        }
      ]
    }),

  field.datetime("scheduled_check_in", "Scheduled Check In", {
      "labelKey": "hr.attendance.fields.scheduled_check_in",
      "tab": "time",
      "order": 10
    }),

  field.number("check_in_latitude", "Check In Latitude", {
      "labelKey": "hr.attendance.fields.check_in_latitude",
      "tab": "location",
      "order": 10
    }),

  field.text("external_id", "External ID", {
      "labelKey": "hr.attendance.fields.external_id",
      "default": "",
      "tab": "system",
      "order": 10
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.attendance.fields.company",
      "required": true,
      "disabled": true,
      "displayKey": "company_name",
      "tab": "general",
      "order": 20
    }),

  field.datetime("scheduled_check_out", "Scheduled Check Out", {
      "labelKey": "hr.attendance.fields.scheduled_check_out",
      "tab": "time",
      "order": 20
    }),

  field.number("check_in_longitude", "Check In Longitude", {
      "labelKey": "hr.attendance.fields.check_in_longitude",
      "tab": "location",
      "order": 20
    }),

  field.text("device_code", "Device Code", {
      "labelKey": "hr.attendance.fields.device_code",
      "default": "",
      "tab": "system",
      "order": 20
    }),

  field.switch("is_manual_adjustment", "Manual Adjustment", {
      "labelKey": "hr.attendance.fields.is_manual_adjustment",
      "default": false,
      "tab": "approval",
      "order": 20
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.attendance.fields.branch",
      "disabled": true,
      "displayKey": "branch_name",
      "tab": "general",
      "order": 30
    }),

  field.datetime("check_in", "Check In", {
      "labelKey": "hr.attendance.fields.check_in",
      "tab": "time",
      "order": 30
    }),

  field.number("check_out_latitude", "Check Out Latitude", {
      "labelKey": "hr.attendance.fields.check_out_latitude",
      "tab": "location",
      "order": 30
    }),

  field.text("import_batch_id", "Import Batch ID", {
      "labelKey": "hr.attendance.fields.import_batch_id",
      "default": "",
      "tab": "system",
      "order": 30
    }),

  field.textarea("adjustment_reason", "Adjustment Reason", {
      "labelKey": "hr.attendance.fields.adjustment_reason",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "approval",
      "order": 30
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.attendance.fields.location",
      "disabled": true,
      "displayKey": "location_name",
      "tab": "general",
      "order": 40
    }),

  field.datetime("check_out", "Check Out", {
      "labelKey": "hr.attendance.fields.check_out",
      "tab": "time",
      "order": 40
    }),

  field.number("check_out_longitude", "Check Out Longitude", {
      "labelKey": "hr.attendance.fields.check_out_longitude",
      "tab": "location",
      "order": 40
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.attendance.fields.notes",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "system",
      "order": 40
    }),

  field.date("work_date", "Work Date", {
      "labelKey": "hr.attendance.fields.work_date",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.datetime("first_check_in", "First Check In", {
      "labelKey": "hr.attendance.fields.first_check_in",
      "tab": "time",
      "order": 50
    }),

  field.textarea("check_in_address", "Check In Address", {
      "labelKey": "hr.attendance.fields.check_in_address",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "location",
      "order": 50
    }),

  field.lookup("shift", "Shift", "/api/administration/references/hr/lookup/shifts/", {
      "labelKey": "hr.attendance.fields.shift",
      "displayKey": "shift_name",
      "tab": "general",
      "order": 60
    }),

  field.datetime("last_check_out", "Last Check Out", {
      "labelKey": "hr.attendance.fields.last_check_out",
      "tab": "time",
      "order": 60
    }),

  field.textarea("check_out_address", "Check Out Address", {
      "labelKey": "hr.attendance.fields.check_out_address",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "location",
      "order": 60
    }),

  field.select("status", "Attendance Status", {
      "labelKey": "hr.attendance.fields.status",
      "required": true,
      "displayKey": "status_label",
      "default": "present",
      "multiple": false,
      "tab": "general",
      "order": 70,
      "options": [
        {
          "label": "Present",
          "value": "present"
        },
        {
          "label": "Late",
          "value": "late"
        },
        {
          "label": "Absent",
          "value": "absent"
        },
        {
          "label": "Leave",
          "value": "leave"
        },
        {
          "label": "Sick",
          "value": "sick"
        },
        {
          "label": "Permit",
          "value": "permit"
        },
        {
          "label": "Business Trip",
          "value": "business_trip",
          "disabled": true
        },
        {
          "label": "Remote Work",
          "value": "remote"
        },
        {
          "label": "Holiday",
          "value": "holiday"
        },
        {
          "label": "Day Off",
          "value": "day_off"
        },
        {
          "label": "Incomplete",
          "value": "incomplete"
        }
      ]
    }),

  field.number("worked_minutes", "Worked Minutes", {
      "labelKey": "hr.attendance.fields.worked_minutes",
      "default": 0,
      "tab": "time",
      "order": 70
    }),

  field.switch("is_geofence_valid", "Geofence Valid", {
      "labelKey": "hr.attendance.fields.is_geofence_valid",
      "default": true,
      "tab": "location",
      "order": 70
    }),

  field.select("source", "Source", {
      "labelKey": "hr.attendance.fields.source",
      "required": true,
      "displayKey": "source_label",
      "default": "manual",
      "multiple": false,
      "tab": "general",
      "order": 80,
      "options": [
        {
          "label": "Manual",
          "value": "manual"
        },
        {
          "label": "Attendance Device",
          "value": "device"
        },
        {
          "label": "Mobile",
          "value": "mobile"
        },
        {
          "label": "Web",
          "value": "web"
        },
        {
          "label": "Import",
          "value": "import"
        },
        {
          "label": "API",
          "value": "api"
        },
        {
          "label": "System",
          "value": "system"
        }
      ]
    }),

  field.number("break_minutes", "Break Minutes", {
      "labelKey": "hr.attendance.fields.break_minutes",
      "default": 0,
      "tab": "time",
      "order": 80
    }),

  field.number("late_minutes", "Late Minutes", {
      "labelKey": "hr.attendance.fields.late_minutes",
      "default": 0,
      "tab": "time",
      "order": 90
    }),

  field.number("early_leave_minutes", "Early Leave Minutes", {
      "labelKey": "hr.attendance.fields.early_leave_minutes",
      "default": 0,
      "tab": "time",
      "order": 100
    }),

  field.text("leave_document_number", "Leave Document", {
      "labelKey": "hr.attendance.fields.leave_document_number",
      "readonly": true,
      "tab": "general"
    }),

  field.number("overtime_minutes", "Overtime Minutes", {
      "labelKey": "hr.attendance.fields.overtime_minutes",
      "default": 0,
      "tab": "time",
      "order": 110
    }),

  field.number("leave_required_days", "Leave Required (rule)", {
      "labelKey": "hr.attendance.fields.leave_required_days",
      "readonly": true,
      "hint": "Diisi sistem saat keterlambatan atau pulang cepatnya melewati ambang di Attendance Policy. Ini penanda — yang memotong saldo tetap dokumen cuti yang diajukan dan disetujui.",
      "default": 0,
      "tab": "time",
      "order": 120
    }),

  field.text("leave_required_reason", "Leave Required Reason", {
      "labelKey": "hr.attendance.fields.leave_required_reason",
      "readonly": true,
      "hint": "Sebabnya, supaya baris yang ditandai bisa dijelaskan tanpa membandingkan jam tap dengan jadwalnya satu per satu.",
      "default": "",
      "tab": "time",
      "order": 130
    }),

  field.number("leave_required_override", "Leave Required (override)", {
      "labelKey": "hr.attendance.fields.leave_required_override",
      "readonly": true,
      "hint": "Angka yang ditetapkan atasan/HR. Kosong = ikut aturan.",
      "tab": "time",
      "order": 131
    }),

  field.switch("leave_required_waived", "Waived", {
      "labelKey": "hr.attendance.fields.leave_required_waived",
      "readonly": true,
      "hint": "Dibebaskan — tidak perlu mengajukan cuti hari ini.",
      "default": false,
      "tab": "time",
      "order": 132
    }),

  field.textarea("leave_required_waiver_reason", "Waiver Reason", {
      "labelKey": "hr.attendance.fields.leave_required_waiver_reason",
      "readonly": true,
      "hint": "Wajib diisi saat membebaskan. Pembebasan tanpa alasan tertulis membuat aturan ini kehilangan wibawanya dalam tiga bulan.",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "time",
      "order": 133
    }),

  field.select("review_decision", "Review Decision", {
      "labelKey": "hr.attendance.fields.review_decision",
      "readonly": true,
      "displayKey": "review_decision_label",
      "hint": "Kosong = belum ditinjau atasan.",
      "default": "",
      "multiple": false,
      "tab": "time",
      "order": 134,
      "options": [
        {
          "label": "Valid exception",
          "value": "valid"
        },
        {
          "label": "Must submit leave",
          "value": "require_leave"
        }
      ]
    }),

  field.textarea("review_notes", "Review Notes", {
      "labelKey": "hr.attendance.fields.review_notes",
      "readonly": true,
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "time",
      "order": 135
    }),

  field.datetime("reviewed_at", "Reviewed At", {
      "labelKey": "hr.attendance.fields.reviewed_at",
      "readonly": true,
      "tab": "time",
      "order": 136
    }),

  field.select("permission_state", "Permission", {
      "labelKey": "hr.attendance.fields.permission_state",
      "readonly": true,
      "displayKey": "permission_state_label",
      "hint": "Kosong = tidak ada pengecualian yang perlu dijelaskan. Diisi dari dokumen Attendance Permission, bukan diketik.",
      "default": "",
      "multiple": false,
      "tab": "time",
      "order": 140,
      "options": [
        {
          "label": "Menunggu izin",
          "value": "pending"
        },
        {
          "label": "Permitted",
          "value": "excused"
        },
        {
          "label": "Partially permitted",
          "value": "partial"
        },
        {
          "label": "Unauthorised",
          "value": "unauthorized"
        }
      ]
    }),

  field.number("excused_late_minutes", "Excused Late (min)", {
      "labelKey": "hr.attendance.fields.excused_late_minutes",
      "readonly": true,
      "hint": "Bagian dari keterlambatan yang tertutup izin yang disetujui. Jam tap-nya tidak berubah.",
      "default": 0,
      "tab": "time",
      "order": 141
    }),

  field.number("excused_early_leave_minutes", "Excused Early Leave (min)", {
      "labelKey": "hr.attendance.fields.excused_early_leave_minutes",
      "readonly": true,
      "hint": "Bagian dari `early_leave_minutes` yang tertutup izin yang disetujui.",
      "default": 0,
      "tab": "time",
      "order": 142
    }),

  field.number("permission_minutes", "Temporary Out (min)", {
      "labelKey": "hr.attendance.fields.permission_minutes",
      "readonly": true,
      "hint": "Menit izin keluar sementara yang disetujui.",
      "default": 0,
      "tab": "time",
      "order": 143
    }),

  field.switch("is_excused_absence", "Excused Absence", {
      "labelKey": "hr.attendance.fields.is_excused_absence",
      "readonly": true,
      "hint": "Tidak masuk dengan izin yang disetujui — bukan mangkir. Dibayar atau tidak mengikuti Payroll Permission Rule.",
      "default": false,
      "tab": "time",
      "order": 144
    }),
], {
  columns: 3,
})