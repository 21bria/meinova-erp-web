<script
  setup
  lang="ts"
  generic="
    TRow extends { id: string | number },
    TPayload extends Record<string, any>
  "
>
/*
|--------------------------------------------------------------------------
| Tab resource bermode inline
|--------------------------------------------------------------------------
|
| Pasangan WorkspaceResource untuk tab yang ditandai `inline` di schema.
| Barisnya disunting langsung di tabel; dialog per baris tidak dipakai.
|
| Menyimpan dilakukan baris demi baris berurutan, bukan satu request
| massal: endpoint-nya CRUD biasa, dan baris yang ditolak validasi harus
| bisa ditunjuk satu per satu — kalau dikirim sekaligus, satu tanggal
| salah akan menggagalkan seluruh tabel tanpa memberi tahu baris mana.
|
| Penarikan ulang daftarnya ditunda sampai baris terakhir selesai
| (`refresh: false`), lalu dijalankan sekali. Menarik ulang per baris
| membuat daftar sempat berisi campuran baris server yang sudah jadi
| dan draft lokal yang belum dibuang — dan itu yang tampil sebagai
| baris berlipat.
|
*/

import {
  ref,
} from "vue"

import type {
  FormField,
} from "@framework"

import {
  MWorkspaceResourceInline,
  normalizeApiErrors,
  useWorkspaceResource,
} from "@framework"

const props = defineProps<{
  title: string
  endpoint: string

  parentField: string
  parentId?: number | string | null

  schema: FormField[]

  addLabel?: string
  canCreate?: boolean

  // Tab dikunci (`readonlyWhen` terpenuhi): baris dibaca saja.
  readonly?: boolean

  // false = baris tersimpan tidak bisa dihapus dari tab ini.
  canDelete?: boolean

  // Teks bantu singkat di kepala tabel (sudah diterjemahkan).
  description?: string
}>()

const resource = useWorkspaceResource<
  TRow,
  TPayload
>({
  endpoint: () => props.endpoint,
  parentKey: props.parentField,
  parentId: () => props.parentId,
  immediate: true,
})

/*
| Error dikumpulkan per baris. `resource.errors` cuma menyimpan kegagalan
| terakhir, sedangkan di sini beberapa baris bisa gagal sekaligus.
*/
const rowErrors = ref<
  Record<string, Record<string, any>>
>({})

async function handleSave(
  rows: Record<string, any>[],
  done: (failedKeys: string[]) => void,
) {
  const collected: Record<
    string,
    Record<string, any>
  > = {}

  const failedKeys: string[] = []

  for (const row of rows) {
    const key = String(row.__key)
    const isDraft = row.__draft === true

    const payload: Record<string, any> = {}

    for (const [field, value] of Object.entries(row)) {
      if (field.startsWith("__"))
        continue

      if (field === "id")
        continue

      payload[field] = value
    }

    try {
      if (isDraft) {
        await resource.create(
          payload as TPayload,
          { refresh: false },
        )
      }
      else {
        await resource.update(
          row.id,
          payload as TPayload,
          { refresh: false },
        )
      }
    }
    catch (error) {
      collected[key] =
        normalizeApiErrors(error) ?? {}

      failedKeys.push(key)
    }
  }

  rowErrors.value = collected

  // Urutannya penting: draft yang sukses dibuang lebih dulu, baru
  // daftarnya ditarik ulang. Terbalik, dan tabel sempat menampilkan
  // baris yang sama dua kali selama satu frame.
  done(failedKeys)

  await resource.fetchRows()
}

async function handleDelete(
  row: any,
) {
  resource.askDelete(row as TRow)

  await resource.confirmDelete()
}
</script>

<template>
  <MWorkspaceResourceInline
    :title="props.title"
    :description="props.description ?? ''"
    :rows="resource.rows.value"
    :schema="props.schema"
    :loading="resource.pending.value"
    :saving="resource.saving.value"
    :parent-field="props.parentField"
    :parent-id="props.parentId"
    :can-create="props.canCreate !== false && !props.readonly"
    :can-edit="!props.readonly"
    :can-delete="!props.readonly"
    :can-delete-saved="props.canDelete !== false"
    :errors="rowErrors"
    :add-label="props.addLabel ?? 'Add Row'"
    @save="handleSave"
    @delete="handleDelete"
  />
</template>
