<script setup lang="ts">
import { ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import {
  MDateField,
  MDateRangeField,
  MInputField,
  MLookupField,
  MSelectField,
  MSwitchField,
} from "@framework"
import type { CrudFilter } from "@framework"
import { resolveLookupParams } from "../../core/utils/lookupParams"
import { dateRangeKeys, resolvePreset } from "../../core/utils/dateRange"
import type { DateRangeValue } from "../../core/utils/dateRange"
import { codeLabel, resourceLabel, statusLabel, translate } from "../../core/utils/i18n"

type FilterValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | string[]
  | number[]

const props = withDefaults(defineProps<{
  schema?: CrudFilter[]
  modelValue?: Record<string, FilterValue>
  variant?: "inline" | "panel"
}>(), {
  schema: () => [],
  modelValue: () => ({}),
  variant: "panel",
})

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: Record<string, FilterValue>,
  ): void
  (
    e: "apply",
    value: Record<string, FilterValue>,
  ): void
  (e: "reset"): void
}>()

const local = ref<Record<string, FilterValue>>({})

watch(
  () => props.modelValue,
  (value) => {
    local.value = {
      ...(value ?? {}),
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

/*
| `dependsOn` boleh berupa daftar, sebentuk dengan `MFormBuilder`.
|
| Schema yang sama dipakai form dan filter, jadi bentuknya tidak boleh
| berbeda: `depends_on=["company", "location"]` yang bekerja di form
| lalu diam-diam tidak berpengaruh di toolbar adalah selisih yang tidak
| akan pernah ada yang mencurigainya.
*/
function dependencyKeys(item: CrudFilter): string[] {
  if (!item.dependsOn)
    return []

  return Array.isArray(item.dependsOn)
    ? item.dependsOn
    : [item.dependsOn]
}

/*
| "Select Branch", bukan "Select".
|
| Toolbar sengaja tidak mengoper `label` ke field-nya — kalau dioper,
| judulnya ikut tercetak di atas dropdown dan barisnya jadi dua tingkat.
| Konsekuensinya teks bawaan `MLookupSelect` jatuh jadi "Select "
| kosongan, dan tiga dropdown berjejer semuanya berbunyi sama persis:
| tidak ada yang memberi tahu mana Branch, mana Location Type.
*/
/*
| Opsi dropdown filter, dengan label yang mengikuti bahasa aktif.
|
| `filters.ts` hasil generate menyimpan opsinya sebagai literal Inggris
| (`{ label: "Approved", value: "approved" }`) — itu datang dari schema
| backend dan memang harus tetap Inggris di sana, karena API tidak tahu
| bahasa pembacanya.
|
| Yang diterjemahkan **labelnya saja**. `value` diteruskan apa adanya:
| itu yang dikirim balik sebagai query string, dan mengubahnya berarti
| filter yang tidak mencocokkan apa pun.
|
| Kode tanpa terjemahan mengembalikan label Inggris dari schema, jadi
| filter modul yang belum diterjemahkan tampil persis seperti dulu.
*/
/*
| Label penyaring, diterjemahkan saat render — alasannya sama persis
| dengan `fieldLabel` di `MFormBuilder`: `createFilters({...})` juga
| `const` tingkat module.
*/
function filterLabel(item: CrudFilter): string | undefined {
  if (!item?.labelKey)
    return item?.label

  return resourceLabel(item.labelKey, item.label ?? '')
}

function localizedOptions(item: CrudFilter) {
  const options = item.options ?? []

  if (!options.length)
    return options

  return options.map((option) => {
    const value = option.value == null ? null : String(option.value)
    const label = option.label == null ? null : String(option.label)

    /*
     * Penyaring boolean memakai nilai "true"/"false", bukan kode enum.
     * Keduanya dipetakan ke kosakata status yang sama dengan kolom
     * boolean di tabel, supaya satu layar tidak menyebut hal yang sama
     * dengan dua kata.
     */
    if (value === 'true' || value === 'false') {
      return {
        ...option,
        label: statusLabel(value === 'true' ? 'active' : 'inactive', label),
      }
    }

    return { ...option, label: codeLabel(String(item.key), value, label) }
  })
}

function placeholderOf(item: CrudFilter) {
  if (item.placeholder)
    return item.placeholder

  // Lewat `filterLabel`, bukan `item.label` mentah — kalau tidak,
  // placeholder lookup tetap berbahasa Inggris di layar yang seluruh
  // label lainnya sudah berganti.
  const label = filterLabel(item)

  if (!label)
    return undefined

  /*
   * Kata "Select"-nya ikut diterjemahkan, bukan cuma labelnya.
   * "Select Perusahaan Induk" adalah setengah terjemahan, dan setengah
   * terjemahan terbaca lebih salah daripada tidak diterjemahkan sama
   * sekali.
   */
  return translate("common.actions.selectField", `Select ${label}`, { label })
}

function resolveDepends(item: CrudFilter) {
  return resolveLookupParams(
    item.lookupParams,
    local.value,
  )
}

function isFieldDisabled(
  item: CrudFilter,
): boolean {
  const keys = dependencyKeys(item)

  if (!keys.length)
    return false

  // Salah satu induk kosong sudah cukup: penyaringan yang bergantung
  // pada dua induk tapi cuma menerima satu akan menampilkan data
  // seluruh tenant, dan itu justru keadaan yang mau dihindari.
  return keys.some((key) => {
    const parentValue = local.value[key]

    return (
      parentValue === undefined
      || parentValue === null
      || parentValue === ''
    )
  })
}

function resetDependentFilters(
  parentKey: string,
  values: Record<string, FilterValue>,
) {
  for (const item of props.schema) {
    if (!dependencyKeys(item).includes(parentKey))
      continue

    values[item.key] = null

    resetDependentFilters(
      item.key,
      values,
    )
  }
}

/*
| Rentang tanggal: satu kontrol, **dua** kunci.
|
| `update()` di bawah menulis satu kunci per panggilan, dan memanggilnya
| dua kali berarti dua kali `emit("apply")` pada varian inline — yaitu
| dua permintaan untuk satu kali orang memilih periode, yang pertama
| dengan rentang yang belum lengkap. Keduanya ditulis sekaligus di sini.
*/
function rangeValue(item: CrudFilter): DateRangeValue {
  const [fromKey, toKey] = dateRangeKeys(item)

  return {
    from: (local.value[fromKey] as string) ?? null,
    to: (local.value[toKey] as string) ?? null,
  }
}

function updateRange(item: CrudFilter, value: DateRangeValue) {
  const [fromKey, toKey] = dateRangeKeys(item)

  const next: Record<string, FilterValue> = {
    ...local.value,
    [fromKey]: value.from,
    [toKey]: value.to,
  }

  local.value = next

  emit("update:modelValue", next)

  if (props.variant === "inline") {
    emit("apply", next)
  }
}

function update(
  key: string,
  value: FilterValue,
) {
  const next: Record<string, FilterValue> = {
    ...local.value,
    [key]: value,
  }

  if (local.value[key] !== value) {
    resetDependentFilters(
      key,
      next,
    )
  }

  local.value = next

  emit("update:modelValue", next)

  if (props.variant === "inline") {
    emit("apply", next)
  }
}

function apply() {
  emit(
    "apply",
    {
      ...local.value,
    },
  )
}

function reset() {
  local.value = {}

  emit(
    "update:modelValue",
    {},
  )

  emit("reset")
}

/*
| Rentang bawaan dipasang begitu penyaringnya muncul tanpa nilai.
|
| Bukan basa-basi tampilan: tanpa ini tombolnya berbunyi "Period" kosong
| pada layar yang **sedang** menampilkan bulan berjalan — backend
| memakai bawaannya sendiri saat parameternya absen — jadi yang
| membacanya menyangka daftarnya memuat seluruh sejarah.
|
| Menulis ke `local` saja, tanpa `emit("apply")`: nilainya sudah ikut
| di permintaan pertama lewat `useCrud` yang menurunkannya dari helper
| yang sama. Memancarkan di sini berarti satu permintaan kedua yang
| isinya persis sama dengan yang pertama.
*/
watch(
  [() => props.schema, () => props.modelValue],
  () => {
    for (const item of props.schema) {
      if (item.type !== "dateRange")
        continue

      const [fromKey, toKey] = dateRangeKeys(item)

      if (local.value[fromKey] || local.value[toKey])
        continue

      const seeded = resolvePreset(item.defaultRange ?? undefined)

      local.value = {
        ...local.value,
        [fromKey]: seeded.from,
        [toKey]: seeded.to,
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div :class="variant === 'inline' ? 'flex flex-wrap items-center gap-2' : 'space-y-5'">
    <template v-for="item in schema" :key="item.key">
      <MInputField
        v-if="item.type === 'text'"
        :model-value="local[item.key] as string | number | null | undefined"
        :label="variant === 'panel' ? filterLabel(item) : undefined"
        :placeholder="item.placeholder ?? filterLabel(item)"
        @update:model-value="(v: string) => update(item.key, v)"
      />

      <MSelectField
        v-else-if="item.type === 'select'"
        :model-value="local[item.key] as string | number | null | undefined"
        :label="variant === 'panel' ? filterLabel(item) : undefined"
        :placeholder="item.placeholder ?? filterLabel(item)"
        :options="localizedOptions(item)"
        @update:model-value="(v: string | number | null) => update(item.key, v)"
      />

      <!--
        `:depends` — bukan `:lookup-params` + `:form-values`.

        Tiga prop itu sempat dioper ke sini dan **tidak satu pun ada di
        `MLookupField`**, jadi semuanya jatuh jadi atribut mati: filter
        Branch tetap menampilkan seluruh tenant walau Company sudah
        dipilih, dan tidak ada satu pun error yang menyertainya. Vue
        memang tidak mengeluhkan prop yang tidak dikenal.

        Resolusinya dilakukan di sini, sama seperti `MFormBuilder` —
        `MLookupField` hanya menerima pasangan siap kirim.
      -->
      <MLookupField
        v-else-if="item.type === 'lookup'"
        :model-value="local[item.key]"
        :label="variant === 'panel' ? filterLabel(item) : undefined"
        :endpoint="item.endpoint ?? ''"
        :placeholder="placeholderOf(item)"
        :disabled="isFieldDisabled(item)"
        :depends="resolveDepends(item)"
        @update:model-value="(v: FilterValue) => update(item.key, v)"
      />

      <MDateRangeField
        v-else-if="item.type === 'dateRange'"
        :model-value="rangeValue(item)"
        :label="filterLabel(item)"
        :placeholder="item.placeholder"
        :variant="variant"
        :default-range="item.defaultRange"
        :max-days="item.maxDays"
        :presets="item.presets ?? undefined"
        @update:model-value="(v: DateRangeValue) => updateRange(item, v)"
      />

      <MDateField
        v-else-if="item.type === 'date'"
        :model-value="local[item.key] as string | null | undefined"
        :label="variant === 'panel' ? filterLabel(item) : undefined"
        :placeholder="item.placeholder ?? filterLabel(item)"
        @update:model-value="(v: string | null) => update(item.key, v)"
      />

      <MSwitchField
        v-else-if="item.type === 'boolean' || item.type === 'switch'"
        :model-value="Boolean(local[item.key])"
        :label="item.label"
        @update:model-value="(v: boolean) => update(item.key, v)"
      />

      <component
        :is="item.component"
        v-else-if="item.type === 'custom' && item.component"
        v-model="local[item.key]"
        v-bind="item.props ?? {}"
      />
    </template>

    <div v-if="variant === 'panel'" class="flex justify-end gap-2 border-t pt-4">
      <Button variant="outline" type="button" @click="reset">
        {{ translate('common.actions.reset', 'Reset') }}
      </Button>

      <Button type="button" @click="apply">
        {{ translate('common.actions.apply', 'Apply') }}
      </Button>
    </div>
  </div>
</template>