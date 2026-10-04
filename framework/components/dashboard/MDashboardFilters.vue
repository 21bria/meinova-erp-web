<script setup lang="ts">
import { computed } from "vue"

import { useAuthStore } from "@/stores/auth"

import type {
  DashboardLookupFilter,
} from "@framework/core/types/dashboard"

import { isMeRef, resolveMe } from "@framework/core/utils/me"

// Filter periode punya komponennya sendiri (`MDashboardPeriodPicker`)
// karena bentuk kontrolnya jauh berbeda; di sini khusus lookup.
type FilterValue = string | number | number[] | null

const auth = useAuthStore()

const props = withDefaults(defineProps<{
  lookupFilters: DashboardLookupFilter[]
  filters: Record<string, FilterValue>
  /*
   * "inline" — sebaris di kepala halaman (bawaan, dan bentuk yang sudah
   * dipakai seluruh dashboard yang ada).
   * "panel"  — menumpuk selebar panel Advanced Filter.
   *
   * Cuma soal tata letak; isinya sama persis.
   */
  layout?: "inline" | "panel"
}>(), {
  layout: "inline",
})

const emit = defineEmits<{
  (e: "update:filter", key: string, value: FilterValue): void
}>()

/**
 * `lookup_params` dari backend memakai penanda `$namaFilter`
 * (mis. `{"company_id": "$company"}`) yang harus diganti dengan nilai
 * filter yang sedang aktif. Nilai selain itu dikirim apa adanya.
 */
function resolveDepends(
  filter: DashboardLookupFilter,
): Record<string, unknown> {
  const params = filter.lookup_params ?? {}
  const resolved: Record<string, unknown> = {}

  for (const [key, raw] of Object.entries(params)) {
    if (typeof raw === "string" && raw.startsWith("$")) {
      resolved[key] = normalizeDepend(props.filters[raw.slice(1)])
      continue
    }

    resolved[key] = raw
  }

  return resolved
}

/*
 * Induk yang kosong dikirim sebagai `undefined`, bukan sebagai array
 * kosong.
 *
 * Sejak filter Company ikut bercentang banyak, "belum dipilih"
 * berbentuk `[]` — dan `[]` mendarat di query string sebagai
 * `company_id=` yang membuat dropdown turunannya menyaring ke nilai
 * kosong alih-alih tidak menyaring sama sekali. Yang terisi dikirim apa
 * adanya; array-nya di-`String()` `useApi.buildUrl` jadi "1,2", dan
 * lookup backend membacanya sebagai `__in`.
 */
function normalizeDepend(value: unknown): unknown {
  if (Array.isArray(value))
    return value.length ? value : undefined

  if (value == null || value === "")
    return undefined

  return value
}

// Lookup yang induknya belum terisi dinonaktifkan — tanpa ini
// dropdown-nya menampilkan data seluruh perusahaan.
function isDisabled(filter: DashboardLookupFilter): boolean {
  if (!filter.depends_on) return false

  // `normalizeDepend` yang menentukan "terisi", bukan kebenaran nilai
  // mentahnya: induk bercentang banyak yang kosong berbentuk `[]`, dan
  // array kosong itu **truthy** di JavaScript — tanpa ini dropdown
  // Location menyala padahal Company belum dipilih satu pun, lalu
  // menampilkan lokasi seluruh tenant.
  return normalizeDepend(props.filters[filter.depends_on]) === undefined
}

function toNumber(value: FilterValue): number | null {
  if (value == null || value === "" || Array.isArray(value)) return null

  const numeric = Number(value)

  return Number.isNaN(numeric) ? null : numeric
}

/*
 * Tombol pintas "Lokasi Saya": mengisi sebuah filter dengan nilai dari
 * profil penggunanya, ditulis di schema dengan dialek `$me.<jalur>`
 * yang sama dengan schema form.
 *
 * **Tidak menyala sendiri saat halaman dibuka**, dan itu keputusan
 * yang disengaja: angka pertama yang dilihat orang harus angka utuh.
 * Dashboard yang diam-diam sudah tersaring membuat pemegang akses
 * penuh membaca sebagian sebagai keseluruhan, dan tidak ada di layar
 * yang memberi tahu bedanya.
 *
 * Yang profilnya tidak menyebut lokasi tidak mendapat tombolnya sama
 * sekali — tombol yang ditekan lalu tidak melakukan apa pun lebih
 * membingungkan daripada tombol yang memang tidak ada.
 *
 * **Super admin juga tidak mendapatkannya**, dan itu bukan pembatasan
 * hak. Cakupan super admin memang seluruh tenant; tombol yang
 * menyempitkan layarnya ke satu lokasi menjawab pertanyaan yang bukan
 * pertanyaannya, dan justru pemegang akses penuh yang paling mudah
 * membaca sebagian sebagai keseluruhan — tidak ada di layar yang
 * memberi tahu bedanya kalau ia lupa mematikannya lagi. Penyaringan
 * per lokasi tetap tersedia lewat dropdown Location di sebelahnya,
 * yang menyebutkan pilihannya dengan nama.
 *
 * Berlaku untuk **seluruh** dashboard yang memakai `self_filter` (HR
 * Dashboard maupun laporan), dan itu disengaja: satu tombol yang sama
 * berperilaku berbeda di dua layar adalah selisih yang tidak akan
 * pernah ada yang mencurigainya.
 */
const selfFilters = computed(() => {
  if (auth.user?.is_superuser === true)
    return []

  return props.lookupFilters
    .map((filter) => {
      const reference = filter.self_filter

      if (!isMeRef(reference))
        return null

      const value = resolveMe(reference, auth.user)

      if (value == null || value === "")
        return null

      // `toArray` menerima keduanya: satu angka (penempatan
      // seseorang) maupun daftar (seluruh lokasi dalam cakupan
      // direksi). Backend yang memutuskan bentuknya — lihat
      // `MeSerializer.get_self_filter_values`; frontend tidak perlu
      // tahu siapa yang direksi.
      const values = toArray(value as FilterValue)

      if (!values.length)
        return null

      return {
        filter,
        values,
        label:
          filter.self_filter_label
          || `${filter.label ?? filter.key} Saya`,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
})

/*
 * Tombolnya menyala hanya kalau filternya berisi **persis** pilihan
 * tombol itu — tidak lebih, tidak kurang. Kalau orangnya lalu mencabut
 * satu lokasi untuk drill-down, tombolnya padam, dan itu memang yang
 * benar: yang tampil di layar bukan lagi "lokasi saya".
 */
function isSelfActive(key: string, values: number[]): boolean {
  if (!values.length)
    return false

  const current = toArray(props.filters[key] ?? null)

  return current.length === values.length
    && values.every(item => current.includes(item))
}

function toggleSelf(
  filter: DashboardLookupFilter,
  values: number[],
) {
  const active = isSelfActive(filter.key, values)

  if (active) {
    emit("update:filter", filter.key, filter.multiple ? [] : null)
    return
  }

  // Filter satu-pilihan cuma bisa menampung satu nilai; yang pertama
  // yang dipakai. Filter Location sendiri `multiple` di seluruh
  // dashboard dan laporan, jadi cabang ini tidak pernah memotong
  // pilihan siapa pun hari ini.
  emit(
    "update:filter",
    filter.key,
    filter.multiple ? [...values] : (values[0] ?? null),
  )
}

/*
 * Filter bercentang menyimpan array. Nilai skalar tetap diterima —
 * state yang datang dari URL atau dari sesi sebelum filter ini jadi
 * `multiple` berbentuk satu angka, dan menjatuhkannya berarti
 * pilihannya hilang tanpa sebab yang terlihat.
 */
function toArray(value: FilterValue): number[] {
  if (Array.isArray(value))
    return value.map(Number).filter(item => !Number.isNaN(item))

  if (value == null || value === "")
    return []

  const numeric = Number(value)

  return Number.isNaN(numeric) ? [] : [numeric]
}
</script>

<template>
  <div
    :class="layout === 'panel'
      ? 'flex flex-col gap-3'
      : 'flex flex-wrap items-center gap-2'"
  >
    <Button
      v-for="item in selfFilters"
      :key="`self-${item.filter.key}`"
      type="button"
      class="h-9"
      :class="layout === 'panel' && 'w-full justify-start'"
      :variant="isSelfActive(item.filter.key, item.values) ? 'default' : 'outline'"
      @click="toggleSelf(item.filter, item.values)"
    >
      <Icon
        :name="isSelfActive(item.filter.key, item.values)
          ? 'i-lucide-map-pin'
          : 'i-lucide-map-pin-off'"
        class="mr-1.5 size-4"
      />
      {{ item.label }}
    </Button>

    <MLookupSelect
      v-for="filter in lookupFilters"
      :key="filter.key"
      :class="layout === 'panel' && 'w-full'"
      :model-value="filter.multiple
        ? toArray(filters[filter.key] ?? null)
        : toNumber(filters[filter.key] ?? null)"
      :multiple="filter.multiple ?? false"
      :label="filter.label ?? filter.key"
      :endpoint="filter.lookup_endpoint"
      :depends="resolveDepends(filter)"
      :disabled="isDisabled(filter)"
      @update:model-value="value => emit('update:filter', filter.key, value)"
    />
  </div>
</template>
