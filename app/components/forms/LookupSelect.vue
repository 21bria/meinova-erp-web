<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useApi } from "@/composables/useApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LookupItem = { value: number; label: string }
type ApiList<T> = { count: number; next: string | null; results: T[] }

const props = defineProps<{
  label: string
  endpoint: string
  depends?: Record<string, any>
  disabled?: boolean
  variant?: "compact" | "field"
  selectedLabel?: string | null
  valueKey?: string
  labelKey?: string
  searchParam?: string
  allowNull?: boolean
  nullLabel?: string
}>()

const model = defineModel<number | null>({ default: null })
const { request } = useApi()

const open = ref(false)
const page = ref(1)
const loading = ref(false)
const items = ref<LookupItem[]>([])
const hasNext = ref(true)

const MIN_SEARCH = 2
const DEBOUNCE_MS = 300

const searchInput = ref("")
const searchQuery = ref("")
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const isField = computed(() => (props.variant ?? "compact") === "field")
const valueKey = computed(() => props.valueKey ?? "id")
const labelKey = computed(() => props.labelKey ?? "name")
const searchParam = computed(() => props.searchParam ?? "search")
const allowNull = computed(() => props.allowNull ?? true)
const nullLabel = computed(() =>
  props.nullLabel ?? (isField.value ? `Select ${props.label}` : "All")
)

const dependsQuery = computed(() => {
  const d = props.depends || {}
  const q: Record<string, any> = {}

  for (const k of Object.keys(d)) {
    q[k] = (d[k]?.value ?? d[k]) ?? undefined
  }

  return q
})

const labelCache = ref<Record<number, string>>({})

function remember(it: LookupItem) {
  if (it?.value != null) {
    labelCache.value[it.value] = it.label
  }
}

function mapItem(raw: any): LookupItem {
  const value = raw?.value ?? raw?.[valueKey.value] ?? raw?.id

  const label = String(
    raw?.label ??
      raw?.[labelKey.value] ??
      raw?.name ??
      raw?.title ??
      raw?.code ??
      value
  )

  return { value, label }
}

function resetList() {
  items.value = []
  page.value = 1
  hasNext.value = true
}

watch(
  () => [model.value, props.selectedLabel] as const,
  ([id, lbl]) => {
    if (id != null && lbl && !labelCache.value[id]) {
      labelCache.value[id] = lbl
    }
  },
  { immediate: true }
)

watch(
  () => model.value,
  (v) => {
    if (v != null) {
      fetchLabelById(Number(v))
    }
  },
  { immediate: true }
)

watch(dependsQuery, () => {
  resetList()

  if (open.value) {
    load(true)
  }
})

async function fetchLabelById(id: number) {
  if (!id) return
  if (labelCache.value[id]) return

  try {
    const detail = await request<any>(`${props.endpoint}${id}/`, {
      method: "GET",
      query: {
        value_key: valueKey.value,
        label_key: labelKey.value,
      },
    })

    const mapped = mapItem(detail)
    remember(mapped)
    return
  } catch {
    try {
      const res = await request<ApiList<any>>(props.endpoint, {
        method: "GET",
        query: {
          page: 1,
          page_size: 1,
          id,
          value_key: valueKey.value,
          label_key: labelKey.value,
          ...dependsQuery.value,
        },
      })

      const raw = res?.results?.[0]
      if (raw) {
        const mapped = mapItem(raw)
        remember(mapped)
      }
    } catch {
      if (!labelCache.value[id] && props.selectedLabel) {
        labelCache.value[id] = props.selectedLabel
      }
    }
  }
}

async function load(reset = false) {
  if (props.disabled) return
  if (loading.value) return
  if (!hasNext.value && !reset) return

  loading.value = true

  try {
    const res = await request<ApiList<any>>(props.endpoint, {
      method: "GET",
      query: {
        page: page.value,
        page_size: 10,
        [searchParam.value]: searchQuery.value || undefined,
        value_key: valueKey.value,
        label_key: labelKey.value,
        ...dependsQuery.value,
      },
    })

    hasNext.value = !!res?.next

    const newItems = (res?.results ?? [])
      .map(mapItem)
      .filter((it) => it.value !== null && it.value !== undefined)

    newItems.forEach(remember)

    items.value = reset ? newItems : [...items.value, ...newItems]
  } finally {
    loading.value = false
  }
}

function toggleOpen() {
  if (props.disabled) return

  open.value = !open.value

  if (open.value && items.value.length === 0) {
    load(true)
  }
}

function closeDropdown() {
  open.value = false
}

function selectItem(it: LookupItem) {
  remember(it)
  model.value = it.value
  closeDropdown()
}

function clearValue() {
  model.value = null
  closeDropdown()
}

function onScroll(e: Event) {
  const el = e.target as HTMLElement

  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    if (hasNext.value && !loading.value) {
      page.value += 1
      load()
    }
  }
}

watch(searchInput, (v) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  const s = (v ?? "").trim()

  if (s.length > 0 && s.length < MIN_SEARCH) {
    items.value = []
    page.value = 1
    hasNext.value = false
    searchQuery.value = ""
    return
  }

  debounceTimer = setTimeout(() => {
    searchQuery.value = s
  }, DEBOUNCE_MS)
})

watch(searchQuery, () => {
  page.value = 1
  hasNext.value = true
  load(true)
})

const selectedLabel = computed(() => {
  const v = model.value
  if (v == null) return undefined

  return (
    items.value.find((i) => i.value === v)?.label ||
    labelCache.value[v] ||
    props.selectedLabel ||
    undefined
  )
})
</script>

<template>
  <div :class="isField ? 'relative w-full' : 'relative'">
    <Button
      type="button"
      variant="outline"
      :disabled="disabled"
      @click="toggleOpen"
      :class="[
        'h-9',
        isField ? 'w-full justify-between px-3' : '',
      ]"
    >
      <span class="truncate">
        <template v-if="!isField">
          <span class="font-medium">{{ label }}:</span>
        </template>

        {{ model != null ? (selectedLabel ?? model) : nullLabel }}
      </span>

      <Icon name="i-radix-icons-chevron-down" class="ml-2 h-4 w-4 opacity-70" />
    </Button>

    <div
      v-if="open"
      :class="[
        'absolute z-50 mt-2 rounded-md border bg-background shadow-lg',
        isField ? 'w-full' : 'w-[260px]',
      ]"
    >
      <div class="border-b p-2">
        <Input
          v-model="searchInput"
          placeholder="Search..."
          class="h-9"
          @keydown.stop
        />
      </div>

      <div class="max-h-[180px] overflow-y-auto" @scroll="onScroll">
        <button
          v-if="allowNull && !searchInput.trim()"
          class="w-full px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
          @click="clearValue"
        >
          {{ nullLabel }}
        </button>

        <button
          v-for="it in items"
          :key="it.value"
          class="w-full px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
          @click="selectItem(it)"
        >
          {{ it.label }}
        </button>

        <div
          v-if="searchInput.trim().length > 0 && searchInput.trim().length < MIN_SEARCH"
          class="px-3 py-2 text-xs text-muted-foreground"
        >
          Type at least {{ MIN_SEARCH }} characters...
        </div>

        <div v-if="loading" class="px-3 py-2 text-xs text-muted-foreground">
          Loading...
        </div>

        <div
          v-else-if="!items.length && searchInput.trim().length >= MIN_SEARCH"
          class="px-3 py-2 text-xs text-muted-foreground"
        >
          No results
        </div>
      </div>
    </div>
  </div>
</template>