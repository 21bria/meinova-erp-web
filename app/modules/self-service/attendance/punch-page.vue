<script setup lang="ts">
/**
 * **Absen Masuk** (`/me/attendance/punch`) — halaman aksi kehadiran.
 *
 * Dua niat pegawai dipisah sengaja (ATT-UX-1):
 *
 *   `/me/attendance/punch`  "saya mau absen sekarang"      ← halaman ini
 *   `/me/attendance`        "bagaimana kehadiran saya"      ← laporan
 *
 * Halaman ini **hanya** alur tap: lokasi → selfie → kirim → hasil. Tidak
 * ada ringkasan periode atau riwayat — itu milik laporan, yang ditautkan
 * di kepala halaman. Seluruh logika tap (ketersediaan, geolokasi,
 * unggah selfie, kirim, hasil) tetap di `AttendancePunchCard`; berkas ini
 * cuma bingkainya.
 */
import { CalendarDays } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import AttendancePunchCard from '../components/AttendancePunchCard.vue'
import { REPORT_ROUTE } from './punch'

const { t } = useI18n()
</script>

<template>
  <div class="mx-auto w-full max-w-xl space-y-4 p-4 sm:p-6">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('me.punch.title') }}
        </h1>

        <p class="text-sm text-muted-foreground">
          {{ t('me.punch.subtitle') }}
        </p>
      </div>

      <NuxtLink
        :to="REPORT_ROUTE"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        data-testid="punch-view-attendance"
      >
        <CalendarDays class="size-4" aria-hidden="true" />
        {{ t('me.punch.viewAttendance') }}
      </NuxtLink>
    </div>

    <AttendancePunchCard />
  </div>
</template>
