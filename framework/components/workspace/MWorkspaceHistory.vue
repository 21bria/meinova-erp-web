<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| Tab riwayat
|--------------------------------------------------------------------------
|
| Tab bertipe `history` di schema dulu diteruskan ke sebuah slot yang
| tidak pernah diisi `page.vue` hasil generate, jadi hasilnya kotak
| "This workspace section has not been connected yet." — lebih buruk
| daripada tidak ada tabnya sama sekali, karena terbaca seperti fitur
| yang rusak.
|
| Komponen ini generik: yang dibaca cuma `endpoint` dari schema dan
| bentuk baris yang sudah dipakai `employment-history` — `{date,
| type_label, document_number, reason, changes[{label, from, to}]}`.
| Modul lain yang ingin tab riwayat cukup mendeklarasikan
| `tabs.history(endpoint=...)`; tidak ada satu pun nama modul di sini.
*/

import {
  computed,
  ref,
  watch,
} from "vue"

import { translate } from "../../core/utils/i18n"

import { apiErrorMessage } from "../../core/utils/errors"

type HistoryChange = {
  field?: string
  label?: string
  from?: any
  to?: any
}

type HistoryEntry = {
  id?: string | number
  date?: string | null
  type?: string
  type_label?: string
  document_number?: string
  reason?: string
  applied_at?: string | null
  applied_by?: string | null
  changes?: HistoryChange[]
}

const props = withDefaults(
  defineProps<{
    endpoint?: string | null
    recordId?: string | number | null
    title?: string
    emptyText?: string
  }>(),
  {
    endpoint: null,
    recordId: null,
    title: "",
    emptyText: "",
  },
)

/*
 * Judul dan pesan kosong diselesaikan **saat render**, bukan sebagai
 * default `withDefaults`.
 *
 * Default `withDefaults` dievaluasi sekali ketika modulnya dimuat —
 * sebelum plugin i18n terpasang, dan tidak pernah lagi sesudah itu.
 * Ditaruh di sana, teksnya akan berbahasa Inggris di kedua bahasa dan
 * tidak berubah waktu pengguna ganti bahasa, tanpa error apa pun.
 */
const historyTitle = computed(() =>
  props.title || translate("common.labels.history", "History"),
)

const historyEmptyText = computed(() =>
  props.emptyText
  || translate("common.state.noHistory", "No history for this record yet."),
)

const api = useApi()

const rows = ref<HistoryEntry[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

/*
| Endpoint di schema membawa placeholder yang namanya mengikuti
| modulnya (`{employee_id}`, `{id}`, …). Diganti apa adanya dengan id
| record yang sedang dibuka — menuntut satu nama tertentu berarti tiap
| modul harus menebak nama yang "benar", dan yang salah tebak mendarat
| di 404 tanpa pesan.
*/
const url = computed(() => {
  if (!props.endpoint || props.recordId === null || props.recordId === undefined)
    return null

  return props.endpoint.replace(
    /\{[^}]+\}/g,
    String(props.recordId),
  )
})

async function load() {
  if (!url.value) {
    rows.value = []

    return
  }

  loading.value = true
  error.value = null

  try {
    const response: any = await api.request(url.value, { method: "GET" })

    const payload = response?.data ?? response

    rows.value = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.results)
        ? payload.results
        : []
  }
  catch (caught) {
    error.value = apiErrorMessage(caught, translate("common.errors.loadHistory", "Failed to load history."))
    rows.value = []
  }
  finally {
    loading.value = false
  }
}

watch(url, load, { immediate: true })

defineExpose({ reload: load })

function formatValue(value: any) {
  if (value === null || value === undefined || value === "")
    return "—"

  if (typeof value === "boolean")
    return value ? "Ya" : "Tidak"

  return String(value)
}

function formatDate(value?: string | null) {
  if (!value)
    return ""

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime()))
    return String(value)

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ historyTitle }}</CardTitle>

      <CardDescription>
        Perubahan yang sudah diterapkan, terbaru di bawah.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div
        v-if="loading"
        class="py-8 text-center text-sm text-muted-foreground"
      >
        Memuat riwayat…
      </div>

      <div
        v-else-if="error"
        class="
          rounded-md border border-destructive/40 bg-destructive/5
          p-4 text-sm text-destructive
        "
      >
        {{ error }}
      </div>

      <div
        v-else-if="!rows.length"
        class="
          flex min-h-40 items-center justify-center rounded-md
          border border-dashed
        "
      >
        <p class="text-sm text-muted-foreground">
          {{ historyEmptyText }}
        </p>
      </div>

      <ol
        v-else
        class="relative space-y-6 border-l pl-6"
      >
        <li
          v-for="(row, index) in rows"
          :key="row.id ?? index"
          class="relative"
        >
          <span
            class="
              absolute -left-[1.6875rem] top-1.5 size-3 rounded-full
              border-2 border-background bg-primary
            "
          />

          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium">
              {{ row.type_label ?? row.type }}
            </span>

            <Badge
              v-if="row.document_number"
              variant="secondary"
              class="px-1.5 py-0 text-xs"
            >
              {{ row.document_number }}
            </Badge>

            <span class="text-xs text-muted-foreground">
              {{ formatDate(row.date) }}
            </span>
          </div>

          <p
            v-if="row.reason"
            class="mt-1 text-sm text-muted-foreground"
          >
            {{ row.reason }}
          </p>

          <div
            v-if="row.changes?.length"
            class="mt-2 space-y-1"
          >
            <div
              v-for="change in row.changes"
              :key="change.field ?? change.label"
              class="
                flex flex-wrap items-center gap-2 text-sm
              "
            >
              <span class="text-muted-foreground">
                {{ change.label ?? change.field }}:
              </span>

              <span class="line-through opacity-60">
                {{ formatValue(change.from) }}
              </span>

              <span class="text-muted-foreground">→</span>

              <span class="font-medium">
                {{ formatValue(change.to) }}
              </span>
            </div>
          </div>

          <p
            v-if="row.applied_by"
            class="mt-1 text-xs text-muted-foreground"
          >
            Diterapkan oleh {{ row.applied_by }}
          </p>
        </li>
      </ol>
    </CardContent>
  </Card>
</template>
