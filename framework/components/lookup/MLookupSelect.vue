<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { translate } from "../../core/utils/i18n"
import { useApi } from "@/composables/useApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LookupItem = {
  value: number
  label: string
  raw: Record<string, any>
}
// type ApiList<T> = { count: number; next: string | null; results: T[] }

type ApiList<T> = {
  count?: number
  next?: string | null
  results?: T[]

  success?: boolean
  data?: T[]
  meta?: {
    count?: number
    next?: string | null
    previous?: string | null
    page?: number
    page_size?: number
    total_pages?: number
  }
}

function normalizeListResponse<T>(
  response: ApiList<T>,
) {
  return {
    results:
      response?.results
      ?? response?.data
      ?? [],

    next:
      response?.next
      ?? response?.meta?.next
      ?? null,

    count:
      response?.count
      ?? response?.meta?.count
      ?? 0,
  }
}

const props = withDefaults(
  defineProps<{
    modelValue?: number | number[] | null
    label: string
    /*
     * Daftar centang, bukan pilih-satu. `modelValue` jadi `number[]`.
     *
     * Ditambahkan di sini alih-alih jadi komponen tersendiri: pencarian,
     * paginasi, cache label, dan resolusi `depends` sudah lengkap di
     * komponen ini, dan salinan kedua yang harus tetap sama adalah
     * persis cara dua dropdown berperilaku beda tanpa ada yang
     * menyadarinya.
     */
    multiple?: boolean
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
    /*
     * Teks saat belum ada yang dipilih.
     *
     * Sempat dioper `MLookupField` ke sini padahal **tidak pernah ada
     * prop-nya** — jatuh jadi atribut mati, sama seperti
     * `:lookup-params` pada kasus filter berantai. Vue tidak
     * mengeluhkan prop yang tidak dikenal, jadi keduanya gagal tanpa
     * suara.
     */
    placeholder?: string
  }>(),
  {
    modelValue: null,
    multiple: false,
    depends: () => ({}),
    disabled: false,
    variant: "compact",
    selectedLabel: null,
    valueKey: "id",
    labelKey: "name",
    searchParam: "search",
    allowNull: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: number | number[] | null,
  ]

  select: [
    item: Record<string, any> | null,
  ]
}>()

const model = computed<number | null>({
  get() {
    if (props.multiple)
      return null

    return (props.modelValue as number | null) ?? null
  },

  set(value) {
    emit(
      "update:modelValue",
      value,
    )
  },
})

// Daftar id terpilih pada mode centang. Selalu array, walau
// pemanggilnya mengirim satu angka — nilai awal dari URL atau state
// lama gampang berbentuk skalar, dan `.includes` pada angka melempar.
const selectedIds = computed<number[]>(() => {
  if (!props.multiple)
    return []

  const raw = props.modelValue

  if (Array.isArray(raw))
    return raw.map(Number).filter(value => !Number.isNaN(value))

  if (raw == null)
    return []

  return [Number(raw)].filter(value => !Number.isNaN(value))
})

function isChecked(value: number): boolean {
  return selectedIds.value.includes(Number(value))
}

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
/*
 * Urutannya: `nullLabel` eksplisit → `placeholder` → turunan dari label.
 *
 * Dipakai `??` sebelumnya, dan itu salah untuk dua prop yang bawaannya
 * string kosong: `""` bukan nullish, jadi ia menang atas turunannya dan
 * tombolnya jadi kosong melompong. Diperiksa truthy, bukan nullish.
 *
 * `.trim()` bukan kosmetik. Filter di toolbar sengaja tidak mengoper
 * `label` (kalau dioper, judulnya ikut tercetak di atas dropdown), jadi
 * turunannya jadi `"Select "` — dan yang terbaca pengguna cuma
 * **"Select"** telanjang, tiga kali berjejer di satu baris tanpa ada
 * yang memberi tahu mana yang mana.
 */
const nullLabel = computed(() => {
  if (props.nullLabel)
    return props.nullLabel

  if (props.placeholder)
    return props.placeholder

  return isField.value
    ? `Select ${props.label}`.trim()
    : "All"
})

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

function mapItem(
  raw: Record<string, any>,
): LookupItem {
  const value =
    raw?.value
    ?? raw?.[valueKey.value]
    ?? raw?.id

  const label = String(
    raw?.label
    ?? raw?.[labelKey.value]
    ?? raw?.name
    ?? raw?.title
    ?? raw?.code
    ?? value,
  )

  return {
    value,
    label,
    raw,
  }
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

      const normalized =
        normalizeListResponse(res)

      const raw =
        normalized.results[0]

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

    const normalized =
      normalizeListResponse(res)

    hasNext.value =
      Boolean(normalized.next)

    const newItems =
      normalized.results
        .map(mapItem)
        .filter(
          it =>
            it.value !== null
            && it.value !== undefined,
        )

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

function selectItem(
  item: LookupItem,
) {
  remember(item)

  // Dropdown **tidak** ditutup pada mode centang: yang mencentang dua
  // lokasi harus bisa mencentang keduanya tanpa membuka ulang.
  if (props.multiple) {
    toggleItem(item)
    return
  }

  model.value = item.value
  emit(
    "select",
    item.raw,
  )
  closeDropdown()
}

function toggleItem(item: LookupItem) {
  const value = Number(item.value)

  const next = isChecked(value)
    ? selectedIds.value.filter(id => id !== value)
    : [...selectedIds.value, value]

  emit("update:modelValue", next)
  emit("select", item.raw)
}

function clearValue() {
  if (props.multiple) {
    // Tidak ada yang dicentang = tanpa penyaringan. Dikirim sebagai
    // array kosong, bukan null: `cleanQuery` membuang string kosong,
    // jadi keduanya sampai ke backend sebagai "tidak disebut" — tapi
    // array kosong tetap menjaga bentuk nilainya konsisten.
    emit("update:modelValue", [])
    emit("select", null)
    return
  }

  model.value = null
  emit(
    "select",
    null,
  )
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

/*
 * Teks tombol pada mode centang.
 *
 * Satu terpilih tetap menyebut namanya — "Jakarta HO" jauh lebih
 * berguna daripada "1 dipilih" di kasus yang paling sering terjadi.
 * Dua ke atas baru dicacah, karena menderetkan namanya membuat tombol
 * melebar sampai mendorong pemilih periode ke baris berikutnya.
 */
const multipleLabel = computed(() => {
  const ids = selectedIds.value

  if (!ids.length)
    return nullLabel.value

  if (ids.length === 1) {
    const id = ids[0] as number

    return (
      items.value.find(item => item.value === id)?.label
      || labelCache.value[id]
      || String(id)
    )
  }

  return translate("common.labels.selected", `${ids.length} selected`, { count: ids.length })
})

// Label id terpilih ikut diambil walau barisnya belum pernah termuat —
// tanpa ini tombolnya berbunyi angka mentah ("13") saat halaman dibuka
// dengan filter yang sudah terisi dari state sebelumnya.
watch(
  selectedIds,
  (ids) => {
    ids.forEach((id) => {
      if (!labelCache.value[id])
        fetchLabelById(id)
    })
  },
  { immediate: true },
)
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

        <template v-if="multiple">
          {{ multipleLabel }}
        </template>

        <template v-else>
          {{ model != null ? (selectedLabel ?? model) : nullLabel }}
        </template>
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

        <div
          class="max-h-[180px] overflow-y-auto overscroll-contain"
          @scroll="onScroll"
          @wheel.stop
        >
        <button
          v-if="allowNull && !searchInput.trim()"
          class="w-full px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
          :class="multiple && !selectedIds.length ? 'font-medium' : ''"
          @click="clearValue"
        >
          {{ multiple ? `${nullLabel} (kosongkan)` : nullLabel }}
        </button>

        <button
          v-for="it in items"
          :key="it.value"
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
          @click="selectItem(it)"
        >
          <span
            v-if="multiple"
            class="flex size-4 shrink-0 items-center justify-center rounded-sm border"
            :class="isChecked(it.value)
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-input'"
          >
            <Icon
              v-if="isChecked(it.value)"
              name="i-lucide-check"
              class="size-3"
            />
          </span>

          <span class="truncate">{{ it.label }}</span>
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