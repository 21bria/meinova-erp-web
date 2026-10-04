<script setup lang="ts">
import type { ShiftCalendarEmployee } from '../types'

import {
  MDateField,
  MDialog,
  MLookupField,
  MTextareaField,
  normalizeApiErrors,
} from '@framework'

import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'

/*
 * Membuat satu penyesuaian shift.
 *
 * Selalu berlapis `override` — lapisnya tidak ditawarkan sama sekali.
 * Baseline adalah rencana yang lahir bersama roster; membiarkan orang
 * menulisnya dari sini berarti dua jalur yang sama-sama mengaku sebagai
 * rencana, dan yang menang tinggal soal siapa yang menyimpan
 * belakangan. Yang butuh menyentuh baseline punya layarnya sendiri
 * (`/hr/shift-assignments`).
 *
 * Aturan validasinya **tidak disalin ke sini**. `reason` wajib,
 * `end_date` tidak boleh mendahului `start_date`, dan tumpang tindih
 * sesama lapis ditolak — ketiganya ditegakkan backend, dan pesannya
 * ditempel apa adanya ke kolomnya. Salinan kedua di frontend cepat atau
 * lambat berbeda dari yang pertama, dan yang paling berbahaya:
 * pemeriksaan tumpang tindih buatan sendiri akan memblokir override
 * yang menimpa baseline — persis penggunaan yang benar.
 */

const props = defineProps<{
  open: boolean
  employee: ShiftCalendarEmployee | null
  /** Tanggal awal, diisi dari sel yang diklik. */
  startDate: string
  endDate: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'saved'): void
}>()

const { request } = useApi()

const shiftId = ref<number | null>(null)
const start = ref('')
const end = ref('')
const reason = ref('')

const saving = ref(false)
const errors = ref<Record<string, any>>({})

const rangeDays = computed(() => {
  if (!start.value || !end.value)
    return 0

  const from = new Date(`${start.value}T00:00:00`).getTime()
  const to = new Date(`${end.value}T00:00:00`).getTime()

  if (Number.isNaN(from) || Number.isNaN(to) || to < from)
    return 0

  return Math.round((to - from) / 86_400_000) + 1
})

function fieldError(name: string): string | null {
  const value = errors.value?.[name]

  if (!value)
    return null

  return Array.isArray(value) ? String(value[0]) : String(value)
}

/*
 * `detail` adalah error yang tidak menempel ke kolom mana pun —
 * penolakan hak akses, misalnya. Ditampilkan di kepala form, bukan
 * cuma di-toast: toast hilang dalam empat detik sementara dialognya
 * masih terbuka dan pengguna masih menunggu tahu kenapa.
 */
const formError = computed(() => fieldError('detail'))

watch(
  () => props.open,
  (open) => {
    if (!open)
      return

    shiftId.value = null
    start.value = props.startDate
    end.value = props.endDate
    reason.value = ''
    errors.value = {}
  },
)

async function save() {
  if (!props.employee)
    return

  saving.value = true
  errors.value = {}

  try {
    await request('/api/hr/shift-assignments/', {
      method: 'POST',
      body: {
        employee: props.employee.id,
        shift: shiftId.value,
        layer: 'override',
        start_date: start.value,
        end_date: end.value,
        reason: reason.value,
      },
    })

    emit('saved')
    emit('update:open', false)
  }
  catch (caught: any) {
    errors.value = normalizeApiErrors(caught)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <MDialog
    :open="open"
    width="md"
    title="Adjust Shift"
    :description="
      employee
        ? `${employee.employee_number} — ${employee.name}`
        : undefined
    "
    @update:open="(value) => emit('update:open', value)"
  >
    <div class="space-y-4">
      <p
        v-if="formError"
        class="
          rounded-md border border-destructive/40 bg-destructive/10
          p-3 text-sm text-destructive
        "
      >
        {{ formError }}
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <MDateField
          v-model="start"
          label="Start Date"
          required
          :error="fieldError('start_date')"
        />

        <!--
          `hint` di sini **menimpa** contoh format bawaan `MDateField`,
          jadi contohnya ikut ditulis ulang. Tanpa itu kolom ini
          kehilangan satu-satunya petunjuk bahwa isiannya hari-dulu
          (`18.08.26`) — dan yang mengetik gaya ISO mendapat penolakan
          dari backend tanpa tahu apa yang salah.
        -->
        <MDateField
          v-model="end"
          label="End Date"
          required
          :error="fieldError('end_date')"
          :hint="
            rangeDays
              ? `${rangeDays} hari, termasuk tanggal awal dan akhir. `
                + `Contoh: 20.08.26`
              : 'Contoh: 20.08.26 menjadi 2026-08-20'
          "
        />
      </div>

      <MLookupField
        v-model="shiftId"
        label="Shift"
        endpoint="/api/administration/references/hr/lookup/shifts/"
        placeholder="Pilih shift"
        required
        :error="fieldError('shift')"
        hint="Jam kerjanya mengikuti master Shift."
      />

      <MTextareaField
        v-model="reason"
        label="Reason"
        :rows="3"
        required
        :error="fieldError('reason')"
        placeholder="Kenapa shift tanggal ini berbeda?"
        hint="Wajib — ini yang menjawab pertanyaan pegawainya nanti."
      />

      <p class="text-muted-foreground text-xs">
        Tanggal di luar rentang ini tetap memakai rencana semula.
        Menghapus adjustment mengembalikannya sendiri.
      </p>

      <div class="flex justify-end gap-2 border-t pt-4">
        <Button
          variant="outline"
          :disabled="saving"
          @click="emit('update:open', false)"
        >
          Batal
        </Button>

        <Button
          :disabled="saving"
          @click="save"
        >
          {{ saving ? 'Menyimpan…' : 'Simpan' }}
        </Button>
      </div>
    </div>
  </MDialog>
</template>
