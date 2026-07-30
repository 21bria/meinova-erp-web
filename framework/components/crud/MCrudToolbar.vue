<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { Download, Filter, MoreHorizontal, Plus, RefreshCw, Trash2, Upload, X } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import MCrudFilters from "./MCrudFilters.vue"
import type { CrudFilters } from "@framework"

const props = withDefaults(defineProps<{
  search?: string
  filtersSchema?: CrudFilters
  loading?: boolean
  showAdd?: boolean
  showImport?: boolean
  showExport?: boolean
  showBulkDelete?: boolean
  showRefresh?: boolean
  disableAdd?: boolean
  disableImport?: boolean
  disableExport?: boolean
  disableBulkDelete?: boolean
  disableRefresh?: boolean
  drawerWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}>(), {
  search: "",
  loading: false,
  showAdd: true,
  showImport: false,
  showExport: false,
  showBulkDelete: false,
  showRefresh: false,
  disableAdd: false,
  disableImport: false,
  disableExport: false,
  disableBulkDelete: false,
  disableRefresh: false,
  drawerWidth: "md"
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
}>()

const drawerWidthClass = computed(() => ({
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
}[props.drawerWidth ?? "md"]))

const drawerOpen = ref(false)
const filterValues = ref<Record<string, any>>({})

const searchEnabled = computed(() => props.filtersSchema?.search?.enabled ?? true)
const searchPlaceholder = computed(() => props.filtersSchema?.search?.placeholder ?? "Search...")
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
  filterValues.value = {}
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
        Advanced Filter
      </Button>

      <Button
        type="button"
        variant="ghost"
        class="h-9"
        :disabled="loading"
        @click="resetFilters"
      >
        Reset
      </Button>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button type="button" class="h-9" :disabled="loading">
          <MoreHorizontal class="mr-2 size-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuItem v-if="showAdd" :disabled="disableAdd || loading" @select="emit('add')">
          <Plus class="mr-2 size-4" />
          Create
        </DropdownMenuItem>

        <DropdownMenuItem v-if="showRefresh" :disabled="disableRefresh || loading" @select="emit('refresh')">
          <RefreshCw class="mr-2 size-4" />
          Refresh
        </DropdownMenuItem>

        <DropdownMenuSeparator v-if="showAdd || showRefresh" />

        <DropdownMenuItem v-if="showImport" :disabled="disableImport || loading" @select="emit('import')">
          <Upload class="mr-2 size-4" />
          Import
        </DropdownMenuItem>

        <DropdownMenuItem v-if="showExport" :disabled="disableExport || loading" @select="emit('export')">
          <Download class="mr-2 size-4" />
          Export
        </DropdownMenuItem>

        <DropdownMenuSeparator v-if="showBulkDelete && (showImport || showExport)" />

        <DropdownMenuItem
          v-if="showBulkDelete"
          class="text-destructive focus:text-destructive"
          :disabled="disableBulkDelete || loading"
          @select="emit('bulk-delete')"
        >
          <Trash2 class="mr-2 size-4" />
          Delete Selected
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
              Advanced Filter
            </h2>
            <p class="text-sm text-muted-foreground">
              Refine data using detailed criteria.
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