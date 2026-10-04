<script
  setup
  lang="ts"
  generic="
    TRow extends { id: string | number }
  "
>
/*
|--------------------------------------------------------------------------
| Tabel baris yang disunting langsung di tempat
|--------------------------------------------------------------------------
|
| Pasangan MWorkspaceResource, untuk data yang bentuk aslinya memang tabel
| jadwal: baris periode roster, baris travel arrangement. Dialog per baris
| salah bentuk di sana — menambah lima baris tanggal berarti membuka dan
| menutup lima modal, dan penggunanya tidak pernah bisa melihat kelima
| barisnya berdampingan padahal justru hubungan antarbarislah yang sedang
| dia periksa.
|
| Kolomnya = field schema yang bertanda `table: true`. Backend yang
| menentukan kolom mana yang muat, sama seperti di tabel biasa; field lain
| tetap ada di schema tapi tidak ditawarkan di sini.
|
| Menyimpannya sengaja per-tombol, bukan per-blur: satu baris jadwal baru
| sah setelah beberapa kolom terisi bersama (tanggal mulai DAN selesai),
| jadi menyimpan tiap kali kursor pindah akan menembakkan validasi
| setengah jadi ke server dan memerahkan baris yang sebenarnya sedang
| benar-benar diisi.
|
*/

import {
  computed,
  ref,
  watch,
} from "vue"

import { Button } from "@/components/ui/button"

import MDateField from "../../forms/MDateField.vue"
import MInputField from "../../forms/MInputField.vue"
import MLookupField from "../../forms/MLookupField.vue"
import MNumberField from "../../forms/MNumberField.vue"
import MSelectField from "../../forms/MSelectField.vue"
import MSwitchField from "../../forms/MSwitchField.vue"
import MTextareaField from "../../forms/MTextareaField.vue"

import type {
  FormField,
} from "../../../builders/forms/types"

type DraftRow = Record<string, any> & {
  id?: string | number
  __key: string
  __draft: boolean
}

const props = withDefaults(
  defineProps<{
    title: string
    description?: string

    rows?: TRow[]
    schema?: FormField[]

    loading?: boolean
    saving?: boolean

    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean

    /**
     * false = baris yang sudah tersimpan tidak punya tombol hapus;
     * draft yang belum disimpan tetap bisa dibuang (tidak menyentuh
     * server). Untuk tabel yang barisnya juga milik tab lain — tab
     * Accommodation Travel Request menampilkan etape perjalanan, dan
     * menghapus barisnya menghapus tiketnya juga.
     */
    canDeleteSaved?: boolean

    addLabel?: string
    emptyText?: string

    /**
     * Nilai yang ditanam ke setiap baris baru — id dokumen induk.
     * Tanpa ini baris draft lahir tanpa induk dan ditolak server.
     */
    parentField?: string
    parentId?: number | string | null

    /**
     * Error per baris, dikunci `id` untuk baris tersimpan dan `__key`
     * untuk draft.
     */
    errors?: Record<string, Record<string, any>> | null
  }>(),
  {
    description: "",
    rows: () => [] as TRow[],
    schema: () => [] as FormField[],
    loading: false,
    saving: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canDeleteSaved: true,
    addLabel: "Add Row",
    emptyText: "No rows yet.",
    parentField: "",
    parentId: null,
    errors: null,
  },
)

/*
| `done` dipanggil balik oleh induk setelah semua baris selesai
| dikirim, berisi `__key` baris yang GAGAL. Tanpa jalur balik ini
| komponen tidak pernah tahu draft mana yang sudah jadi baris server,
| jadi draft-nya tetap tinggal di `working` sementara versi
| tersimpannya masuk lewat `props.rows` — dan itulah satu-satunya
| sebab tabel berlipat setelah "Save Rows".
*/
const emit = defineEmits<{
  save: [
    rows: Record<string, any>[],
    done: (failedKeys: string[]) => void,
  ]
  delete: [row: TRow]
}>()

/*
|--------------------------------------------------------------------------
| Kolom
|--------------------------------------------------------------------------
*/

const columns = computed<FormField[]>(() => {
  return props.schema.filter((field) => {
    return (field as any).table === true
  })
})

/*
| Dropdown lookup dirender `absolute`, bukan diteleport ke body, jadi
| pembungkus bergulir horizontal di bawah ini ikut memotongnya — CSS
| memaksa `overflow-y` jadi auto begitu `overflow-x` auto, tidak bisa
| dibiarkan visible sebelah. Ruang bawah disediakan hanya kalau memang
| ada kolom lookup, supaya tabel tanpa lookup tidak menyisakan area
| kosong yang tak berguna. Ukurannya mengikuti tinggi maksimum dropdown
| (kotak cari + daftar 180px).
*/
const needsDropdownRoom = computed(() => {
  return columns.value.some((field) => {
    return field.type === "lookup"
  })
})

/*
|--------------------------------------------------------------------------
| Baris kerja
|--------------------------------------------------------------------------
|
| Salinan lokal, bukan props langsung: baris yang sedang diketik tidak
| boleh hilang gara-gara daftar induknya kebetulan me-refetch.
|
*/

const draftSeq = ref(0)

const working = ref<DraftRow[]>([])

const dirty = ref<Set<string>>(new Set())

/*
| Baris yang ditolak server pada penyimpanan terakhir. Isinya dijaga
| apa adanya saat daftar ditarik ulang: mengganti baris yang gagal
| dengan versi server berarti membuang isian yang sedang diperbaiki
| penggunanya, tepat di saat pesan errornya baru muncul.
*/
const failed = ref<Set<string>>(new Set())

function keyOf(row: DraftRow): string {
  return row.__key
}

function adopt(rows: TRow[]): DraftRow[] {
  return rows.map((row) => {
    const key = `saved-${(row as any).id}`

    if (failed.value.has(key)) {
      const kept = working.value.find(
        item => item.__key === key,
      )

      if (kept)
        return kept
    }

    const adopted: DraftRow = {
      ...(row as Record<string, any>),
      __key: key,
      __draft: false,
    }

    // Id induk ditanam juga pada baris yang sudah tersimpan, bukan cuma
    // draft: field lookup di dalam baris menyaring pilihannya lewat
    // `$<parentField>`, dan tanpa ini dropdown pada baris lama tampil
    // tanpa saringan sementara baris baru tersaring — beda perilaku di
    // tabel yang sama.
    if (props.parentField && props.parentId != null) {
      adopted[props.parentField] = props.parentId
    }

    return adopted
  })
}

watch(
  () => props.rows,
  (rows) => {
    const drafts = working.value.filter(
      row => row.__draft,
    )

    working.value = [
      ...adopt(rows ?? []),
      ...drafts,
    ]

    // Baris tersimpan yang barusan dikirim tidak lagi kotor; draft yang
    // belum pernah dikirim tetap kotor supaya tidak hilang dari
    // antrean, begitu juga baris yang ditolak server — antreannya belum
    // benar-benar kosong selama masih ada yang gagal.
    dirty.value = new Set(
      [...dirty.value].filter(
        key =>
          key.startsWith("draft-")
          || failed.value.has(key),
      ),
    )
  },
  {
    immediate: true,
    deep: false,
  },
)

const hasDirty = computed(() => {
  return dirty.value.size > 0
})

function markDirty(row: DraftRow) {
  dirty.value = new Set(dirty.value).add(
    keyOf(row),
  )
}

/*
|--------------------------------------------------------------------------
| Kolom turunan
|--------------------------------------------------------------------------
|
| Field boleh membawa `compute` dari schema backend, mis.
|
|     compute: {kind: "date_diff", from: "start_date",
|               to: "end_date", inclusive: true}
|
| Rumusnya dideklarasikan backend, bukan ditanam di komponen ini: tabel
| inline dipakai resource mana pun, dan begitu satu rumus dihardcode di
| sini resource berikutnya akan ikut kena rumus yang bukan miliknya.
|
| Perlu dihitung di sisi klien walau service juga menghitungnya, karena
| baris di grid selalu membawa nilai lamanya — dan service menghormati
| `total_days` yang dikirim sebagai isian manual. Tanpa perhitungan
| ulang di sini, mengubah tanggal akan menyimpan jumlah hari yang lama
| tanpa pesan kesalahan apa pun.
|
*/

function parseDate(value: any): Date | null {
  if (!value)
    return null

  const parsed = new Date(String(value))

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed
}

function computeValue(
  row: DraftRow,
  field: FormField,
): number | null {
  const spec = (field as any).compute

  if (!spec || spec.kind !== "date_diff")
    return null

  const from = parseDate(row[spec.from])
  const to = parseDate(row[spec.to])

  if (!from || !to)
    return null

  const days = Math.round(
    (to.getTime() - from.getTime())
    / 86_400_000,
  )

  const total = spec.inclusive
    ? days + 1
    : days

  // Rentang terbalik bukan urusan kolom ini — biarkan validasi tanggal
  // yang bicara, jangan tampilkan angka negatif yang membingungkan.
  return total < 0
    ? null
    : total
}

function applyComputed(
  row: DraftRow,
  changed: string,
) {
  for (const field of props.schema) {
    const spec = (field as any).compute

    if (!spec || spec.kind !== "date_diff")
      continue

    if (
      spec.from !== changed
      && spec.to !== changed
    ) {
      continue
    }

    const next = computeValue(row, field)

    if (next !== null)
      row[field.key] = next
  }
}

function update(
  row: DraftRow,
  field: string,
  value: any,
) {
  row[field] = value

  applyComputed(row, field)

  markDirty(row)
}

function addRow() {
  draftSeq.value += 1

  const row: DraftRow = {
    __key: `draft-${draftSeq.value}`,
    __draft: true,
  }

  if (props.parentField && props.parentId != null) {
    row[props.parentField] = props.parentId
  }

  // Nilai bawaan dari schema supaya kolom pilihan tidak lahir kosong
  // dan memaksa penggunanya memilih ulang hal yang sudah jelas.
  for (const field of props.schema) {
    const fallback = (field as any).default

    if (
      fallback !== undefined
      && fallback !== null
    ) {
      row[field.key] = fallback
    }
  }

  working.value = [
    ...working.value,
    row,
  ]

  markDirty(row)
}

function removeRow(row: DraftRow) {
  if (row.__draft) {
    working.value = working.value.filter(
      item => keyOf(item) !== keyOf(row),
    )

    const next = new Set(dirty.value)
    next.delete(keyOf(row))
    dirty.value = next

    return
  }

  if (!props.canDeleteSaved)
    return

  emit("delete", row as unknown as TRow)
}

function save() {
  const payload = working.value
    .filter(row => dirty.value.has(keyOf(row)))
    .map((row) => {
      const clean: Record<string, any> = {}

      for (const [key, value] of Object.entries(row)) {
        if (key.startsWith("__"))
          continue

        clean[key] = value
      }

      return {
        ...clean,
        __key: row.__key,
        __draft: row.__draft,
      }
    })

  if (!payload.length)
    return

  emit("save", payload, (failedKeys) => {
    failed.value = new Set(failedKeys)

    // Draft yang berhasil dibuang di sini, sebelum induk menarik ulang
    // daftarnya. Versi servernya masuk sebentar lagi lewat
    // `props.rows`; membiarkan draft-nya hidup berarti baris yang sama
    // tampil dua kali.
    working.value = working.value.filter(
      row =>
        !row.__draft
        || failed.value.has(row.__key),
    )

    dirty.value = new Set(
      [...dirty.value].filter(
        key => failed.value.has(key),
      ),
    )
  })
}

/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

function rowErrors(
  row: DraftRow,
): Record<string, any> {
  const bag = props.errors ?? {}

  const byId =
    row.id != null
      ? bag[String(row.id)]
      : undefined

  return byId ?? bag[row.__key] ?? {}
}

function fieldError(
  row: DraftRow,
  field: string,
): string | null {
  const value = rowErrors(row)[field]

  if (!value)
    return null

  return Array.isArray(value)
    ? String(value[0])
    : String(value)
}

/**
 * Error yang tidak menempel ke kolom mana pun.
 *
 * Penolakan hak akses, bentrokan tanggal, dan 404 tidak punya nama
 * field, jadi sebelumnya **tidak muncul di mana pun**: barisnya gagal
 * disimpan, tetap berwarna "belum tersimpan", dan tidak ada satu pun
 * kalimat yang menjelaskan kenapa. Grid inline adalah satu-satunya
 * tempat menyunting untuk beberapa resource, jadi diam di sini berarti
 * pengguna menekan Save berulang kali tanpa tahu apa yang salah.
 */
function rowMessage(row: DraftRow): string | null {
  const bag = rowErrors(row)

  const value =
    bag.detail
    ?? bag.non_field_errors
    ?? bag.message

  if (!value)
    return null

  return Array.isArray(value)
    ? String(value[0])
    : String(value)
}

function resolveDepends(
  row: DraftRow,
  field: FormField,
): Record<string, any> {
  const result: Record<string, any> = {}

  for (
    const [param, raw]
    of Object.entries(field.lookupParams ?? {})
  ) {
    if (
      typeof raw === "string"
      && raw.startsWith("$")
    ) {
      const value = row[raw.slice(1)]

      if (
        value !== undefined
        && value !== null
        && value !== ""
      ) {
        result[param] = value
      }

      continue
    }

    result[param] = raw
  }

  return result
}

function selectedLabel(
  row: DraftRow,
  field: FormField,
): string | null {
  const key =
    (field as any).displayKey
    ?? (field as any).display_key

  if (!key)
    return null

  return row[key] ?? null
}

function isDisabled(field: FormField): boolean {
  return Boolean(
    props.saving
    || !props.canEdit
    || (field as any).disabled,
  )
}
</script>

<template>
  <Card>
    <CardHeader
      class="
        flex flex-row items-start
        justify-between gap-4
      "
    >
      <div>
        <CardTitle>
          {{ props.title }}
        </CardTitle>

        <CardDescription
          v-if="props.description"
        >
          {{ props.description }}
        </CardDescription>
      </div>

      <div class="flex items-center gap-2">
        <Button
          v-if="props.canCreate"
          type="button"
          size="sm"
          variant="outline"
          :disabled="props.loading || props.saving"
          @click="addRow"
        >
          {{ props.addLabel }}
        </Button>

        <Button
          type="button"
          size="sm"
          :disabled="
            !hasDirty
            || props.saving
            || props.loading
          "
          @click="save"
        >
          {{ props.saving ? "Saving…" : "Save Rows" }}
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <div
        class="w-full overflow-x-auto"
        :class="
          needsDropdownRoom
            ? 'pb-64'
            : ''
        "
      >
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b">
              <th
                v-for="column in columns"
                :key="column.key"
                class="
                  whitespace-nowrap px-2 py-2
                  text-left align-bottom
                  text-xs font-medium
                  text-muted-foreground
                "
              >
                {{ column.label }}
                <span
                  v-if="column.required"
                  class="text-destructive"
                >*</span>
              </th>

              <th
                v-if="props.canDelete"
                class="w-10 px-2 py-2"
              />
            </tr>
          </thead>

          <tbody>
            <template
              v-for="row in working"
              :key="row.__key"
            >
            <tr
              class="align-top"
              :class="[
                dirty.has(row.__key) ? 'bg-muted/40' : '',
                rowMessage(row) ? '' : 'border-b',
              ]"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="min-w-40 px-2 py-1"
              >
                <MLookupField
                  v-if="column.type === 'lookup'"
                  :model-value="row[column.key]"
                  :endpoint="column.endpoint ?? ''"
                  :placeholder="column.placeholder"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  :depends="resolveDepends(row, column)"
                  :selected-label="
                    selectedLabel(row, column)
                  "
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />

                <MSelectField
                  v-else-if="column.type === 'select'"
                  :model-value="row[column.key]"
                  :options="column.options ?? []"
                  :placeholder="column.placeholder"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />

                <MDateField
                  v-else-if="column.type === 'date'"
                  :model-value="row[column.key]"
                  :placeholder="column.placeholder"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  hint=""
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />

                <MSwitchField
                  v-else-if="
                    column.type === 'switch'
                    || column.type === 'boolean'
                  "
                  :model-value="Boolean(row[column.key])"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />

                <MNumberField
                  v-else-if="
                    column.type === 'integer'
                    || column.type === 'number'
                    || column.type === 'decimal'
                  "
                  :model-value="row[column.key]"
                  :placeholder="column.placeholder"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />

                <MTextareaField
                  v-else-if="column.type === 'textarea'"
                  :model-value="row[column.key]"
                  :rows="2"
                  :placeholder="column.placeholder"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />

                <MInputField
                  v-else
                  :model-value="row[column.key]"
                  :placeholder="column.placeholder"
                  :disabled="isDisabled(column)"
                  :error="fieldError(row, column.key)"
                  @update:model-value="
                    update(row, column.key, $event)
                  "
                />
              </td>

              <td
                v-if="props.canDelete"
                class="px-2 py-1"
              >
                <Button
                  v-if="row.__draft || props.canDeleteSaved"
                  type="button"
                  size="icon"
                  variant="ghost"
                  :disabled="props.saving"
                  @click="removeRow(row)"
                >
                  <Icon
                    name="i-lucide-trash-2"
                    class="size-4"
                  />
                </Button>
              </td>
            </tr>

            <tr v-if="rowMessage(row)">
              <td
                :colspan="
                  columns.length
                    + (props.canDelete ? 1 : 0)
                "
                class="border-b px-2 pb-2 text-sm text-destructive"
              >
                {{ rowMessage(row) }}
              </td>
            </tr>
            </template>

            <tr v-if="!working.length">
              <td
                :colspan="
                  columns.length
                    + (props.canDelete ? 1 : 0)
                "
                class="
                  px-2 py-8 text-center text-sm
                  text-muted-foreground
                "
              >
                {{ props.emptyText }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
