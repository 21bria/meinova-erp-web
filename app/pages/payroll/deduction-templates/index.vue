<script setup lang="ts">
import DeductionTemplatesPage from '~/modules/payroll/deduction-templates/page.vue'

definePageMeta({
  title: 'Deduction Templates',
  module: 'payroll',
  permission: 'payroll.deduction_tempates.view',
})

useHead({
  title: 'Deduction Templates',
})
</script>

<template>
  <DeductionTemplatesPage />
</template>