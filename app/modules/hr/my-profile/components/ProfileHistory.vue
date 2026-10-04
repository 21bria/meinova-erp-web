<script setup lang="ts">
import { useApi } from '@/composables/useApi'

/**
 * Riwayat kepegawaian — bentuknya sama dengan tab History di kartu
 * pegawai, dan endpoint-nya pun sama.
 *
 * **Isinya sudah disaring `EmployeeDataPolicy` di backend**
 * (`employment_timeline(..., viewer=request.user)`): perubahan gaji
 * dan alasan pengunduran diri hanya ikut kalau pembacanya memang
 * berhak. Yang tidak berhak tidak menerima barisnya sama sekali —
 * bukan baris bertanda "disembunyikan", karena penanda seperti itu
 * sudah memberi tahu bahwa ada kenaikan gaji, dan itu setengah dari
 * informasinya.
 */

const props = defineProps<{
  employeeId: number | string | null
}>()

const { request } = useApi()

const rows = ref<any[]>([])
const pending = ref(false)
const failed = ref(false)

async function load() {
  if (!props.employeeId)
    return

  pending.value = true
  failed.value = false

  try {
    const res = await request<any>(
      `/api/hr/employees/${props.employeeId}/employment-history/`,
    )

    rows.value = res?.data?.results ?? res?.results ?? []
  }
  catch {
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
      Belum ada riwayat.
    </p>

    <ol v-else class="space-y-4">
      <li
        v-for="(row, index) in rows"
        :key="index"
        class="
          relative border-l pl-5
          pb-4 last:pb-0
        "
      >
        <span
          class="
            absolute -left-[5px] top-1.5 h-2.5 w-2.5
            rounded-full bg-primary
          "
        />

        <div class="flex flex-wrap items-baseline gap-x-3">
          <span class="text-sm font-semibold">
            {{ row.type_label ?? '—' }}
          </span>

          <span class="text-xs text-muted-foreground">
            {{ row.date ?? '' }}
          </span>

          <span
            v-if="row.document_number"
            class="text-xs text-muted-foreground"
          >
            · {{ row.document_number }}
          </span>
        </div>

        <p
          v-if="row.reason"
          class="mt-1 text-sm text-muted-foreground"
        >
          {{ row.reason }}
        </p>

        <dl
          v-if="row.changes?.length"
          class="mt-2 grid gap-1 text-xs sm:grid-cols-2"
        >
          <div
            v-for="(change, ci) in row.changes"
            :key="ci"
            class="flex flex-wrap gap-x-2"
          >
            <dt class="text-muted-foreground">
              {{ change.label }}:
            </dt>

            <dd>
              <span class="text-muted-foreground line-through">
                {{ change.from ?? '—' }}
              </span>
              <span class="mx-1">→</span>
              <span class="font-medium">{{ change.to ?? '—' }}</span>
            </dd>
          </div>
        </dl>
      </li>
    </ol>
  </div>
</template>
