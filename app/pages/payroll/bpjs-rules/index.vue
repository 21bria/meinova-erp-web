<script setup lang="ts">
import BpjsRulesPage from '~/modules/payroll/bpjs-rules/page.vue'

definePageMeta({
  title: 'BPJS Rules',
  module: 'payroll',
})

useHead({
  title: 'BPJS Rules',
})
</script>

<template>
  <BpjsRulesPage />
</template>
