import type {
  MasterHubCategory,
  MasterHubItem,
} from '../types'

interface UseMasterHubOptions {
  items: Ref<MasterHubItem[]>
  categories: Ref<MasterHubCategory[]>
  initialCategory?: string
}

export function useMasterHub(options: UseMasterHubOptions) {
  const search = ref('')
  const activeCategory = ref(options.initialCategory || 'all')

  const normalizedSearch = computed(() => {
    return search.value.trim().toLowerCase()
  })

  const sortedCategories = computed(() => {
    return [...options.categories.value].sort((a, b) => {
      const orderA = a.order ?? 0
      const orderB = b.order ?? 0

      if (orderA !== orderB)
        return orderA - orderB

      return a.label.localeCompare(b.label)
    })
  })

  const sortedItems = computed(() => {
    return [...options.items.value].sort((a, b) => {
      const orderA = a.order ?? 0
      const orderB = b.order ?? 0

      if (orderA !== orderB)
        return orderA - orderB

      return a.title.localeCompare(b.title)
    })
  })

  const filteredItems = computed(() => {
    return sortedItems.value.filter((item) => {
      const matchesCategory
        = activeCategory.value === 'all'
          || item.category === activeCategory.value

      if (!matchesCategory)
        return false

      if (!normalizedSearch.value)
        return true

      const searchableValue = [
        item.title,
        item.description,
        item.category,
        ...(item.keywords ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableValue.includes(normalizedSearch.value)
    })
  })

  const resultCount = computed(() => filteredItems.value.length)

  const hasResults = computed(() => resultCount.value > 0)

  const hasFilters = computed(() => {
    return activeCategory.value !== 'all'
      || normalizedSearch.value.length > 0
  })

  function setCategory(category: string) {
    activeCategory.value = category
  }

  function resetFilters() {
    search.value = ''
    activeCategory.value = 'all'
  }

  return {
    search,
    activeCategory,

    sortedCategories,
    filteredItems,

    resultCount,
    hasResults,
    hasFilters,

    setCategory,
    resetFilters,
  }
}