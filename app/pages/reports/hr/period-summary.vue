<script setup lang="ts">
import ReportsHrPeriodSummaryPage from '@/modules/reports/hr/period-summary/page.vue'

definePageMeta({
  layout: 'default',
  title: 'HR Period Summary',
  module: 'reports',
})

useHead({
  title: 'HR Period Summary',
})
</script>

<template>
  <ReportsHrPeriodSummaryPage />
</template>
