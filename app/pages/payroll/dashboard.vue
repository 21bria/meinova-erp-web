<script setup lang="ts">
import PayrollDashboardPage from '@/modules/payroll/dashboard/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Payroll Dashboard',
  module: 'payroll',
})

useHead({
  title: 'Payroll Dashboard',
})
</script>

<template>
  <PayrollDashboardPage />
</template>
