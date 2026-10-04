<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  hrAttendanceLeaveCategories,
  hrAttendanceLeaveItems,
} from '~/registry/section-hub/hr-attendance-leave'

definePageMeta({
  title: 'Attendance & Leave',
  module: 'hr',
})

useHead({
  title: 'Attendance & Leave',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="Attendance & Leave"
      description="Presensi harian, lembur, dan seluruh urusan cuti."
      search-placeholder="Cari layar"
      all-category-label="All Screens"
      item-noun="screen"
      item-noun-plural="screens"
      empty-title="Tidak ada layar yang cocok"
      empty-description="Coba kata lain, atau pilih kategori yang berbeda."
      :categories="hrAttendanceLeaveCategories"
      :items="hrAttendanceLeaveItems"
    />
  </div>
</template>
