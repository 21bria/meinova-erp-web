<script setup lang="ts">
/*
 * Rute **Absen Masuk** Self Service — halaman aksi, terpisah dari
 * laporan `/me/attendance`. Lihat catatan di `me/index.vue`.
 */
import PunchPage from '@/modules/self-service/attendance/punch-page.vue'

definePageMeta({ title: 'Check In' })
</script>

<template>
  <PunchPage />
</template>
