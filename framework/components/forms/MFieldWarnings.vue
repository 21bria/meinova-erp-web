<script setup lang="ts">
/*
| Peringatan konfigurasi dari backend (`widget: "warnings"` di schema).
|
| Bentuk nilainya sama dengan `schedule_warnings` Roster Schedule:
| daftar `{kind, message}` (string polos juga diterima). Teksnya dicari
| di `codes.<field>.<kind>`; `message` backend hanya cadangan untuk
| `kind` yang belum ada di katalog.
|
| **Bukan validasi.** Tidak menyentuh `errors` form dan tidak pernah
| menahan simpan — yang menolak, kalau ada, tetap backend.
*/
import { computed } from 'vue'

import { codeLabel } from '../../core/utils/i18n'

const props = defineProps<{
  fieldKey: string
  label?: string
  items?: unknown
}>()

const messages = computed(() => {
  const list = Array.isArray(props.items) ? props.items : []

  return list
    .map((item: any) => {
      if (typeof item === 'string')
        return item

      const kind = item?.kind ?? item?.code
      const message = item?.message ?? ''

      return kind ? codeLabel(props.fieldKey, String(kind), message) : message
    })
    .filter(Boolean)
})
</script>

<template>
  <div
    v-if="messages.length"
    role="status"
    class="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
  >
    <p v-if="label" class="mb-1 font-medium">
      {{ label }}
    </p>

    <ul class="space-y-1">
      <li v-for="(message, index) in messages" :key="index">
        {{ message }}
      </li>
    </ul>
  </div>
</template>
