import { createForm, field } from "@framework"

export const notificationRulesForm = createForm([
  field.select("event", "Event", {
      "labelKey": "administration.notification-rules.fields.event",
      "required": true,
      "displayKey": "event_label",
      "hint": "Kode event dari registry notifikasi.",
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
      "labelKey": "administration.notification-rules.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company. Begitu ada satu baris bercompany untuk sebuah event, baris global tidak dipakai lagi untuk company itu.",
      "tab": "general",
      "order": 20
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.notification-rules.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 30
    }),

  field.number("sort_order", "Order", {
      "labelKey": "administration.notification-rules.fields.sort_order",
      "default": 0,
      "tab": "general",
      "order": 40
    }),

  field.select("recipient_type", "Recipient", {
      "labelKey": "administration.notification-rules.fields.recipient_type",
      "required": true,
      "displayKey": "recipient_type_label",
      "default": "subject",
      "multiple": false,
      "tab": "recipient",
      "order": 110,
      "options": [
        {
          "label": "Pegawai Bersangkutan",
          "value": "subject"
        },
        {
          "label": "Pengaju",
          "value": "submitter"
        },
        {
          "label": "Approver yang Sedang Ditagih",
          "value": "pending_approver"
        },
        {
          "label": "Penyiap Dokumen",
          "value": "preparer"
        },
        {
          "label": "Atasan Langsung",
          "value": "manager"
        },
        {
          "label": "Kepala Departemen",
          "value": "department_head"
        },
        {
          "label": "Pemegang Role",
          "value": "role"
        },
        {
          "label": "Pengguna Tertentu",
          "value": "user"
        }
      ]
    }),

  field.lookup("role", "Role", "/api/accounts/lookup/roles/", {
      "labelKey": "administration.notification-rules.fields.role",
      "displayKey": "role_name",
      "visibleWhen": {
        "field": "recipient_type",
        "op": "eq",
        "value": "role"
      },
      "hint": "Yang diterima tiap pemegang role tetap disaring cakupan datanya — admin site tidak menerima pemberitahuan pegawai kantor pusat.",
      "tab": "recipient",
      "order": 120
    }),

  field.lookup("user", "User", "/api/accounts/lookup/users/", {
      "labelKey": "administration.notification-rules.fields.user",
      "displayKey": "user_name",
      "visibleWhen": {
        "field": "recipient_type",
        "op": "eq",
        "value": "user"
      },
      "hint": "Wajib kalau penerimanya Pengguna Tertentu.",
      "tab": "recipient",
      "order": 130
    }),

  field.number("manager_level", "Manager Level", {
      "labelKey": "administration.notification-rules.fields.manager_level",
      "visibleWhen": {
        "field": "recipient_type",
        "op": "eq",
        "value": "manager"
      },
      "hint": "1 = atasan langsung, 2 = atasannya atasan.",
      "default": 1,
      "tab": "recipient",
      "order": 140
    }),

  field.switch("send_in_app", "Bell", {
      "labelKey": "administration.notification-rules.fields.send_in_app",
      "hint": "Tulis ke bel notifikasi dalam aplikasi.",
      "default": true,
      "tab": "channel",
      "order": 210
    }),

  field.switch("send_email", "Email", {
      "labelKey": "administration.notification-rules.fields.send_email",
      "hint": "Kirim email. Tetap tunduk pada setelan masing-masing penerima — yang mematikan email di profilnya tidak dipaksa menerimanya.",
      "default": true,
      "tab": "channel",
      "order": 220
    }),
], {
  columns: 2,
})