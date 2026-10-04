<script setup lang="ts">
import DeductionComponentPage from '~/modules/payroll/deduction-template-lines/page.vue'

definePageMeta({
  title: 'Deduction Components',
  module: 'payroll',
})

useHead({
  title: 'Deduction Components',
})
</script>

<template>
  <DeductionComponentPage />
</template>
