<script setup lang="ts">
import PayslipPage from '~/modules/payroll/payslips/page.vue'

definePageMeta({
  title: 'Payslips',
  module: 'payroll',
})

useHead({
  title: 'Payslips',
})
</script>

<template>
  <PayslipPage />
</template>
