<script setup lang="ts">
import type { SelfDateRange } from '../types'

import type { PresetCode } from './presets'
/**
 * **Kehadiran Saya** (`/me/attendance`) — presensi per periode.
 *
 * Pembedaannya dengan tetangganya dijaga sengaja:
 *
 *   `/me`             "bagaimana hari kerja saya hari ini"
 *   `/me/attendance`  "bagaimana kehadiran saya sepanjang periode ini"
 *   `/hr/attendance`  meja administratif — **bukan** halaman ini
 *
 * Yang ketiga itu yang membuat halaman ini ada. `/hr/attendance`
 * menerima `?employee=`, menampilkan kolom keputusan HR, dan barisnya
 * baru tersaring ke pemiliknya lewat cakupan data — jalan yang benar
 * untuk admin dan jalan yang salah untuk orang yang cuma ingin melihat
 * presensinya sendiri.
 *
 * **Satu permintaan per perubahan.** Rentang dan halaman dikirim sebagai
 * query; yang menyaring, mengurutkan, dan memotong PostgreSQL. Halaman
 * ini tidak pernah memegang lebih dari satu halaman baris, dan tidak
 * pernah menghitung ulang satu pun aturan kehadiran.
 */
import { useI18n } from 'vue-i18n'

import AttendanceDayStrip from '../components/AttendanceDayStrip.vue'
import AttendanceHistoryTable from '../components/AttendanceHistoryTable.vue'
import AttendanceRangeBar from '../components/AttendanceRangeBar.vue'
import AttendanceSummaryCards from '../components/AttendanceSummaryCards.vue'
import SelfStateView from '../components/SelfStateView.vue'
import { useSelfAttendance } from '../composables/useSelfAttendance'
import { matchPreset, presetRange } from './presets'

const { t } = useI18n()

const { data, meta, pending, error, load } = useSelfAttendance()

/*
 * Rentang yang sedang berlaku.
 *
 * `null` sampai balasan pertama datang — bawaannya tujuh hari, dan yang
 * memutuskan itu backend. Menuliskan "tujuh" juga di sini berarti dua
 * tempat yang harus tetap sepakat tentang hal yang sama.
 */
const range = ref<SelfDateRange | null>(null)

const pageSize = ref<number | undefined>()

const preset = computed<PresetCode>(() =>
  range.value ? matchPreset(range.value) : 'last7',
)

async function show(next: SelfDateRange | null, page = 1) {
  await load(next ?? undefined, page, pageSize.value)

  // Rentang yang dipakai selanjutnya diambil dari **balasan**, bukan
  // dari yang dikirim: backend yang memvalidasi batasnya, dan kalau ia
  // pernah menormalkan sesuatu, layar harus ikut yang benar-benar
  // dijawab.
  if (data.value) {
    range.value = {
      date_from: data.value.range.date_from,
      date_to: data.value.range.date_to,
    }
  }
}

function choosePreset(code: PresetCode) {
  show(presetRange(code))
}

function changePageSize(size: number) {
  pageSize.value = size

  // Kembali ke halaman satu. Halaman 5 dari 10 baris tidak punya
  // padanan yang bermakna saat ukurannya jadi 50, dan mendarat di
  // halaman kosong terbaca seperti data yang hilang.
  show(range.value, 1)
}

onMounted(() => show(null))
</script>

<template>
  <div class="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ t('me.attendance.title') }}
      </h1>

      <p class="text-sm text-muted-foreground">
        {{ t('me.attendance.subtitle') }}
      </p>
    </div>

    <SelfStateView
      v-if="!data && (pending || error)"
      :pending="pending"
      :code="error?.code ?? null"
      @retry="show(range)"
    />

    <template v-if="data && meta">
      <AttendanceRangeBar
        :range="data.range"
        :preset="preset"
        :busy="pending"
        @pick="value => show(value)"
        @preset="choosePreset"
      />

      <!--
        `aria-busy` alih-alih menyembunyikan isinya saat memuat: angka
        yang berkedip hilang tiap kali panah ditekan membuat periode yang
        sedang dibandingkan lenyap dari layar persis saat dibutuhkan.
        Yang berubah cuma opasitasnya.
      -->
      <div
        class="space-y-4 transition-opacity"
        :class="pending ? 'opacity-60' : ''"
        :aria-busy="pending"
      >
        <AttendanceSummaryCards :summary="data.summary" />

        <AttendanceDayStrip :days="data.daily" />

        <AttendanceHistoryTable
          :rows="data.history"
          :meta="meta"
          :page-sizes="data.range.page_sizes"
          :busy="pending"
          @page="value => show(range, value)"
          @page-size="changePageSize"
        />
      </div>
    </template>
  </div>
</template>
