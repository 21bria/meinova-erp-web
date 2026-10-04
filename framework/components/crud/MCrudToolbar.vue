<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { resourceLabel } from "../../core/utils/i18n"
import { Download, FileDown, Filter, MoreHorizontal, Plus, RefreshCw, Trash2, Upload, X } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useI18n } from "vue-i18n"

import { actionIcon } from "../../core/utils/actionIcons"

import MCrudFilters from "./MCrudFilters.vue"
import { resolveFilterDefaults } from "../../core/utils/dateRange"
import type { CollectionAction, CrudFilters } from "@framework"

const props = withDefaults(defineProps<{
  search?: string
  filtersSchema?: CrudFilters
  loading?: boolean
  showAdd?: boolean
  showImport?: boolean
  showExport?: boolean
  showBulkDelete?: boolean
  showRefresh?: boolean
  showTemplate?: boolean
  templateLabel?: string
  disableAdd?: boolean
  disableImport?: boolean
  disableExport?: boolean
  disableBulkDelete?: boolean
  disableRefresh?: boolean
  disableTemplate?: boolean
  drawerWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"

  /*
  | Aksi massal yang dideklarasikan schema (Post All dan sejenisnya).
  |
  | Ditaruh di dropdown "Actions" yang sama dengan Import/Export/Delete
  | Selected — bukan sebagai deret tombol tersendiri di sebelahnya.
  | Seluruh aksi tingkat koleksi di layar ini sudah duduk di sana, dan
  | memecahnya jadi dua tempat membuat yang mencarinya harus memeriksa
  | keduanya.
  */
  collectionActions?: CollectionAction[]
  selectedCount?: number
  runningAction?: string | null
}>(), {
  search: "",
  loading: false,
  showAdd: true,
  showImport: false,
  showExport: false,
  showBulkDelete: false,
  showRefresh: false,
  showTemplate: false,
  /*
   * Kosong, bukan teks Inggrisnya. Default `withDefaults` dievaluasi
   * sekali saat modul dimuat, jadi teks di sini tidak akan pernah ikut
   * berganti bahasa; fallback-nya dipindah ke template.
   */
  templateLabel: "",
  disableAdd: false,
  disableImport: false,
  disableExport: false,
  disableBulkDelete: false,
  disableRefresh: false,
  disableTemplate: false,
  drawerWidth: "md",
  collectionActions: () => [],
  selectedCount: 0,
  runningAction: null
})

const emit = defineEmits<{
  (e: "update:search", value: string): void
  (e: "apply", value: { search: string; filters: Record<string, any> }): void
  (e: "reset"): void
  (e: "add"): void
  (e: "import"): void
  (e: "export"): void
  (e: "bulk-delete"): void
  (e: "refresh"): void
  (e: "template"): void
  (e: "collection-action", key: string): void
}>()

/*
| `selection: "required"` berarti tombolnya mati selama belum ada baris
| yang dicentang — bukan tampil lalu dibalas 400. `optional` selalu
| hidup: tanpa centangan ia berarti "seluruh baris yang sedang
| terlihat", dan itu justru pemakaian yang paling lazim untuk batch
| migrasi berisi ratusan baris di tabel berhalaman.
*/
function actionDisabled(action: CollectionAction) {
  if (props.loading || props.runningAction)
    return true

  return action.selection === "required" && !props.selectedCount
}

const drawerWidthClass = computed(() => ({
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
}[props.drawerWidth ?? "md"]))

const i18n = useI18n()

const drawerOpen = ref(false)

/*
| Nilai penyaring dimulai dari **bawaan skema**, bukan dari `{}`.
|
| `applyFilters`/`submitSearch` mengirim isi variabel ini apa adanya ke
| `useCrud`, jadi kunci yang tidak ada di sini hilang dari permintaan.
| Untuk penyaring biasa itu benar — tidak dipilih berarti tidak disaring.
| Untuk rentang tanggal pada daftar transaksional itu justru kebalikan
| dari yang dimaksud: tanpa periode, daftarnya membuka seluruh sejarah.
|
| Gejalanya dulu paling mudah lolos lewat jalur pencarian: layar
| menampilkan "1 Sep — 16 Sep", orang mengetik nama lalu menekan Enter,
| dan permintaannya berangkat tanpa periode sementara tombol rentangnya
| tetap berbunyi sama.
|
| Helper yang sama dipakai `useCrud` untuk permintaan pertamanya.
*/
const filterValues = ref<Record<string, any>>(
  resolveFilterDefaults(props.filtersSchema?.items),
)

watch(
  () => props.filtersSchema?.items,
  (items) => {
    filterValues.value = {
      ...resolveFilterDefaults(items),
      ...filterValues.value,
    }
  },
)

const searchEnabled = computed(() => props.filtersSchema?.search?.enabled ?? true)
/*
 * Placeholder pencarian: schema menang, lalu terjemahan.
 *
 * Schema **tidak** ditimpa — teks seperti "Search by employee number"
 * datang dari backend dan itu memang lebih berguna daripada "Cari...".
 * Yang diterjemahkan hanya keadaan tanpa schema.
 */
const searchPlaceholder = computed(() => {
  const search = props.filtersSchema?.search

  if (search?.placeholderKey) {
    return resourceLabel(
      search.placeholderKey,
      search.placeholder ?? i18n.t("common.actions.searchPlaceholder"),
    )
  }

  return search?.placeholder ?? i18n.t("common.actions.searchPlaceholder")
})
const items = computed(() => props.filtersSchema?.items ?? [])

const quickFilters = computed(() => items.value.filter(item => item.placement === "quick"))
const advancedFilters = computed(() => items.value.filter(item => item.placement !== "quick"))
const hasAdvanced = computed(() => props.filtersSchema?.advanced === true && advancedFilters.value.length > 0)

const localSearch = ref(props.search ?? "")

watch(
  () => props.search,
  (value) => {
    if (value !== localSearch.value) {
      localSearch.value = value ?? ""
    }
  },
)

let searchTimer: ReturnType<typeof setTimeout> | null = null
function updateSearch(value: string) {
  localSearch.value = value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    emit("update:search", value)
  }, 700)
}

function submitSearch() {
  if (searchTimer) clearTimeout(searchTimer)

  emit("update:search", localSearch.value)
  emit("apply", {
    search: localSearch.value,
    filters: { ...filterValues.value },
  })
}

function apply() {
  emit("apply", {
    search: localSearch.value,
    filters: { ...filterValues.value },
  })
}

function applyFilters(filters: Record<string, any>) {
  filterValues.value = { ...filters }
  emit("apply", {
    search: localSearch.value,
    filters: { ...filters },
  })

  drawerOpen.value = false
}

function resetFilters() {
  // Ke bawaan, bukan ke kosong — `useCrud.onReset()` menurunkannya dari
  // helper yang sama, jadi layar dan permintaan tetap menyebut periode
  // yang sama sesudah Reset.
  filterValues.value = resolveFilterDefaults(props.filtersSchema?.items)
  localSearch.value = ""

  emit("update:search", "")
  emit("reset")
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-wrap items-center gap-2">
      <Input
        v-if="searchEnabled"
        class="h-9 w-[260px]"
        :model-value="localSearch"
        :placeholder="searchPlaceholder"
        @update:model-value="(v) => updateSearch(String(v ?? ''))"
        @keyup.enter="submitSearch"
      />

      <MCrudFilters
        v-if="quickFilters.length"
        v-model="filterValues"
        :schema="quickFilters"
        variant="inline"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <Button
        v-if="hasAdvanced"
        type="button"
        variant="outline"
        class="h-9"
        :disabled="loading"
        @click="drawerOpen = true"
      >
        <Filter class="mr-2 size-4" />
        {{ $t('common.actions.advancedFilter') }}
      </Button>

      <Button
        type="button"
        variant="ghost"
        class="h-9"
        :disabled="loading"
        @click="resetFilters"
      >
        {{ $t('common.actions.reset') }}
      </Button>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button type="button" class="h-9" :disabled="loading">
          <MoreHorizontal class="mr-2 size-4" />
          {{ $t('common.actions.actions') }}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuItem v-if="showAdd" :disabled="disableAdd || loading" @select="emit('add')">
          <Plus class="mr-2 size-4" />
          {{ $t('common.actions.create') }}
        </DropdownMenuItem>

        <DropdownMenuItem v-if="showRefresh" :disabled="disableRefresh || loading" @select="emit('refresh')">
          <RefreshCw class="mr-2 size-4" />
          {{ $t('common.actions.refresh') }}
        </DropdownMenuItem>

        <DropdownMenuSeparator v-if="showAdd || showRefresh" />

        <DropdownMenuItem v-if="showImport" :disabled="disableImport || loading" @select="emit('import')">
          <Upload class="mr-2 size-4" />
          {{ $t('common.actions.import') }}
        </DropdownMenuItem>

        <DropdownMenuItem v-if="showTemplate" :disabled="disableTemplate || loading" @select="emit('template')">
          <FileDown class="mr-2 size-4" />
          {{ templateLabel || $t('common.actions.downloadTemplate') }}
        </DropdownMenuItem>

        <DropdownMenuItem v-if="showExport" :disabled="disableExport || loading" @select="emit('export')">
          <Download class="mr-2 size-4" />
          {{ $t('common.actions.export') }}
        </DropdownMenuItem>

        <DropdownMenuSeparator v-if="showBulkDelete && (showImport || showExport || showTemplate)" />

        <DropdownMenuItem
          v-if="showBulkDelete"
          class="text-destructive focus:text-destructive"
          :disabled="disableBulkDelete || loading"
          @select="emit('bulk-delete')"
        >
          <Trash2 class="mr-2 size-4" />
          {{ $t('common.actions.deleteSelected') }}
        </DropdownMenuItem>

        <DropdownMenuSeparator v-if="collectionActions.length" />

        <DropdownMenuItem
          v-for="item in collectionActions"
          :key="item.key"
          :disabled="actionDisabled(item)"
          @select="emit('collection-action', item.key)"
        >
          <component :is="actionIcon(item.icon)" class="mr-2 size-4" />
          {{ item.label }}
          <span
            v-if="selectedCount && item.selection !== 'none'"
            class="ml-auto text-xs text-muted-foreground"
          >
            {{ selectedCount }}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <Teleport to="body">

  <div
    v-if="drawerOpen"
    class="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
    @click.self="drawerOpen = false"
  >
    <aside
      class="ml-auto flex h-full w-full flex-col border-l bg-background shadow-xl" :class="drawerWidthClass" >
        <div class="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 class="text-base font-semibold">
              {{ $t('common.actions.advancedFilter') }}
            </h2>
            <p class="text-sm text-muted-foreground">
              {{ $t('common.actions.advancedFilterHint') }}
            </p>
          </div>

          <Button variant="ghost" size="icon" @click="drawerOpen = false">
            <X class="size-4" />
          </Button>
        </div>

        <div class="flex-1 overflow-y-auto p-5">
          <MCrudFilters
            v-model="filterValues"
            :schema="advancedFilters"
            variant="panel"
            @apply="applyFilters"
            @reset="resetFilters"
          />
        </div>
      </aside>
    </div>
  </Teleport>
</template>