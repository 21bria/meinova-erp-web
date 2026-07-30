<script setup lang="ts">
import type {
  MasterHubCategory,
  MasterHubItem,
} from '../types'

import { useMasterHub } from '../composables/useMasterHub'

import MasterHubCard from './MasterHubCard.vue'
import MasterHubEmpty from './MasterHubEmpty.vue'
import MasterHubHeader from './MasterHubHeader.vue'
import MasterHubSearch from './MasterHubSearch.vue'
import MasterHubTabs from './MasterHubTabs.vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string

  items: MasterHubItem[]
  categories?: MasterHubCategory[]

  searchPlaceholder?: string
  allCategoryLabel?: string

  emptyTitle?: string
  emptyDescription?: string

  initialCategory?: string
}>(), {
  description: 'Browse and access all master data modules',
  categories: () => [],
  searchPlaceholder: 'Search master data',
  allCategoryLabel: 'All Masters',
  emptyTitle: 'No master data found',
  emptyDescription: 'Try another keyword or select a different category.',
  initialCategory: 'all',
})

const items = computed(() => props.items)
const categories = computed(() => props.categories)

const {
  search,
  activeCategory,
  sortedCategories,
  filteredItems,
  resultCount,
  hasResults,
  hasFilters,
  resetFilters,
} = useMasterHub({
  items,
  categories,
  initialCategory: props.initialCategory,
})
</script>

<template>
  <section class="space-y-5">
    <MasterHubHeader
      :title="title"
      :description="description"
    />

    <div class="overflow-hidden rounded-xl border border-border/60 bg-card">
     <div
        class="flex flex-col gap-4 border-b border-border/60 px-4 py-4
              md:flex-row md:items-center md:justify-between md:px-5"
      >
        <div class="min-w-0 flex-1 overflow-x-auto">
          <MasterHubTabs
            v-model="activeCategory"
            :categories="sortedCategories"
            :all-label="allCategoryLabel"
          />
        </div>

        <div class="shrink-0 md:w-80">
          <MasterHubSearch
            v-model="search"
            :placeholder="searchPlaceholder"
          />
        </div>
      </div>

      <div
        v-if="hasResults"
        class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2 xl:grid-cols-3 md:p-4"
      >
        <MasterHubCard
          v-for="item in filteredItems"
          :key="item.key"
          :item="item"
        />
      </div>

      <MasterHubEmpty
        v-else
        :title="emptyTitle"
        :description="emptyDescription"
        :can-reset="hasFilters"
        @reset="resetFilters"
      />

      <div
        v-if="hasResults"
        class="border-t border-border/60 px-5 py-3 text-xs text-muted-foreground"
      >
        Showing {{ resultCount }}
        {{ resultCount === 1 ? 'master module' : 'master modules' }}
      </div>
    </div>
  </section>
</template>