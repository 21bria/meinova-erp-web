import { createForm, field } from "@framework"

export const emailTemplatesForm = createForm([
  field.select("event", "Event", {
      "labelKey": "administration.email-templates.fields.event",
      "required": true,
      "displayKey": "event_label",
      "hint": "Kejadian yang memicu surat ini. Daftarnya dari registry notifikasi — event yang tidak ada di sini belum punya pemicu di sistem.",
      "multiple": false,
      "tab": "general",
      "order": 10,
      "options": [
        {
          "label": "Attendance Exception",
          "value": "hr.attendance_exception"
        },
        {
          "label": "Asked to Submit Leave",
          "value": "hr.attendance_leave_required"
        },
        {
          "label": "Employee Birthday",
          "value": "hr.birthday"
        },
        {
          "label": "Contract Ending Soon",
          "value": "hr.contract_end"
        },
        {
          "label": "Leave Balance Expiring",
          "value": "hr.leave_balance_expiring"
        },
        {
          "label": "Probation Ending Soon",
          "value": "hr.probation_end"
        },
        {
          "label": "Departure Reminder",
          "value": "hr.travel_departure_reminder"
        },
        {
          "label": "Travel Request Issued",
          "value": "hr.travel_request_issued"
        },
        {
          "label": "Work Anniversary",
          "value": "hr.work_anniversary"
        },
        {
          "label": "Submission Approved",
          "value": "workflow.approved"
        },
        {
          "label": "Document Awaiting Your Approval",
          "value": "workflow.pending_approval"
        },
        {
          "label": "Submission Rejected",
          "value": "workflow.rejected"
        },
        {
          "label": "Submission Returned for Revision",
          "value": "workflow.returned"
        }
      ]
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.email-templates.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company. Baris yang menyebut company mengalahkan yang global.",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Note", {
      "labelKey": "administration.email-templates.fields.name",
      "hint": "Keterangan untuk pengelola, tidak ikut terkirim.",
      "default": "",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.email-templates.fields.is_active",
      "hint": "Dimatikan = event ini jatuh ke kalimat bawaan sistem, bukan berhenti terkirim.",
      "default": true,
      "tab": "general",
      "order": 40
    }),

  field.text("subject", "Subject", {
      "labelKey": "administration.email-templates.fields.subject",
      "required": true,
      "hint": "Judul email. Boleh memuat placeholder.",
      "layout": "full",
      "tab": "email",
      "order": 110
    }),

  field.textarea("body", "Body", {
      "labelKey": "administration.email-templates.fields.body",
      "required": true,
      "hint": "Isi surat sebagai teks biasa. Baris kosong jadi paragraf baru. Kop, tombol, dan kaki surat ditambahkan sistem — jangan menulis HTML di sini.",
      "rows": 14,
      "layout": "full",
      "tab": "email",
      "order": 120
    }),

  field.text("in_app_title", "Bell Title", {
      "labelKey": "administration.email-templates.fields.in_app_title",
      "hint": "Dikosongkan = memakai judul email. Diisi kalau judul emailnya terlalu panjang untuk daftar bel.",
      "default": "",
      "layout": "full",
      "tab": "in_app",
      "order": 210
    }),

  field.text("in_app_body", "Bell Subtitle", {
      "labelKey": "administration.email-templates.fields.in_app_body",
      "hint": "Keterangan satu baris di bawah judul bel.",
      "default": "",
      "layout": "full",
      "tab": "in_app",
      "order": 220
    }),
], {
  columns: 3,
})