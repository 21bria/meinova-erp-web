<script setup lang="ts">
import ReportsHrContractExpiryPage from '@/modules/reports/hr/contract-expiry/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Contract Expiry',
  module: 'reports',
})

useHead({
  title: 'Contract Expiry',
})
</script>

<template>
  <ReportsHrContractExpiryPage />
</template>
