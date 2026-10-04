<script setup lang="ts">
import type { ShiftCalendarDay } from '../types'

import { MDialog } from '@framework'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

/*
 * Rincian satu tanggal.
 *
 * Seluruh isinya dibacakan dari sel yang dikirim backend — tidak ada
 * satu nilai pun yang dirakit ulang di sini, termasuk label jamnya.
 * Yang ditambahkan cuma dua tombol, dan keduanya cuma meneruskan
 * tanggalnya ke pemanggil.
 */

const props = defineProps<{
  open: boolean
  day: ShiftCalendarDay | null
  /** Nama pegawai, untuk kepala dialog. Datang dari respons. */
  employeeName?: string
  canAdjust?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'adjust', day: ShiftCalendarDay): void
  (e: 'removeOverride', day: ShiftCalendarDay): void
}>()

/*
 * Cadangan saja. Sebutan yang dipakai datang dari `shift_source_label`
 * milik respons — sama seperti `rotation_state_label`. Dua daftar
 * istilah untuk satu nilai adalah dua daftar yang harus dijaga tetap
 * sama, dan yang di frontend selalu yang ketinggalan.
 *
 * Yang **tidak** boleh muncul di sini: "baseline" dan "override". Itu
 * nama lapis di tabel; pengguna HR menyusun roster, bukan lapisan.
 */
const SOURCE_FALLBACK: Record<string, string> = {
  override: 'Adjustment',
  baseline: 'Roster',
  employment: 'Employee Default',
  work_schedule: 'Work Schedule',
}

const dateLabel = computed(() => {
  if (!props.day)
    return ''

  return new Date(`${props.day.date}T00:00:00`).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const sourceLabel = computed(() => {
  const source = props.day?.shift_source

  if (!source)
    return '—'

  return props.day?.shift_source_label
    || SOURCE_FALLBACK[source]
    || source
})

/*
 * Hari kerja yang masternya belum menyebut jam kerjanya. Dibedakan dari
 * hari libur: yang ini lubang data, dan diam-diam merendernya kosong
 * adalah persis cara lubang itu tidak pernah diperbaiki.
 */
const missingShift = computed(
  () => Boolean(props.day?.is_scheduled && !props.day?.shift_code),
)
</script>

<template>
  <MDialog
    :open="open"
    width="md"
    :title="dateLabel"
    :description="employeeName"
    @update:open="(value) => emit('update:open', value)"
  >
    <div
      v-if="day"
      class="space-y-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {{ day.rotation_state_label }}
        </Badge>

        <Badge
          v-if="day.is_override"
          class="bg-primary/15 text-primary border-transparent"
        >
          Adjustment
        </Badge>

        <Badge
          v-if="day.crosses_midnight"
          variant="outline"
        >
          Lewat tengah malam
        </Badge>
      </div>

      <div
        v-if="missingShift"
        class="
          rounded-md border border-dashed border-orange-500/50
          bg-orange-500/5 p-3 text-sm
          text-orange-700
          dark:text-orange-300
        "
      >
        <p class="font-medium">
          Belum ada shift
        </p>
        <p class="mt-1 text-xs">
          Tanggal ini hari kerja menurut roster, tapi shift normalnya
          belum ditetapkan — jadi tidak ada jam yang bisa dipakai
          menghitung keterlambatan. Isi urutan perputaran shift di
          <span class="font-medium">Roster Policy → Shift Rotation</span>,
          lalu jalankan
          <span class="font-medium">Generate Shift Baseline</span> di
          dokumen rosternya.
        </p>
      </div>

      <dl class="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-muted-foreground text-xs">
            Rotation State
          </dt>
          <dd class="mt-0.5 font-medium">
            {{ day.rotation_state_label }}
          </dd>
        </div>

        <div>
          <dt class="text-muted-foreground text-xs">
            Kewajiban presensi
          </dt>
          <dd class="mt-0.5 font-medium">
            {{ day.is_scheduled ? 'Ya' : 'Tidak' }}
          </dd>
        </div>

        <div>
          <dt class="text-muted-foreground text-xs">
            Shift
          </dt>
          <dd class="mt-0.5 font-medium">
            <template v-if="day.shift_code">
              {{ day.shift_code }}
              <span class="text-muted-foreground font-normal">
                — {{ day.shift_name }}
              </span>
            </template>
            <template v-else>
              —
            </template>
          </dd>
        </div>

        <div>
          <dt class="text-muted-foreground text-xs">
            Shift Source
          </dt>
          <dd class="mt-0.5 font-medium">
            {{ sourceLabel }}
          </dd>
        </div>

        <!--
          Alasan penyesuaian, dan tempatnya memang di sini. "Kenapa
          shift saya diubah" ditanyakan orangnya, bukan oleh yang
          mengubahnya — jawabannya sudah wajib diisi saat penyesuaian
          dibuat, jadi menyembunyikannya membuat kewajiban itu
          sia-sia. Barisnya berdiri hanya kalau ada isinya.
        -->
        <div
          v-if="day.assignment_reason"
          class="sm:col-span-2"
        >
          <dt class="text-muted-foreground text-xs">
            Adjustment Reason
          </dt>
          <dd class="mt-0.5 font-medium">
            {{ day.assignment_reason }}
          </dd>
        </div>

        <div>
          <dt class="text-muted-foreground text-xs">
            Scheduled Start
          </dt>
          <dd class="mt-0.5 font-medium tabular-nums">
            {{ day.scheduled_start ?? '—' }}
          </dd>
        </div>

        <div>
          <dt class="text-muted-foreground text-xs">
            Scheduled End
          </dt>
          <dd class="mt-0.5 font-medium tabular-nums">
            {{ day.scheduled_end ?? '—' }}
            <span
              v-if="day.crosses_midnight"
              class="text-muted-foreground font-normal"
            >
              (hari berikutnya)
            </span>
          </dd>
        </div>

        <div class="sm:col-span-2">
          <dt class="text-muted-foreground text-xs">
            Jendela terjadwal
          </dt>
          <dd class="mt-0.5 font-medium tabular-nums">
            {{ day.scheduled_label || '—' }}
          </dd>
        </div>

        <div v-if="day.assignment_id != null">
          <dt class="text-muted-foreground text-xs">
            Assignment
          </dt>
          <dd class="mt-0.5 font-medium tabular-nums">
            #{{ day.assignment_id }}
          </dd>
        </div>
      </dl>

      <div
        v-if="canAdjust"
        class="flex flex-wrap gap-2 border-t pt-4"
      >
        <!--
          Adjustment hanya ditawarkan pada tanggal yang memang hari
          kerja. Bukan aturan karangan frontend: pada tanggal off
          backend tidak membaca penugasan shift sama sekali, jadi
          override di sana tersimpan tanpa mengubah apa pun — tombol
          yang hasilnya tidak terlihat lebih buruk daripada tombol yang
          tidak ada.
        -->
        <Button
          v-if="day.is_scheduled"
          size="sm"
          @click="emit('adjust', day)"
        >
          Adjust Shift
        </Button>

        <Button
          v-if="day.is_override && day.assignment_id != null"
          size="sm"
          variant="outline"
          @click="emit('removeOverride', day)"
        >
          Hapus adjustment
        </Button>

        <p
          v-if="!day.is_scheduled"
          class="text-muted-foreground text-xs"
        >
          Tanggal ini bukan hari kerja, jadi tidak ada shift yang bisa
          disesuaikan.
        </p>
      </div>
    </div>
  </MDialog>
</template>
