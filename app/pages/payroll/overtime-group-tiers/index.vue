<script setup lang="ts">
import OvertimeGroupTiersPage from '~/modules/payroll/overtime-group-tiers/page.vue'

definePageMeta({
  title: 'Overtime Tiers',
  module: 'payroll',
})

useHead({
  title: 'Overtime Tiers',
})
</script>

<template>
  <OvertimeGroupTiersPage />
</template>
