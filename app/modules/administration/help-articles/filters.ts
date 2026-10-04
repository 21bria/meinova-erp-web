import { createFilters, filter } from "@framework"

export const helpArticlesFilters = createFilters({
  search: {
    enabled: true,
    placeholder: "Search helpArticles...",
    placeholderKey: "administration.help-articles.placeholder.search",
  },

  advanced: true,

  items: [
  filter.lookup("category", "Category", "/api/helpcenter/lookup/help-categories/", {
    placement: "advanced",
    labelKey: "administration.help-articles.filters.category",
  }),
  filter.select("status", "Status", [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ], {
    placement: "quick",
    labelKey: "administration.help-articles.filters.status",
  }),
  filter.lookup("role", "Visible To Role", "/api/accounts/lookup/roles/", {
    placement: "advanced",
    labelKey: "administration.help-articles.filters.role",
  }),
  filter.select("is_active", "Is active", [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: "quick",
    labelKey: "administration.help-articles.filters.is_active",
  }),
  ],
})