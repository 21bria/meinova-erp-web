<script setup lang="ts">
import OvertimeGroupsPage from '~/modules/payroll/overtime-groups/page.vue'

definePageMeta({
  title: 'Overtime Groups',
  module: 'payroll',
  permission: 'payroll.overtime_groups.view',
})

useHead({
  title: 'Overtime Groups',
})
</script>

<template>
  <OvertimeGroupsPage />
</template>