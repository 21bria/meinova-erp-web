<script setup lang="ts">
import BpjsRiskClassesPage from '~/modules/payroll/bpjs-risk-classes/page.vue'

definePageMeta({
  title: 'BPJS Risk Classes',
  module: 'payroll',
})

useHead({
  title: 'BPJS Risk Classes',
})
</script>

<template>
  <BpjsRiskClassesPage />
</template>
