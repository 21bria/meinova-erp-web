import type {
  CandidatesWorkspaceTab,
} from "./composables/useCandidatesWorkspace"

import type {
  CandidatesOverviewItem,
} from "./components/CandidatesOverview.vue"

export const candidatesWorkspaceTabs: CandidatesWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.candidates.tabs.general",
    "type": "form",
    "fields": [
      "candidate_number",
      "full_name",
      "vacancy",
      "status",
      "source",
      "applied_date"
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
    "key": "profile",
    "label": "Profile",
    "labelKey": "hr.candidates.tabs.profile",
    "type": "form",
    "fields": [
      "email",
      "phone",
      "gender",
      "birth_date",
      "education",
      "resume_file"
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
    "key": "offer",
    "label": "Offer & Outcome",
    "labelKey": "hr.candidates.tabs.offer",
    "type": "form",
    "fields": [
      "expected_salary",
      "currency",
      "rejection_reason",
      "hired_employee",
      "hired_date",
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
    "order": 30
  },
  {
    "key": "interviews",
    "label": "Interviews",
    "labelKey": "hr.candidates.fields.interviews",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": "/api/hr/candidate-interviews/",
    "module": "hr/candidate-interviews",
    "foreignKey": "candidate",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "inline": false,
    "canCreate": true,
    "showOnCreate": true,
    "order": 40
  }
]

export const candidatesWorkspaceDefaultTab: string =
  "general"

export const candidatesOverviewItems: CandidatesOverviewItem[] =
  [
  {
    key: "candidate_number",
    label: "Candidate Number",
    fallback: "-",
  },
  {
    key: "full_name",
    label: "Full Name",
    fallback: "-",
  },
  {
    key: "status_name",
    label: "Status",
    fallback: "-",
  },
  {
    key: "applied_date",
    label: "Applied Date",
    fallback: "-",
  }
]