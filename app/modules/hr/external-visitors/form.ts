import { createForm, field } from "@framework"

export const externalVisitorsForm = createForm([
  field.text("visitor_number", "Visitor ID", {
      "labelKey": "hr.external-visitors.fields.visitor_number",
      "disabled": true,
      "readonly": true,
      "hint": "Terisi otomatis dari pola penomoran hr/external_visitor. Kosong berarti pola itu belum diseed — jalankan seed_administration --only=numbering.",
      "default": "",
      "tab": "identity",
      "order": 10
    }),

  field.text("full_name", "Full Name", {
      "labelKey": "hr.external-visitors.fields.full_name",
      "required": true,
      "tab": "identity",
      "order": 20
    }),

  field.select("identity_type", "Identity Type", {
      "labelKey": "hr.external-visitors.fields.identity_type",
      "required": true,
      "displayKey": "identity_type_label",
      "default": "ktp",
      "multiple": false,
      "tab": "identity",
      "order": 30,
      "options": [
        {
          "label": "KTP",
          "value": "ktp"
        },
        {
          "label": "Passport",
          "value": "passport"
        },
        {
          "label": "SIM",
          "value": "sim"
        },
        {
          "label": "KITAS / KITAP",
          "value": "kitas"
        },
        {
          "label": "Other",
          "value": "other"
        }
      ]
    }),

  field.text("identity_number", "Identity Number", {
      "labelKey": "hr.external-visitors.fields.identity_number",
      "hint": "Dipakai memeriksa tamu ganda. Boleh dikosongkan kalau identitasnya belum sempat dicatat, tapi tamu tanpa nomor identitas tidak bisa dipakai di Visitor Request.",
      "default": "",
      "tab": "identity",
      "order": 40
    }),

  field.lookup("gender", "Gender", "/api/administration/references/hr/lookup/genders/", {
      "labelKey": "hr.external-visitors.fields.gender",
      "displayKey": "gender_name",
      "tab": "identity",
      "order": 50
    }),

  field.date("date_of_birth", "Date of Birth", {
      "labelKey": "hr.external-visitors.fields.date_of_birth",
      "tab": "identity",
      "order": 60
    }),

  field.lookup("nationality", "Nationality", "/api/administration/references/hr/lookup/nationalities/", {
      "labelKey": "hr.external-visitors.fields.nationality",
      "displayKey": "nationality_name",
      "tab": "identity",
      "order": 70
    }),

  field.email("email", "Email", {
      "labelKey": "hr.external-visitors.fields.email",
      "default": "",
      "tab": "contact",
      "order": 110
    }),

  field.text("phone", "Phone", {
      "labelKey": "hr.external-visitors.fields.phone",
      "default": "",
      "tab": "contact",
      "order": 120
    }),

  field.text("mobile", "Mobile", {
      "labelKey": "hr.external-visitors.fields.mobile",
      "default": "",
      "tab": "contact",
      "order": 130
    }),

  field.text("organization_name", "Company / Institution", {
      "labelKey": "hr.external-visitors.fields.organization_name",
      "hint": "Perusahaan atau instansi asal tamu.",
      "default": "",
      "tab": "origin",
      "order": 210
    }),

  field.text("position", "Position", {
      "labelKey": "hr.external-visitors.fields.position",
      "default": "",
      "tab": "origin",
      "order": 220
    }),

  field.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "hr.external-visitors.fields.city",
      "displayKey": "city_name",
      "tab": "origin",
      "order": 230
    }),

  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "labelKey": "hr.external-visitors.fields.country",
      "displayKey": "country_name",
      "tab": "origin",
      "order": 240
    }),

  field.textarea("address", "Address", {
      "labelKey": "hr.external-visitors.fields.address",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "origin",
      "order": 250
    }),

  field.text("emergency_contact_name", "Emergency Contact", {
      "labelKey": "hr.external-visitors.fields.emergency_contact_name",
      "default": "",
      "tab": "additional",
      "order": 310
    }),

  field.text("emergency_contact_phone", "Emergency Phone", {
      "labelKey": "hr.external-visitors.fields.emergency_contact_phone",
      "default": "",
      "tab": "additional",
      "order": 320
    }),

  field.switch("is_active", "Active", {
      "labelKey": "hr.external-visitors.fields.is_active",
      "hint": "Dimatikan = tidak muncul lagi di pencarian tamu.",
      "default": true,
      "tab": "additional",
      "order": 330
    }),

  field.switch("is_blacklisted", "Blacklisted", {
      "labelKey": "hr.external-visitors.fields.is_blacklisted",
      "hint": "Tamu yang ditandai di sini ditolak saat dipakai di Visitor Request, dengan menyebut alasannya.",
      "default": false,
      "tab": "additional",
      "order": 340
    }),

  field.text("blacklist_reason", "Blacklist Reason", {
      "labelKey": "hr.external-visitors.fields.blacklist_reason",
      "visibleWhen": {
        "field": "is_blacklisted",
        "op": "is_true"
      },
      "default": "",
      "tab": "additional",
      "order": 350
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.external-visitors.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "additional",
      "order": 360
    }),

  field.number("visit_count", "Total Visits", {
      "labelKey": "hr.external-visitors.fields.visit_count",
      "disabled": true,
      "readonly": true,
      "hint": "Berapa kali tamu ini pernah diundang.",
      "tab": "additional",
      "order": 370
    }),
], {
  columns: 2,
})