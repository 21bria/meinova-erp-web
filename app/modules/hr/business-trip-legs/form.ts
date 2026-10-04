import { createForm, field } from "@framework"

export const businessTripLegsForm = createForm([
  field.lookup("trip", "Business Trip", "/api/hr/business-trips/", {
      "labelKey": "hr.business-trip-legs.fields.trip",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.select("direction", "Direction", {
      "labelKey": "hr.business-trip-legs.fields.direction",
      "required": true,
      "displayKey": "direction_label",
      "default": "outbound",
      "multiple": false,
      "tab": "general",
      "order": 20,
      "options": [
        {
          "label": "Outbound",
          "value": "outbound"
        },
        {
          "label": "Return",
          "value": "return"
        },
        {
          "label": "Intermediate",
          "value": "intermediate"
        }
      ]
    }),

  field.number("sequence", "Sequence", {
      "labelKey": "hr.business-trip-legs.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 30
    }),

  field.date("travel_start_date", "Travel Date", {
      "labelKey": "hr.business-trip-legs.fields.travel_start_date",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.date("travel_end_date", "Arrival Date", {
      "labelKey": "hr.business-trip-legs.fields.travel_end_date",
      "tab": "general",
      "order": 50
    }),

  field.text("origin", "From", {
      "labelKey": "hr.business-trip-legs.fields.origin",
      "default": "",
      "tab": "general",
      "order": 60
    }),

  field.text("destination", "To", {
      "labelKey": "hr.business-trip-legs.fields.destination",
      "default": "",
      "tab": "general",
      "order": 70
    }),

  field.lookup("transport_mode", "Transport", "/api/administration/references/hr/lookup/transport-modes/", {
      "labelKey": "hr.business-trip-legs.fields.transport_mode",
      "displayKey": "transport_mode_name",
      "tab": "general",
      "order": 80
    }),

  field.text("transport_detail", "Transport Detail", {
      "labelKey": "hr.business-trip-legs.fields.transport_detail",
      "default": "",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.business-trip-legs.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("ticket_number", "Ticket No.", {
      "labelKey": "hr.business-trip-legs.fields.ticket_number",
      "default": "",
      "tab": "general",
      "order": 100
    }),

  field.switch("accommodation_needed", "Accommodation Needed", {
      "labelKey": "hr.business-trip-legs.fields.accommodation_needed",
      "default": false,
      "tab": "general",
      "order": 110
    }),

  field.lookup("accommodation_type", "Accommodation Type", "/api/administration/references/hr/lookup/accommodation-types/", {
      "labelKey": "hr.business-trip-legs.fields.accommodation_type",
      "displayKey": "accommodation_type_name",
      "visibleWhen": {
        "accommodation_needed": [
          true
        ]
      },
      "tab": "general",
      "order": 120
    }),

  field.text("accommodation_name", "Accommodation", {
      "labelKey": "hr.business-trip-legs.fields.accommodation_name",
      "visibleWhen": {
        "accommodation_needed": [
          true
        ]
      },
      "default": "",
      "tab": "general",
      "order": 130
    }),

  field.date("check_in_date", "Check-in", {
      "labelKey": "hr.business-trip-legs.fields.check_in_date",
      "visibleWhen": {
        "accommodation_needed": [
          true
        ]
      },
      "tab": "general",
      "order": 140
    }),

  field.date("check_out_date", "Check-out", {
      "labelKey": "hr.business-trip-legs.fields.check_out_date",
      "visibleWhen": {
        "accommodation_needed": [
          true
        ]
      },
      "tab": "general",
      "order": 150
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.business-trip-legs.fields.notes",
      "default": "",
      "layout": "full",
      "tab": "general",
      "order": 160
    }),
], {
  columns: 3,
})