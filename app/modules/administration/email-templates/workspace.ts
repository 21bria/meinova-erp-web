import type {
  EmailTemplatesWorkspaceTab,
} from "./composables/useEmailTemplatesWorkspace"

import type {
  EmailTemplatesOverviewItem,
} from "./components/EmailTemplatesOverview.vue"

export const emailTemplatesWorkspaceTabs: EmailTemplatesWorkspaceTab[] =
  [
  {
    "key": "general",
    "label": "Scope",
    "labelKey": "administration.email-templates.tabs.general",
    "type": "form",
    "fields": [
      "event",
      "company",
      "name",
      "is_active"
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
    "key": "email",
    "label": "Email",
    "labelKey": "administration.email-templates.tabs.email",
    "type": "form",
    "fields": [
      "subject",
      "body"
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
    "key": "in_app",
    "label": "Bel",
    "labelKey": "administration.email-templates.tabs.in_app",
    "type": "form",
    "fields": [
      "in_app_title",
      "in_app_body"
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
  }
]

export const emailTemplatesWorkspaceDefaultTab: string =
  "general"

export const emailTemplatesOverviewItems: EmailTemplatesOverviewItem[] =
  [
  {
    key: "event_label",
    label: "Event",
    fallback: "-",
  }
]