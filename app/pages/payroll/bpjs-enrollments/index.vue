<script setup lang="ts">
import BpjsEnrollmentsPage from '~/modules/payroll/bpjs-enrollments/page.vue'

definePageMeta({
  title: 'BPJS Enrollments',
  module: 'payroll',
})

useHead({
  title: 'BPJS Enrollments',
})
</script>

<template>
  <BpjsEnrollmentsPage />
</template>
