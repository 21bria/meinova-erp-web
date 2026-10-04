import { createForm, field } from "@framework"

export const visitorRequestsForm = createForm([
  field.text("document_number", "Request No.", {
      "labelKey": "hr.visitor-requests.fields.document_number",
      "disabled": true,
      "readonly": true,
      "hint": "Terisi otomatis dari pola penomoran hr/visitor_request.",
      "modes": [
        "edit"
      ],
      "default": "",
      "tab": "general",
      "order": 10
    }),

  field.date("request_date", "Request Date", {
      "labelKey": "hr.visitor-requests.fields.request_date",
      "hint": "Dikosongkan = hari ini.",
      "tab": "general",
      "order": 20
    }),

  field.lookup("requester", "Requester", "/api/hr/employees/lookup/", {
      "labelKey": "hr.visitor-requests.fields.requester",
      "autofill": {
        "company": "company",
        "branch": "branch",
        "location": "location"
      },
      "displayKey": "requester_name",
      "hint": "Pegawai yang mengajukan. Dikosongkan = akun yang sedang login.",
      "tab": "general",
      "order": 30
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.visitor-requests.fields.company",
      "displayKey": "company_name",
      "readonlyWhen": {
        "field": "$me.data_scope.values.company",
        "op": "is_not_null"
      },
      "default": "$me.placement.company",
      "tab": "general",
      "order": 40
    }),

  field.lookup("location", "Visit Location / Site", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.visitor-requests.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "hint": "Lokasi/site yang dikunjungi.",
      "tab": "general",
      "order": 50
    }),

  field.select("status", "Status", {
      "labelKey": "hr.visitor-requests.fields.status",
      "disabled": true,
      "readonly": true,
      "displayKey": "status_label",
      "hint": "Berpindah lewat tombol Submit/Approve/Check-out, bukan diketik.",
      "modes": [
        "edit"
      ],
      "default": "draft",
      "multiple": false,
      "tab": "general",
      "order": 60,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Submitted",
          "value": "submitted"
        },
        {
          "label": "Under Review",
          "value": "under_review"
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
        },
        {
          "label": "Completed",
          "value": "completed"
        }
      ]
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.visitor-requests.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.select("visitor_type", "Visitor Type", {
      "labelKey": "hr.visitor-requests.fields.visitor_type",
      "required": true,
      "displayKey": "visitor_type_label",
      "hint": "Tamu dari luar perusahaan, datanya diambil dari Visitor Master. Pegawai yang berkunjung ke lokasi lain memakai Business Trip.",
      "default": "external",
      "multiple": false,
      "tab": "visitor",
      "order": 110,
      "options": [
        {
          "label": "External",
          "value": "external"
        }
      ]
    }),

  field.lookup("external_visitor", "Visitor", "/api/hr/lookup/external-visitors/", {
      "labelKey": "hr.visitor-requests.fields.external_visitor",
      "displayKey": "external_visitor_name",
      "visibleWhen": {
        "field": "visitor_type",
        "op": "eq",
        "value": "external"
      },
      "hint": "Cari tamu yang sudah terdaftar. Kalau belum ada, buat dulu di HR → Visitor Master.",
      "tab": "visitor",
      "order": 130
    }),

  field.text("visitor_name", "Visitor Name", {
      "labelKey": "hr.visitor-requests.fields.visitor_name",
      "disabled": true,
      "readonly": true,
      "tab": "visitor",
      "order": 140
    }),

  field.text("visitor_organization", "Company", {
      "labelKey": "hr.visitor-requests.fields.visitor_organization",
      "disabled": true,
      "readonly": true,
      "tab": "visitor",
      "order": 150
    }),

  field.text("visitor_identity", "Identity", {
      "labelKey": "hr.visitor-requests.fields.visitor_identity",
      "disabled": true,
      "readonly": true,
      "tab": "visitor",
      "order": 160
    }),

  field.text("visitor_contact", "Contact", {
      "labelKey": "hr.visitor-requests.fields.visitor_contact",
      "disabled": true,
      "readonly": true,
      "tab": "visitor",
      "order": 170
    }),

  field.number("number_of_visitors", "Number of Visitors", {
      "labelKey": "hr.visitor-requests.fields.number_of_visitors",
      "hint": "Termasuk tamu utama di atas.",
      "default": 1,
      "tab": "visitor",
      "order": 180
    }),

  field.lookup("visit_purpose", "Visit Purpose", "/api/administration/references/hr/lookup/visit-purposes/", {
      "labelKey": "hr.visitor-requests.fields.visit_purpose",
      "required": true,
      "displayKey": "visit_purpose_name",
      "tab": "visit",
      "order": 210
    }),

  field.lookup("visit_type", "Visit Type", "/api/administration/references/hr/lookup/visit-types/", {
      "labelKey": "hr.visitor-requests.fields.visit_type",
      "displayKey": "visit_type_name",
      "tab": "visit",
      "order": 220
    }),

  field.date("visit_start_date", "Visit Start Date", {
      "labelKey": "hr.visitor-requests.fields.visit_start_date",
      "required": true,
      "tab": "visit",
      "order": 230
    }),

  field.time("visit_start_time", "Visit Start Time", {
      "labelKey": "hr.visitor-requests.fields.visit_start_time",
      "tab": "visit",
      "order": 240
    }),

  field.date("visit_end_date", "Visit End Date", {
      "labelKey": "hr.visitor-requests.fields.visit_end_date",
      "required": true,
      "tab": "visit",
      "order": 250
    }),

  field.time("visit_end_time", "Visit End Time", {
      "labelKey": "hr.visitor-requests.fields.visit_end_time",
      "tab": "visit",
      "order": 260
    }),

  field.number("expected_duration_days", "Expected Duration (days)", {
      "labelKey": "hr.visitor-requests.fields.expected_duration_days",
      "disabled": true,
      "readonly": true,
      "tab": "visit",
      "order": 270
    }),

  field.textarea("remarks", "Remarks", {
      "labelKey": "hr.visitor-requests.fields.remarks",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "visit",
      "order": 280
    }),

  field.lookup("host_employee", "Host Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.visitor-requests.fields.host_employee",
      "required": true,
      "displayKey": "host_name",
      "hint": "Pegawai yang bertanggung jawab menerima tamu. Departemen dan jabatannya dibaca dari kartu pegawainya, tidak disalin ke dokumen ini.",
      "tab": "host",
      "order": 310
    }),

  field.text("host_department", "Host Department", {
      "labelKey": "hr.visitor-requests.fields.host_department",
      "disabled": true,
      "readonly": true,
      "tab": "host",
      "order": 320
    }),

  field.text("host_position", "Host Position", {
      "labelKey": "hr.visitor-requests.fields.host_position",
      "disabled": true,
      "readonly": true,
      "tab": "host",
      "order": 330
    }),

  field.text("host_contact", "Host Contact", {
      "labelKey": "hr.visitor-requests.fields.host_contact",
      "disabled": true,
      "readonly": true,
      "tab": "host",
      "order": 340
    }),

  field.text("requester_department", "Requester Department", {
      "labelKey": "hr.visitor-requests.fields.requester_department",
      "disabled": true,
      "readonly": true,
      "tab": "host",
      "order": 350
    }),

  field.switch("travel_required", "Travel Required", {
      "labelKey": "hr.visitor-requests.fields.travel_required",
      "hint": "Dimatikan = seluruh isian perjalanan disembunyikan. Yang sudah terisi tidak dihapus — menyalakannya lagi mengembalikan isinya.",
      "default": false,
      "tab": "travel",
      "order": 410
    }),

  field.text("travel_from", "Travel From", {
      "labelKey": "hr.visitor-requests.fields.travel_from",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "default": "",
      "tab": "travel",
      "order": 420
    }),

  field.text("travel_to", "Travel To", {
      "labelKey": "hr.visitor-requests.fields.travel_to",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "default": "",
      "tab": "travel",
      "order": 430
    }),

  field.date("departure_date", "Departure Date", {
      "labelKey": "hr.visitor-requests.fields.departure_date",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 440
    }),

  field.time("departure_time", "Departure Time", {
      "labelKey": "hr.visitor-requests.fields.departure_time",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 450
    }),

  field.date("return_date", "Return Date", {
      "labelKey": "hr.visitor-requests.fields.return_date",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 460
    }),

  field.time("return_time", "Return Time", {
      "labelKey": "hr.visitor-requests.fields.return_time",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 470
    }),

  field.lookup("transport_mode", "Transportation", "/api/administration/references/hr/lookup/transport-modes/", {
      "labelKey": "hr.visitor-requests.fields.transport_mode",
      "displayKey": "transport_mode_name",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 480
    }),

  field.switch("ticket_required", "Ticket Required", {
      "labelKey": "hr.visitor-requests.fields.ticket_required",
      "visibleWhen": {
        "field": "travel_required",
        "op": "is_true"
      },
      "default": false,
      "tab": "travel",
      "order": 490
    }),

  field.text("ticket_number", "Ticket Number", {
      "labelKey": "hr.visitor-requests.fields.ticket_number",
      "visibleWhen": {
        "all": [
          {
            "field": "travel_required",
            "op": "is_true"
          },
          {
            "field": "ticket_required",
            "op": "is_true"
          }
        ]
      },
      "default": "",
      "tab": "travel",
      "order": 500
    }),

  field.switch("accommodation_required", "Accommodation Required", {
      "labelKey": "hr.visitor-requests.fields.accommodation_required",
      "default": false,
      "tab": "travel",
      "order": 510
    }),

  field.lookup("accommodation_type", "Accommodation Type", "/api/administration/references/hr/lookup/accommodation-types/", {
      "labelKey": "hr.visitor-requests.fields.accommodation_type",
      "displayKey": "accommodation_type_name",
      "visibleWhen": {
        "field": "accommodation_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 520
    }),

  field.text("accommodation_name", "Hotel / Accommodation", {
      "labelKey": "hr.visitor-requests.fields.accommodation_name",
      "visibleWhen": {
        "field": "accommodation_required",
        "op": "is_true"
      },
      "hint": "Nama hotel/mess, mis. Hotel Bukit Pelangi.",
      "default": "",
      "tab": "travel",
      "order": 530
    }),

  field.date("accommodation_checkin", "Check-in Date", {
      "labelKey": "hr.visitor-requests.fields.accommodation_checkin",
      "visibleWhen": {
        "field": "accommodation_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 540
    }),

  field.date("accommodation_checkout", "Check-out Date", {
      "labelKey": "hr.visitor-requests.fields.accommodation_checkout",
      "visibleWhen": {
        "field": "accommodation_required",
        "op": "is_true"
      },
      "tab": "travel",
      "order": 550
    }),

  field.switch("pickup_required", "Airport / Station Pickup", {
      "labelKey": "hr.visitor-requests.fields.pickup_required",
      "default": false,
      "tab": "travel",
      "order": 610
    }),

  field.text("pickup_point", "Pickup Point", {
      "labelKey": "hr.visitor-requests.fields.pickup_point",
      "visibleWhen": {
        "field": "pickup_required",
        "op": "is_true"
      },
      "hint": "Bandara/pelabuhan tempat tamu dijemput.",
      "default": "",
      "tab": "travel",
      "order": 620
    }),

  field.text("dropoff_point", "Drop-off Point", {
      "labelKey": "hr.visitor-requests.fields.dropoff_point",
      "visibleWhen": {
        "field": "pickup_required",
        "op": "is_true"
      },
      "default": "",
      "tab": "travel",
      "order": 630
    }),

  field.switch("vehicle_required", "Vehicle Required", {
      "labelKey": "hr.visitor-requests.fields.vehicle_required",
      "default": false,
      "tab": "travel",
      "order": 640
    }),

  field.switch("driver_required", "Driver Required", {
      "labelKey": "hr.visitor-requests.fields.driver_required",
      "visibleWhen": {
        "field": "vehicle_required",
        "op": "is_true"
      },
      "default": false,
      "tab": "travel",
      "order": 650
    }),

  field.textarea("travel_remarks", "Travel Remarks", {
      "labelKey": "hr.visitor-requests.fields.travel_remarks",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "travel",
      "order": 660
    }),

  field.select("arrival_status", "Arrival Status", {
      "labelKey": "hr.visitor-requests.fields.arrival_status",
      "disabled": true,
      "readonly": true,
      "displayKey": "arrival_status_label",
      "hint": "Berpindah lewat tombol Check In / Check Out di layar ini atau di pos jaga.",
      "modes": [
        "edit"
      ],
      "default": "expected",
      "multiple": false,
      "tab": "arrival",
      "order": 710,
      "options": [
        {
          "label": "Expected",
          "value": "expected"
        },
        {
          "label": "Arrived",
          "value": "arrived"
        },
        {
          "label": "Checked In",
          "value": "checked_in"
        },
        {
          "label": "Checked Out",
          "value": "checked_out"
        },
        {
          "label": "No Show",
          "value": "no_show"
        }
      ]
    }),

  field.datetime("expected_arrival", "Expected Arrival", {
      "labelKey": "hr.visitor-requests.fields.expected_arrival",
      "tab": "arrival",
      "order": 720
    }),

  field.datetime("checked_in_at", "Check-in Time", {
      "labelKey": "hr.visitor-requests.fields.checked_in_at",
      "disabled": true,
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "arrival",
      "order": 730
    }),

  field.text("checked_in_by_name", "Check-in By", {
      "labelKey": "hr.visitor-requests.fields.checked_in_by_name",
      "disabled": true,
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "arrival",
      "order": 740
    }),

  field.text("check_in_gate", "Gate / Security Post", {
      "labelKey": "hr.visitor-requests.fields.check_in_gate",
      "disabled": true,
      "hint": "Pos jaga tempat tamu masuk.",
      "modes": [
        "edit"
      ],
      "default": "",
      "tab": "arrival",
      "order": 750
    }),

  field.textarea("check_in_remarks", "Check-in Remarks", {
      "labelKey": "hr.visitor-requests.fields.check_in_remarks",
      "disabled": true,
      "modes": [
        "edit"
      ],
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "arrival",
      "order": 760
    }),

  field.datetime("checked_out_at", "Check-out Time", {
      "labelKey": "hr.visitor-requests.fields.checked_out_at",
      "disabled": true,
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "arrival",
      "order": 770
    }),

  field.text("checked_out_by_name", "Check-out By", {
      "labelKey": "hr.visitor-requests.fields.checked_out_by_name",
      "disabled": true,
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "arrival",
      "order": 780
    }),

  field.textarea("check_out_remarks", "Check-out Remarks", {
      "labelKey": "hr.visitor-requests.fields.check_out_remarks",
      "disabled": true,
      "modes": [
        "edit"
      ],
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "arrival",
      "order": 790
    }),
], {
  columns: 3,
})