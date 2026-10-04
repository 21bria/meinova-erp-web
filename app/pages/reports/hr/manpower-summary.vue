<script setup lang="ts">
import ReportsHrManpowerSummaryPage from '@/modules/reports/hr/manpower-summary/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Manpower Summary',
  module: 'reports',
})

useHead({
  title: 'Manpower Summary',
})
</script>

<template>
  <ReportsHrManpowerSummaryPage />
</template>
