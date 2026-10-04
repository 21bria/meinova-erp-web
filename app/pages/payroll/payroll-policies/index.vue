<script setup lang="ts">
import PayrollPoliciesPage from '~/modules/payroll/payroll-policies/page.vue'

definePageMeta({
  title: 'Payroll Policies',
  module: 'payroll',
})

useHead({
  title: 'Payroll Policies',
})
</script>

<template>
  <PayrollPoliciesPage />
</template>
