<script setup lang="ts">
/*
 * Pemilih **banyak** baris dari sebuah endpoint.
 *
 * Bedanya dengan `MMultiSelectField`: yang itu memilih dari daftar
 * opsi statis di schema, yang ini menembak endpoint. Dipakai untuk
 * pilihan yang jumlahnya tidak bisa ditulis di schema — memilih tiga
 * puluh pegawai satu site, misalnya.
 *
 * Bedanya dengan `MLookupField`: yang itu satu nilai. Menyusun bulk
 * lewat lookup satuan berarti menekan tombol tiga puluh kali, dan itu
 * persis pekerjaan yang mau dihindari fitur bulk.
 *
 * Endpoint boleh membalas tiga bentuk yang semuanya dipakai di repo
 * ini — `{results}`, `{data: [...]}`, dan `{data: {results}}`. Dibuat
 * toleran di sini, bukan diseragamkan di backend, karena bentuk
 * envelope-nya sudah dipakai puluhan endpoint lain.
 */

import { Check, ChevronsUpDown, Loader2, X } from 'lucide-vue-next'
import { translate } from "../../core/utils/i18n"
import { computed, ref, watch } from 'vue'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApi } from '@/composables/useApi'

import MFieldError from './MFieldError.vue'
import MFieldHint from './MFieldHint.vue'
import MFieldLabel from './MFieldLabel.vue'

type Row = Record<string, any>

const props = withDefaults(
  defineProps<{
    modelValue?: (number | string)[]
    label?: string
    endpoint: string
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    error?: string | null
    hint?: string | null
    required?: boolean
    disabled?: boolean
    labelKey?: string
    valueKey?: string
    searchParam?: string
    /* Kunci boolean yang menandai baris sudah dipakai — ditampilkan
     * pudar dan tidak bisa dicentang. `already_added` pada endpoint
     * kandidat roster memakainya. */
    disabledKey?: string
    maxVisible?: number
    params?: Record<string, any>
  }>(),
  {
    modelValue: () => [],
    label: '',
    placeholder: 'Select…',
    searchPlaceholder: 'Search…',
    emptyText: 'No results.',
    error: null,
    hint: null,
    required: false,
    disabled: false,
    labelKey: 'label',
    valueKey: 'value',
    searchParam: 'search',
    disabledKey: '',
    maxVisible: 6,
    params: () => ({}),
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: (number | string)[]]
}>()

const { request } = useApi()

const open = ref(false)
const loading = ref(false)
const rows = ref<Row[]>([])
const search = ref('')
const loadError = ref<string | null>(null)

let debounce: ReturnType<typeof setTimeout> | null = null

const selected = computed({
  get: () => props.modelValue ?? [],
  set: value => emit('update:modelValue', value),
})

function normalize(response: any): Row[] {
  if (Array.isArray(response))
    return response

  if (Array.isArray(response?.results))
    return response.results

  if (Array.isArray(response?.data))
    return response.data

  if (Array.isArray(response?.data?.results))
    return response.data.results

  return []
}

async function load() {
  if (!props.endpoint)
    return

  loading.value = true
  loadError.value = null

  try {
    const response = await request<any>(props.endpoint, {
      query: {
        ...props.params,
        [props.searchParam]: search.value || undefined,
        page_size: 100,
      },
    })

    rows.value = normalize(response)
  }
  catch (error: any) {
    // Ditampilkan, bukan ditelan: daftar kosong karena request gagal
    // terbaca persis seperti "memang tidak ada kandidat", dan itu
    // mengirim orang mencari sebab di tempat yang salah.
    rows.value = []
    loadError.value = error?.data?.message
      ?? error?.message
      ?? translate("common.errors.loadList", "Failed to load list.")
  }
  finally {
    loading.value = false
  }
}

watch(open, (value) => {
  if (value && !rows.value.length)
    load()
})

watch(search, () => {
  if (debounce)
    clearTimeout(debounce)

  debounce = setTimeout(load, 300)
})

function valueOf(row: Row) {
  return row[props.valueKey] ?? row.value ?? row.id
}

function labelOf(row: Row) {
  return row[props.labelKey] ?? row.label ?? row.name ?? String(valueOf(row))
}

function isDisabled(row: Row) {
  return Boolean(props.disabledKey && row[props.disabledKey])
}

const selectable = computed(() => rows.value.filter(row => !isDisabled(row)))

function isSelected(row: Row) {
  return selected.value.includes(valueOf(row))
}

function toggle(row: Row) {
  if (isDisabled(row))
    return

  const value = valueOf(row)

  selected.value = isSelected(row)
    ? selected.value.filter(item => item !== value)
    : [...selected.value, value]
}

const allShownSelected = computed(
  () =>
    selectable.value.length > 0
    && selectable.value.every(row => isSelected(row)),
)

function toggleAllShown() {
  const values = selectable.value.map(valueOf)

  selected.value = allShownSelected.value
    ? selected.value.filter(item => !values.includes(item))
    : Array.from(new Set([...selected.value, ...values]))
}

/*
| Label baris yang **pernah** dimuat, disimpan terus.
|
| `rows` cuma memuat hasil pencarian terakhir. Tanpa ingatan ini, chip
| dari pilihan sebelumnya kehilangan namanya begitu kotak cari diketik
| lagi dan berubah jadi angka id mentah — dan di dialog yang urutan
| chip-nya justru bagian dari keputusan (urutan perputaran shift),
| deretan angka adalah satu-satunya umpan balik yang didapat pengguna.
*/
const seenLabels = new Map<number | string, string>()

watch(rows, (list) => {
  for (const row of list)
    seenLabels.set(valueOf(row), labelOf(row))
}, { deep: true, immediate: true })

/*
| Muat sekali di awal kalau ada pilihan tersimpan yang labelnya belum
| dikenal.
|
| `load()` sebelumnya hanya dipicu saat popover dibuka, jadi layar
| **edit** menampilkan id mentah — "3 · 6 · 8" alih-alih nama
| keperluannya — sampai daftarnya diklik. Yang dilihat pengguna saat
| membuka record adalah keadaan tersimpan, dan angka id bukan jawaban
| atas "apa yang sudah saya pilih".
|
| Ditaruh sesudah `seenLabels` dengan sengaja: watcher `immediate`
| berjalan saat setup, dan `const` di bawahnya belum terinisialisasi.
*/
watch(
  () => props.modelValue,
  (value) => {
    if (!props.endpoint || loading.value)
      return

    const unknown = (value ?? []).some(
      item => !seenLabels.has(item),
    )

    if (unknown)
      load()
  },
  { immediate: true },
)

const chips = computed(() => {
  const byValue = new Map(rows.value.map(row => [valueOf(row), labelOf(row)]))

  return selected.value.map(value => ({
    value,
    label: byValue.get(value) ?? seenLabels.get(value) ?? String(value),
  }))
})

function remove(value: number | string) {
  selected.value = selected.value.filter(item => item !== value)
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="label"
      :required="required"
    />

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          :disabled="disabled"
          class="w-full justify-between font-normal"
        >
          <span class="truncate">
            {{
              selected.length
                ? `${selected.length} selected`
                : placeholder
            }}
          </span>

          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        class="w-[--reka-popover-trigger-width] p-0"
        align="start"
      >
        <div class="border-b p-2">
          <Input
            v-model="search"
            :placeholder="searchPlaceholder"
            class="h-8"
          />
        </div>

        <div
          v-if="loading"
          class="flex items-center gap-2 p-4 text-sm text-muted-foreground"
        >
          <Loader2 class="size-4 animate-spin" />
          Loading…
        </div>

        <div
          v-else-if="loadError"
          class="p-4 text-sm text-destructive"
        >
          {{ loadError }}
        </div>

        <template v-else>
          <div
            v-if="selectable.length"
            class="flex items-center gap-2 border-b px-3 py-2"
          >
            <Checkbox
              :model-value="allShownSelected"
              @update:model-value="toggleAllShown"
            />

            <span class="text-sm">
              Select all shown ({{ selectable.length }})
            </span>
          </div>

          <ScrollArea class="max-h-72">
            <div
              v-if="!rows.length"
              class="p-4 text-sm text-muted-foreground"
            >
              {{ emptyText }}
            </div>

            <button
              v-for="row in rows"
              :key="valueOf(row)"
              type="button"
              :disabled="isDisabled(row)"
              class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              @click="toggle(row)"
            >
              <Check
                class="size-4 shrink-0"
                :class="isSelected(row) ? 'opacity-100' : 'opacity-0'"
              />

              <span class="truncate">{{ labelOf(row) }}</span>

              <span
                v-if="isDisabled(row)"
                class="ml-auto text-xs text-muted-foreground"
              >
                already added
              </span>
            </button>
          </ScrollArea>
        </template>
      </PopoverContent>
    </Popover>

    <div
      v-if="chips.length"
      class="flex flex-wrap gap-1"
    >
      <Badge
        v-for="chip in chips.slice(0, maxVisible)"
        :key="chip.value"
        variant="secondary"
        class="gap-1"
      >
        {{ chip.label }}

        <button
          type="button"
          class="opacity-60 hover:opacity-100"
          @click="remove(chip.value)"
        >
          <X class="size-3" />
        </button>
      </Badge>

      <Badge
        v-if="chips.length > maxVisible"
        variant="outline"
      >
        +{{ chips.length - maxVisible }}
      </Badge>
    </div>

    <MFieldHint :hint="hint" />
    <MFieldError :error="error" />
  </div>
</template>
