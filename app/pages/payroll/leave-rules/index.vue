<script setup lang="ts">
import PayrollLeaveRulePage from '~/modules/payroll/leave-rules/page.vue'

definePageMeta({
  title: 'Payroll Leave Rules',
  module: 'payroll',
})

useHead({
  title: 'Payroll Leave Rules',
})
</script>

<template>
  <PayrollLeaveRulePage />
</template>
