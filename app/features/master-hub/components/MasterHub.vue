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

  itemNoun?: string
  itemNounPlural?: string
}>(), {
  description: 'Browse and access all master data modules',
  categories: () => [],
  searchPlaceholder: 'Search master data',
  allCategoryLabel: 'All Masters',
  emptyTitle: 'No master data found',
  emptyDescription: 'Try another keyword or select a different category.',
  initialCategory: 'all',
  itemNoun: 'master module',
  itemNounPlural: 'master modules',
})

/*
|--------------------------------------------------------------------------
| Hak akses
|--------------------------------------------------------------------------
|
| Kartu hub adalah **pintu kedua ke layar yang sama** dengan item
| sidebar, jadi ia wajib lewat penyaring yang sama — kalau tidak, menu
| yang sudah dicabut per role tetap punya jalan masuk lewat hub, dan
| kebocorannya tidak disertai satu pun pesan. Pelajaran yang sama dengan
| katalog aplikasi di beranda (`FavoriteAppService.allowed_codes`).
|
| Dua penyaring, dan keduanya memang berbeda urusan:
|   `isGranted` = wewenang tingkat layar yang dihitung kode
|   `isVisible` = centang per role di Menu Permissions
|
| Rute yang tidak dikenal dianggap **boleh** (lihat `useMenuAccess`), jadi
| kartu master — yang menautkan ke halaman di luar sidebar, sebagian
| dengan query string — tidak berubah perilakunya sama sekali.
|
| Ini **bukan** penjagaan: URL-nya tetap bisa diketik, dan yang menolak
| sungguhan tetap API tiap resource.
*/
const { isGranted, load: loadAccess } = useAccess()
const { isVisible, load: loadMenuAccess } = useMenuAccess()

onMounted(() => {
  loadAccess()
  loadMenuAccess()
})

const items = computed(() =>
  props.items.filter(
    item => isGranted(item.permission) && isVisible(item.link),
  ),
)

const categories = computed(() => {
  /*
   * Kategori yang seluruh kartunya tersaring ikut dibuang — tab yang
   * dibuka lalu kosong terbaca seperti halaman gagal memuat, bukan
   * seperti kategori yang memang bukan urusannya. Sejalan dengan
   * `AppSidebar` yang membuang grup tanpa item.
   */
  const used = new Set(items.value.map(item => item.category))

  return props.categories.filter(category => used.has(category.key))
})

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
        {{ resultCount === 1 ? itemNoun : itemNounPlural }}
      </div>
    </div>
  </section>
</template>