import type {
  TrainingWorkspaceTab,
} from "./composables/useTrainingWorkspace"

import type {
  TrainingOverviewItem,
} from "./components/TrainingOverview.vue"

export const trainingWorkspaceTabs: TrainingWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "General",
    "labelKey": "hr.training.tabs.general",
    "type": "form",
    "fields": [
      "code",
      "name",
      "training_category",
      "provider",
      "company",
      "status",
      "is_mandatory"
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
    "key": "schedule",
    "label": "Schedule & Venue",
    "labelKey": "hr.training.tabs.schedule",
    "type": "form",
    "fields": [
      "start_date",
      "end_date",
      "duration_hours",
      "venue",
      "quota"
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
    "key": "cost",
    "label": "Cost & Description",
    "labelKey": "hr.training.tabs.cost",
    "type": "form",
    "fields": [
      "cost",
      "currency",
      "description"
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
    "key": "participants",
    "label": "Participants",
    "labelKey": "hr.training.fields.participants",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": "/api/hr/training-participants/",
    "module": "hr/training-participants",
    "foreignKey": "program",
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

export const trainingWorkspaceDefaultTab: string =
  "general"

export const trainingOverviewItems: TrainingOverviewItem[] =
  [
  {
    key: "code",
    label: "Code",
    fallback: "-",
  },
  {
    key: "name",
    label: "Program Name",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  },
  {
    key: "start_date",
    label: "Start Date",
    fallback: "-",
  },
  {
    key: "participant_count",
    label: "Participants",
    fallback: "-",
  }
]