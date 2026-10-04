import type {
  HelpArticlesWorkspaceTab,
} from "./composables/useHelpArticlesWorkspace"

import type {
  HelpArticlesOverviewItem,
} from "./components/HelpArticlesOverview.vue"

export const helpArticlesWorkspaceTabs: HelpArticlesWorkspaceTab[] =
  [
  {
    "key": "content",
    "label": "Content",
    "labelKey": "administration.help-articles.tabs.content",
    "type": "form",
    "fields": [
      "title",
      "category",
      "summary",
      "content",
      "video_url"
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
    "key": "publishing",
    "label": "Publishing",
    "labelKey": "administration.help-articles.tabs.publishing",
    "type": "form",
    "fields": [
      "status",
      "sort_order",
      "route_prefix",
      "role",
      "keywords",
      "icon",
      "slug",
      "code"
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
    "key": "stats",
    "label": "Statistics",
    "labelKey": "administration.help-articles.tabs.stats",
    "type": "form",
    "fields": [
      "view_count",
      "helpful_count",
      "not_helpful_count",
      "published_at"
    ],
    "modes": [
      "edit"
    ],
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
    "showOnCreate": false,
    "order": 30
  }
]

export const helpArticlesWorkspaceDefaultTab: string =
  "content"

export const helpArticlesOverviewItems: HelpArticlesOverviewItem[] =
  [
  {
    key: "title",
    label: "Title",
    fallback: "-",
  },
  {
    key: "category_name",
    label: "Category",
    fallback: "-",
  },
  {
    key: "status_label",
    label: "Status",
    fallback: "-",
  }
]