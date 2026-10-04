import type { CrudFilters } from "./types"

export function createFilters(
  config: CrudFilters,
): CrudFilters {
  return {
    search: {
      enabled: config.search?.enabled ?? true,
      placeholder: config.search?.placeholder ?? "Search...",
      placeholderKey: config.search?.placeholderKey,
    },

    advanced: config.advanced ?? false,

    items: (config.items ?? []).filter(
      item => item.visible !== false,
    ),
  }
}