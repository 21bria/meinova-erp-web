<script setup lang="ts">
import TaxStatusesPage from '~/modules/payroll/tax-statuses/page.vue'

definePageMeta({
  title: 'Tax Statuses',
  module: 'payroll',
  permission: 'payroll.tax_statuses.view',
})

useHead({
  title: 'Tax Statuses',
})
</script>

<template>
  <TaxStatusesPage />
</template>