<script setup lang="ts">
import { useApi } from '@/composables/useApi'

import type { ProfileField } from '../composables/useMyProfile'

/**
 * Tabel read-only untuk sub-resource kartu pegawai (rekening,
 * pendidikan, keluarga, dokumen, …).
 *
 * **Barisnya tersaring di backend, bukan di sini.** Kesembilan viewset
 * sub-resource sekarang membawa `data_scope` dengan kunci `own`
 * (`employee__user_id`), jadi pegawai biasa hanya menerima barisnya
 * sendiri walau `employee` di query string diganti. Penyaring di
 * bawah cuma supaya permintaannya menyempit sejak awal — ia **bukan**
 * penjagaan, dan tidak boleh diperlakukan sebagai penjagaan.
 */

const props = defineProps<{
  endpoint: string
  employeeId: number | string | null
  fields: ProfileField[]
}>()

const { request } = useApi()

const rows = ref<any[]>([])
const pending = ref(false)
const failed = ref(false)

/**
 * Kolom dibatasi enam.
 *
 * Tab resource membawa **seluruh** config field-nya, dan sebagian
 * punya belasan kolom — di layar pegawai itu berarti tabel yang harus
 * digulir ke samping hanya untuk membaca satu baris. Yang dibuang
 * kolom paling kanan, yang memang paling jarang dicari.
 */
const columns = computed(() =>
  props.fields
    .filter(f => !f.hidden && f.key !== 'employee')
    .slice(0, 6),
)

function cell(row: Record<string, any>, field: ProfileField): string {
  const raw
    = (field.displayKey ? row[field.displayKey] : undefined)
      ?? (field.type === 'lookup' ? row[`${field.key}_name`] : undefined)
      ?? row[field.key]

  if (raw === null || raw === undefined || raw === '')
    return '—'

  if (typeof raw === 'boolean')
    return raw ? 'Ya' : 'Tidak'

  if (typeof raw === 'object')
    return String((raw as any).name ?? (raw as any).label ?? '—')

  return String(raw)
}

async function load() {
  if (!props.employeeId)
    return

  pending.value = true
  failed.value = false

  try {
    const res = await request<any>(props.endpoint, {
      query: { employee: props.employeeId, page_size: 50 },
    })

    rows.value = res?.data ?? res?.results ?? []
  }
  catch {
    // Satu tab yang gagal tidak boleh menjatuhkan seluruh halaman —
    // sisanya tetap terbaca, dan yang gagal mengatakannya sendiri.
    failed.value = true
    rows.value = []
  }
  finally {
    pending.value = false
  }
}

onMounted(load)

watch(() => props.employeeId, load)
</script>

<template>
  <div>
    <p v-if="pending" class="text-sm text-muted-foreground">
      Memuat…
    </p>

    <p v-else-if="failed" class="text-sm text-destructive">
      Bagian ini gagal dimuat. Coba muat ulang halaman.
    </p>

    <p v-else-if="!rows.length" class="text-sm text-muted-foreground">
      Belum ada data.
    </p>

    <!--
    | Tabelnya bergulir di dalam wadahnya sendiri. Tanpa ini badan
    | halaman yang ikut bergulir ke samping, dan seluruh layar bergeser
    | hanya karena satu tabel kelebaran.
    -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b text-left">
            <th
              v-for="col in columns"
              :key="col.key"
              class="
                px-3 py-2 text-xs font-medium
                text-muted-foreground whitespace-nowrap
              "
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="row.id ?? index"
            class="border-b last:border-0"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-3 py-2 align-top"
            >
              {{ cell(row, col) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
