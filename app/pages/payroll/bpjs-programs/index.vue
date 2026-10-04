<script setup lang="ts">
import BpjsProgramsPage from '~/modules/payroll/bpjs-programs/page.vue'

definePageMeta({
  title: 'BPJS Programs',
  module: 'payroll',
})

useHead({
  title: 'BPJS Programs',
})
</script>

<template>
  <BpjsProgramsPage />
</template>
