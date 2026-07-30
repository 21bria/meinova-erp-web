import type { CrudFilters } from "./types"

export function createFilters(
  config: CrudFilters,
): CrudFilters {
  return {
    search: {
      enabled: config.search?.enabled ?? true,
      placeholder: config.search?.placeholder ?? "Search...",
    },

    advanced: config.advanced ?? false,

    items: (config.items ?? []).filter(
      item => item.visible !== false,
    ),
  }
}