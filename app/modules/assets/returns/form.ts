import { createForm, field } from "@framework"

export const returnsForm = createForm([
  field.lookup("asset", "Asset", "/api/assets/lookup/assets-in-use/", {
      "labelKey": "assets.returns.fields.asset",
      "required": true,
      "displayKey": "asset_code",
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "hint": "Hanya aset yang sedang dipegang pegawai atau unit dan tidak sedang dipesan dokumen lain. Pemegang diambil dari custody.",
      "tab": "general",
      "order": 30
    }),

  field.select("reason", "Reason", {
      "labelKey": "assets.returns.fields.reason",
      "required": true,
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "label": "End of use",
          "value": "END_OF_USE"
        },
        {
          "label": "Separation",
          "value": "SEPARATION"
        },
        {
          "label": "Replacement",
          "value": "REPLACEMENT"
        },
        {
          "label": "Damage",
          "value": "DAMAGE"
        },
        {
          "label": "Other",
          "value": "OTHER"
        }
      ]
    }),

  field.lookup("destination_location", "Storage Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "assets.returns.fields.destination_location",
      "required": true,
      "displayKey": "destination_location_name",
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "hint": "Penyimpanan tujuan milik company pemilik aset — boleh lokasi asal maupun lokasi lain company itu.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("destination_facility", "Storage Facility", "/api/administration/organization/lookup/facilities/", {
      "labelKey": "assets.returns.fields.destination_facility",
      "dependsOn": "destination_location",
      "lookupParams": {
        "location_id": "$destination_location"
      },
      "displayKey": "destination_facility_name",
      "readonlyWhen": {
        "status": [
          "SUBMITTED",
          "APPROVED",
          "COMPLETED",
          "REJECTED",
          "CANCELLED"
        ]
      },
      "tab": "general",
      "order": 60
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "assets.returns.fields.notes",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "is active", {
      "labelKey": "assets.returns.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 3,
})