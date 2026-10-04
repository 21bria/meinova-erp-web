<script setup lang="ts">
import PayrollInputPage from '~/modules/payroll/payroll-inputs/page.vue'

definePageMeta({
  title: 'Payroll Input',
  module: 'payroll',
})

useHead({
  title: 'Payroll Input',
})
</script>

<template>
  <PayrollInputPage />
</template>
