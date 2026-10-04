import { createForm, field } from "@framework"

export const notificationLogsForm = createForm([
  field.select("event", "Event", {
      "labelKey": "administration.notification-logs.fields.event",
      "required": true,
      "displayKey": "event_label",
      "multiple": false,
      "tab": "general",
      "order": 20,
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

  field.text("recipient_name", "Recipient", {
      "labelKey": "administration.notification-logs.fields.recipient_name",
      "default": "",
      "tab": "general",
      "order": 30
    }),

  field.text("recipient_email", "Email", {
      "labelKey": "administration.notification-logs.fields.recipient_email",
      "default": "",
      "tab": "general",
      "order": 40
    }),

  field.select("channel", "Channel", {
      "labelKey": "administration.notification-logs.fields.channel",
      "required": true,
      "displayKey": "channel_label",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "In-App",
          "value": "in_app"
        },
        {
          "label": "Email",
          "value": "email"
        },
        {
          "label": "Push",
          "value": "push"
        },
        {
          "label": "SMS",
          "value": "sms"
        }
      ]
    }),

  field.select("status", "Status", {
      "labelKey": "administration.notification-logs.fields.status",
      "displayKey": "status_label",
      "default": "pending",
      "multiple": false,
      "tab": "general",
      "order": 60,
      "options": [
        {
          "label": "Menunggu",
          "value": "pending"
        },
        {
          "label": "Terkirim",
          "value": "sent"
        },
        {
          "label": "Gagal",
          "value": "failed"
        },
        {
          "label": "Dilewati",
          "value": "skipped"
        }
      ]
    }),

  field.text("subject", "Subject", {
      "labelKey": "administration.notification-logs.fields.subject",
      "default": "",
      "tab": "general",
      "order": 70
    }),

  field.textarea("detail", "Detail", {
      "labelKey": "administration.notification-logs.fields.detail",
      "hint": "Alasan dilewati, atau pesan kegagalannya.",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 80
    }),

  field.textarea("body", "Body", {
      "labelKey": "administration.notification-logs.fields.body",
      "hint": "Isi yang benar-benar terkirim ke orang ini.",
      "default": "",
      "rows": 10,
      "layout": "full",
      "tab": "general",
      "order": 90
    }),

  field.text("action_url", "Action url", {
      "labelKey": "administration.notification-logs.fields.action_url",
      "default": "",
      "tab": "general"
    }),

  field.text("module", "Module", {
      "labelKey": "administration.notification-logs.fields.module",
      "default": "",
      "tab": "general"
    }),

  field.text("object_type", "Object type", {
      "labelKey": "administration.notification-logs.fields.object_type",
      "default": "",
      "tab": "general"
    }),

  field.text("object_id", "Object id", {
      "labelKey": "administration.notification-logs.fields.object_id",
      "default": "",
      "tab": "general"
    }),

  field.text("dedup_key", "Dedup key", {
      "labelKey": "administration.notification-logs.fields.dedup_key",
      "default": "",
      "tab": "general"
    }),

  field.number("attempts", "Attempts", {
      "labelKey": "administration.notification-logs.fields.attempts",
      "default": 0,
      "tab": "general",
      "order": 100
    }),

  field.datetime("sent_at", "Sent at", {
      "labelKey": "administration.notification-logs.fields.sent_at",
      "tab": "general"
    }),
], {
  columns: 2,
})