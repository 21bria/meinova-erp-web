<script setup lang="ts">
import PayrollGroupsPage from '~/modules/payroll/payroll-groups/page.vue'

definePageMeta({
  title: 'Payroll Groups',
  module: 'payroll',
  permission: 'payroll.payroll_groups.view',
})

useHead({
  title: 'Payroll Groups',
})
</script>

<template>
  <PayrollGroupsPage />
</template>