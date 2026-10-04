import { createForm, field } from "@framework"

export const businessTripsForm = createForm([
  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.business-trips.fields.employee",
      "lookupParams": {
        "feature": "business_trip"
      },
      "displayKey": "employee_name",
      "hint": "Kosongkan untuk mengajukan atas nama sendiri. Hanya pegawai yang Employee Group-nya memakai Business Trip.",
      "tab": "general",
      "order": 20
    }),

  field.date("request_date", "Request Date", {
      "labelKey": "hr.business-trips.fields.request_date",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.business-trips.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.select("purpose_category", "Purpose", {
      "labelKey": "hr.business-trips.fields.purpose_category",
      "required": true,
      "displayKey": "purpose_category_label",
      "multiple": false,
      "tab": "trip",
      "order": 110,
      "options": [
        {
          "label": "Official Duty",
          "value": "duty"
        },
        {
          "label": "Site Visit",
          "value": "site_visit"
        },
        {
          "label": "Meeting",
          "value": "meeting"
        },
        {
          "label": "Training",
          "value": "training"
        },
        {
          "label": "Audit / Inspection",
          "value": "audit"
        },
        {
          "label": "Other",
          "value": "other"
        }
      ]
    }),

  field.textarea("purpose", "Purpose Detail", {
      "labelKey": "hr.business-trips.fields.purpose",
      "required": true,
      "hint": "Uraian tugas yang dijalankan selama perjalanan.",
      "layout": "full",
      "tab": "trip",
      "order": 120
    }),

  field.select("destination_type", "Destination Type", {
      "labelKey": "hr.business-trips.fields.destination_type",
      "required": true,
      "displayKey": "destination_type_label",
      "multiple": false,
      "tab": "trip",
      "order": 130,
      "options": [
        {
          "label": "Company Location",
          "value": "internal_location"
        },
        {
          "label": "External — Domestic",
          "value": "external_domestic"
        },
        {
          "label": "External — International",
          "value": "external_international"
        }
      ]
    }),

  field.lookup("destination_location", "Destination Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.business-trips.fields.destination_location",
      "displayKey": "destination_location_name",
      "visibleWhen": {
        "destination_type": [
          "internal_location"
        ]
      },
      "tab": "trip",
      "order": 140
    }),

  field.lookup("destination_city", "Destination City", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "hr.business-trips.fields.destination_city",
      "displayKey": "destination_city_name",
      "visibleWhen": {
        "destination_type": [
          "external_domestic",
          "external_international"
        ]
      },
      "tab": "trip",
      "order": 150
    }),

  field.lookup("destination_country", "Destination Country", "/api/administration/references/geography/lookup/countries/", {
      "labelKey": "hr.business-trips.fields.destination_country",
      "displayKey": "destination_country_name",
      "visibleWhen": {
        "destination_type": [
          "external_domestic",
          "external_international"
        ]
      },
      "tab": "trip",
      "order": 160
    }),

  field.text("destination_detail", "Destination Detail", {
      "labelKey": "hr.business-trips.fields.destination_detail",
      "hint": "Tempat, pelanggan, atau alamat tujuan.",
      "default": "",
      "tab": "trip",
      "order": 170
    }),

  field.lookup("origin_location", "Origin", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.business-trips.fields.origin_location",
      "displayKey": "origin_location_name",
      "hint": "Bawaannya lokasi kerja pegawai.",
      "tab": "trip",
      "order": 180
    }),

  field.datetime("departure_datetime", "Departure", {
      "labelKey": "hr.business-trips.fields.departure_datetime",
      "required": true,
      "tab": "trip",
      "order": 190
    }),

  field.datetime("return_datetime", "Return", {
      "labelKey": "hr.business-trips.fields.return_datetime",
      "required": true,
      "tab": "trip",
      "order": 200
    }),

  field.lookup("supersedes", "Replaces / Extends", "/api/hr/business-trips/", {
      "labelKey": "hr.business-trips.fields.supersedes",
      "displayKey": "supersedes_number",
      "hint": "Isi hanya untuk dokumen pengganti (dokumen lama sudah dibatalkan) atau perpanjangan.",
      "tab": "trip",
      "order": 210
    }),

  field.select("supersede_type", "Link Type", {
      "labelKey": "hr.business-trips.fields.supersede_type",
      "displayKey": "supersede_type_label",
      "default": "",
      "multiple": false,
      "tab": "trip",
      "order": 220,
      "options": [
        {
          "label": "Replacement",
          "value": "replacement"
        },
        {
          "label": "Extension",
          "value": "extension"
        }
      ]
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.business-trips.fields.notes",
      "default": "",
      "layout": "full",
      "tab": "trip",
      "order": 230
    }),

  field.file("attachment", "Attachment", {
      "labelKey": "hr.business-trips.fields.attachment",
      "multiple": false,
      "tab": "attachments",
      "order": 600,
      "widget": "upload",
      "category": "attachment",
      "public": false,
      "preview": true,
      "download": true,
      "replace": true,
      "delete": true,
      "uploadEndpoint": "/api/uploads/",
      "uploadMode": "separate",
      "valueMode": "id",
      "detailField": "attachment_detail"
    }),
], {
  columns: 3,
})