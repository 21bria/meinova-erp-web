import type {
  BusinessTripsWorkspaceTab,
} from "./composables/useBusinessTripsWorkspace"

import type {
  BusinessTripsOverviewItem,
} from "./components/BusinessTripsOverview.vue"

export const businessTripsWorkspaceTabs: BusinessTripsWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.business-trips.tabs.general",
    "type": "form",
    "fields": [
      "document_number",
      "employee",
      "request_date",
      "status"
    ],
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 10
  },
  {
    "key": "trip",
    "label": "Trip Information",
    "labelKey": "hr.business-trips.tabs.trip",
    "type": "form",
    "fields": [
      "purpose_category",
      "purpose",
      "destination_type",
      "destination_location",
      "destination_city",
      "destination_country",
      "destination_detail",
      "origin_location",
      "departure_datetime",
      "return_datetime",
      "notes"
    ],
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 20
  },
  {
    "key": "assignment",
    "label": "Assignment",
    "labelKey": "hr.business-trips.fields.assignment",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "BusinessTripAssignment",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 30
  },
  {
    "key": "travel",
    "label": "Travel & Accommodation",
    "labelKey": "hr.business-trips.fields.travel",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "BusinessTripLegs",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 40
  },
  {
    "key": "attachments",
    "label": "Attachment",
    "labelKey": "hr.business-trips.tabs.attachments",
    "type": "form",
    "fields": [
      "attachment"
    ],
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 50
  },
  {
    "key": "approval",
    "label": "Approval / History",
    "labelKey": "hr.business-trips.fields.approval",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "BusinessTripApproval",
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 60
  }
]

export const businessTripsWorkspaceDefaultTab: string =
  "general"

export const businessTripsOverviewItems: BusinessTripsOverviewItem[] =
  [
  {
    key: "document_number",
    label: "Document No.",
    fallback: "-",
  },
  {
    key: "employee_name",
    label: "Employee",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "purpose_category_label",
    label: "Purpose",
    fallback: "-",
  },
  {
    key: "departure_datetime",
    label: "Departure",
    fallback: "-",
  },
  {
    key: "return_datetime",
    label: "Return",
    fallback: "-",
  },
  {
    key: "company_name",
    label: "Company",
    fallback: "-",
  },
  {
    key: "location_name",
    label: "Work Location",
    fallback: "-",
  },
  {
    key: "department_name",
    label: "Department",
    fallback: "-",
  },
  {
    key: "position_name",
    label: "Position",
    fallback: "-",
  },
  {
    key: "cost_center_name",
    label: "Cost Center",
    fallback: "-",
  },
  {
    key: "actual_departure_datetime",
    label: "Actual Departure",
    fallback: "-",
  },
  {
    key: "actual_return_datetime",
    label: "Actual Return",
    fallback: "-",
  },
  {
    key: "cancellation_reason",
    label: "Cancellation Reason",
    fallback: "-",
  }
]