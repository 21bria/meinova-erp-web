<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import LookupSelect from "./LookupSelect.vue"
import MultiLookupFilter from "./MultiLookupFilter.vue"
import DateRangePicker from "./DateRangePicker.vue"
import AdvancedFiltersDrawer from "./AdvancedFiltersDrawer.vue"

import type { FilterSchema } from "@/types/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const props = defineProps<{
  search: string
  filters: FilterSchema[]
  loading?: boolean
  actionLabel?: string

  showAdd?: boolean
  showAddMulti?: boolean
  showExport?: boolean
  showImport?: boolean
  showBulkDelete?: boolean
  showRangeDelete?: boolean
  showDownloadTemplate?: boolean
  showSyncData?: boolean

  disableAdd?: boolean
  disableExport?: boolean
  disableImport?: boolean
  disableBulkDelete?: boolean
  disableRangeDelete?: boolean
  disableDownloadTemplate?: boolean
  disableSyncData?: boolean
}>()

const emit = defineEmits<{
  (e: "update:search", v: string): void
  (e: "apply", v: { search: string; filters: Record<string, any> }): void
  (e: "reset"): void

  (e: "add"): void
  (e: "add-multi"): void
  (e: "import"): void
  (e: "export"): void
  (e: "bulk-delete"): void
  (e: "range-delete"): void
  (e: "download-template"): void
  (e: "sync-data"): void
}>()

const local = ref<Record<string, any>>({})
const advancedOpen = ref(false)
const hasAutoApplied = ref(false)

function isMulti(f: FilterSchema) {
  return f.kind === "select" && (f as any).multiple === true
}

function getDefaultDateRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)

  const pad = (n: number) => String(n).padStart(2, "0")

  return {
    start: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    end: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  }
}

function initValueForFilter(f: FilterSchema) {
  if (f.kind === "daterange") {
    return getDefaultDateRange()
  }
  if (isMulti(f)) return []
  return null
}

function isTopFilter(f: FilterSchema) {
  return (f as any).placement === "top"
}

function isDrawerFilter(f: FilterSchema) {
  return (f as any).placement !== "top"
}

const topFilters = computed(() => props.filters.filter(isTopFilter))
const drawerFilters = computed(() => props.filters.filter(isDrawerFilter))

function getDependsObject(keys?: string[]) {
  if (!keys?.length) return undefined
  return Object.fromEntries(keys.map((k) => [k, local.value[k]]))
}

function isDependsMissing(keys?: string[]) {
  return !!keys?.some((k) => !local.value[k])
}

watch(
  () => props.filters,
  () => {
    const next: Record<string, any> = { ...local.value }

    for (const f of props.filters) {
      if (f.kind === "daterange") {
        const def = getDefaultDateRange()
        if (!(f.startKey in next) || !next[f.startKey]) next[f.startKey] = def.start
        if (!(f.endKey in next) || !next[f.endKey]) next[f.endKey] = def.end
      } else {
        if (!(f.key in next)) next[f.key] = initValueForFilter(f)
      }
    }

    local.value = next
  },
  { immediate: true }
)

watch(
  () => props.filters,
  () => {
    for (const f of props.filters) {
      if (f.kind !== "select" || !f.depends?.length) continue

      watch(
        () => f.depends!.map((k) => local.value[k]),
        () => {
          local.value[f.key] = isMulti(f) ? [] : null
        },
        { deep: true }
      )
    }
  },
  { immediate: true }
)

function normalizeFilters(obj: Record<string, any>) {
  const out: Record<string, any> = {}

  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      out[k] = v.length ? v.join(",") : undefined
    } else {
      out[k] = v ?? undefined
    }
  }

  return out
}

function apply() {
  emit("apply", {
    search: props.search,
    filters: normalizeFilters({ ...local.value }),
  })
}

function reset() {
  emit("update:search", "")

  for (const f of props.filters) {
    if (f.kind === "daterange") {
      const def = getDefaultDateRange()
      local.value[f.startKey] = def.start
      local.value[f.endKey] = def.end
    } else {
      local.value[f.key] = initValueForFilter(f)
    }
  }

  emit("reset")
  apply()
}

onMounted(() => {
  if (!hasAutoApplied.value) {
    hasAutoApplied.value = true
    apply()
  }
})
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-wrap items-center gap-2">
      <Input
        class="h-9 w-[240px]"
        placeholder="Search..."
        :model-value="search"
        @update:model-value="emit('update:search', String($event))"
        @keyup.enter="apply"
      />

      <template v-for="f in topFilters" :key="f.kind === 'daterange' ? (f.startKey + '_' + f.endKey) : f.key">
        <select
          v-if="f.kind === 'static-select'"
          class="h-9 rounded-md border bg-background px-2 text-sm"
          v-model="local[f.key]"
        >
          <option :value="null">All</option>
          <option v-for="o in f.options" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </select>

        <MultiLookupFilter
          v-else-if="f.kind === 'select' && f.multiple"
          v-model="local[f.key]"
          :title="f.label"
          :endpoint="f.endpoint"
          :depends="getDependsObject(f.depends)"
          :disabled="props.loading || isDependsMissing(f.depends)"
        />

        <LookupSelect
          v-else-if="f.kind === 'select'"
          v-model="local[f.key]"
          :label="f.label"
          :endpoint="f.endpoint"
          :depends="getDependsObject(f.depends)"
          :disabled="props.loading || isDependsMissing(f.depends)"
        />

        <Input
          v-else-if="f.kind === 'text'"
          class="h-9 w-[200px]"
          :placeholder="f.placeholder ?? f.label"
          v-model="local[f.key]"
        />

        <Input
          v-else-if="f.kind === 'date'"
          type="date"
          class="h-9 w-[160px]"
          v-model="local[f.key]"
        />

        <DateRangePicker
          v-else-if="f.kind === 'daterange'"
          :model-value="{ start: local[f.startKey], end: local[f.endKey] }"
          @update:model-value="(v: any) => { local[f.startKey] = v?.start ?? null; local[f.endKey] = v?.end ?? null }"
          :label="f.label"
          :number-of-months="2"
        />
      </template>

      <AdvancedFiltersDrawer
        v-if="drawerFilters.length"
        v-model:open="advancedOpen"
        v-model:modelValue="local"
        :filters="drawerFilters"
        :loading="props.loading"
        :disableOnMissingDepends="true"
        title="Advanced Filters"
        @apply="apply"
        @reset="reset"
      />

      <Button class="h-9" @click="apply">Filter</Button>
      <Button class="h-9" variant="ghost" @click="reset">Reset</Button>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button :disabled="props.loading" size="sm" class="ml-auto h-9">
          <Icon name="i-radix-icons-mixer-horizontal" class="h-4 w-4" />
          <span class="hidden sm:inline ml-2">{{ props.actionLabel ?? "Actions" }}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuItem
          v-if="props.showAdd !== false"
          :disabled="props.disableAdd || props.loading"
          @select="emit('add')"
        >
          Create
        </DropdownMenuItem>

        <DropdownMenuItem
          v-if="props.showAddMulti !== false"
          :disabled="props.loading"
          @select="emit('add-multi')"
        >
          Create Multi
        </DropdownMenuItem>

        <DropdownMenuSeparator
          v-if="
            (props.showAdd !== false || props.showAddMulti !== false) &&
            (props.showImport !== false || props.showExport !== false)
          "
        />

        <DropdownMenuItem
          v-if="props.showImport !== false"
          :disabled="props.disableImport || props.loading"
          @select="emit('import')"
        >
          Import
        </DropdownMenuItem>

        <DropdownMenuItem
          v-if="props.showExport !== false"
          :disabled="props.disableExport || props.loading"
          @select="emit('export')"
        >
          Export
        </DropdownMenuItem>

        <DropdownMenuSeparator
          v-if="(props.showBulkDelete !== false) || (props.showRangeDelete !== false) || (props.showDownloadTemplate !== false) || (props.showSyncData !== false)"
        />

        <DropdownMenuItem
          v-if="props.showBulkDelete !== false"
          :disabled="props.disableBulkDelete || props.loading"
          @select="emit('bulk-delete')"
        >
          Bulk Delete
        </DropdownMenuItem>

        <DropdownMenuItem
          v-if="props.showRangeDelete !== false"
          :disabled="props.disableRangeDelete || props.loading"
          @select="emit('range-delete')"
        >
          Period Delete
        </DropdownMenuItem>

        <DropdownMenuItem
          v-if="props.showDownloadTemplate !== false"
          :disabled="props.disableDownloadTemplate || props.loading"
          @select="emit('download-template')"
        >
          Download Template
        </DropdownMenuItem>

        <DropdownMenuItem
          v-if="props.showSyncData !== false"
          :disabled="props.disableSyncData || props.loading"
          @select="emit('sync-data')"
        >
          Sync Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>