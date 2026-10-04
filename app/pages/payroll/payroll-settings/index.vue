<script setup lang="ts">
import PayrollSettingPage from '~/modules/payroll/payroll-settings/page.vue'

definePageMeta({
  title: 'Payroll Settings',
  module: 'payroll',
})

useHead({
  title: 'Payroll Settings',
})
</script>

<template>
  <PayrollSettingPage />
</template>
