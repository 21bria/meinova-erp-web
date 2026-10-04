<script setup lang="ts">
import BpjsBaseDefinitionsPage from '~/modules/payroll/bpjs-base-definitions/page.vue'

definePageMeta({
  title: 'BPJS Base Definitions',
  module: 'payroll',
})

useHead({
  title: 'BPJS Base Definitions',
})
</script>

<template>
  <BpjsBaseDefinitionsPage />
</template>
