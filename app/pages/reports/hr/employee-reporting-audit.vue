<script setup lang="ts">
import ReportsHrEmployeeReportingAuditPage from '@/modules/reports/hr/employee-reporting-audit/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Employee Reporting Audit',
  module: 'reports',
})

useHead({
  title: 'Employee Reporting Audit',
})
</script>

<template>
  <ReportsHrEmployeeReportingAuditPage />
</template>
