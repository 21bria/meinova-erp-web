import type {
  RecruitmentWorkspaceTab,
} from "./composables/useRecruitmentWorkspace"

import type {
  RecruitmentOverviewItem,
} from "./components/RecruitmentOverview.vue"

export const recruitmentWorkspaceTabs: RecruitmentWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.recruitment.tabs.general",
    "type": "form",
    "fields": [
      "code",
      "title",
      "status",
      "quota",
      "open_date",
      "close_date"
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
    "key": "organization",
    "label": "Organization",
    "labelKey": "hr.recruitment.tabs.organization",
    "type": "form",
    "fields": [
      "company",
      "branch",
      "location",
      "division",
      "department",
      "position",
      "employment_type"
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
    "key": "detail",
    "label": "Description",
    "labelKey": "hr.recruitment.tabs.detail",
    "type": "form",
    "fields": [
      "description",
      "requirements"
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
    "key": "candidates",
    "label": "Candidates",
    "labelKey": "hr.recruitment.fields.candidates",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": "/api/hr/candidates/",
    "module": "hr/candidates",
    "foreignKey": "vacancy",
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

export const recruitmentWorkspaceDefaultTab: string =
  "general"

export const recruitmentOverviewItems: RecruitmentOverviewItem[] =
  [
  {
    key: "code",
    label: "Code",
    fallback: "-",
  },
  {
    key: "title",
    label: "Title",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "open_date",
    label: "Open Date",
    fallback: "-",
  },
  {
    key: "candidate_count",
    label: "Candidates",
    fallback: "-",
  }
]