import { createForm, field } from "@framework"

export const attendancePermissionsForm = createForm([
  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.attendance-permissions.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 20
    }),

  field.select("permission_type", "Permission Type", {
      "labelKey": "hr.attendance-permissions.fields.permission_type",
      "required": true,
      "displayKey": "permission_type_label",
      "hint": "Menentukan kolom jam mana yang diisi. Izin kehadiran bukan cuti — saldo cuti tidak berkurang karenanya.",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Late Arrival",
          "value": "late_arrival"
        },
        {
          "label": "Early Leave",
          "value": "early_leave"
        },
        {
          "label": "Temporary Out",
          "value": "temporary_out"
        },
        {
          "label": "Full Day Permission",
          "value": "full_day"
        }
      ]
    }),

  field.date("date", "Date", {
      "labelKey": "hr.attendance-permissions.fields.date",
      "required": true,
      "hint": "Tanggal shift-nya. Shift malam yang izinnya lewat tengah malam tetap memakai tanggal shift dimulai.",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.attendance-permissions.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.time("start_time", "Start Time", {
      "labelKey": "hr.attendance-permissions.fields.start_time",
      "visibleWhen": {
        "field": "permission_type",
        "op": "in",
        "value": [
          "early_leave",
          "temporary_out"
        ]
      },
      "hint": "Early Leave: boleh pulang mulai jam ini. Temporary Out: jam keluar.",
      "tab": "time",
      "order": 110
    }),

  field.time("end_time", "End Time", {
      "labelKey": "hr.attendance-permissions.fields.end_time",
      "visibleWhen": {
        "field": "permission_type",
        "op": "in",
        "value": [
          "late_arrival",
          "temporary_out"
        ]
      },
      "hint": "Late Arrival: boleh datang paling lambat jam ini — keterlambatan sampai batas ini jadi Excused Late, selebihnya tetap tanpa izin. Temporary Out: jam kembali; lebih kecil dari jam keluar dianggap lewat tengah malam.",
      "tab": "time",
      "order": 120
    }),

  field.textarea("reason", "Reason", {
      "labelKey": "hr.attendance-permissions.fields.reason",
      "required": true,
      "rows": 3,
      "layout": "full",
      "tab": "reason",
      "order": 210
    }),

  field.file("supporting_document", "Attachment", {
      "labelKey": "hr.attendance-permissions.fields.supporting_document",
      "hint": "Surat, undangan, atau dokumen pendukung lainnya.",
      "multiple": false,
      "tab": "reason",
      "order": 220,
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
      "detailField": "supporting_document_detail"
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.attendance-permissions.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "reason",
      "order": 230
    }),

  field.switch("allow_outside_shift", "Allow Outside Shift (HR Override)", {
      "labelKey": "hr.attendance-permissions.fields.allow_outside_shift",
      "hint": "Bawaannya izin harus jatuh di dalam jam kerja pegawai. Nyalakan hanya kalau jadwalnya memang belum tersusun atau baru berubah setelah izinnya diajukan.",
      "default": false,
      "tab": "override",
      "order": 310
    }),

  field.textarea("outside_shift_reason", "Override Reason", {
      "labelKey": "hr.attendance-permissions.fields.outside_shift_reason",
      "visibleWhen": {
        "not": {
          "field": "allow_outside_shift",
          "op": "is_false"
        }
      },
      "hint": "Wajib diisi saat override dinyalakan.",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "override",
      "order": 320
    }),
], {
  columns: 3,
})