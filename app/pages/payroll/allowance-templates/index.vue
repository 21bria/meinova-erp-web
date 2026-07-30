<script setup lang="ts">
import AllowanceTemplatesPage from '~/modules/payroll/allowance-templates/page.vue'

definePageMeta({
  title: 'Allowance Templates',
  module: 'payroll',
  permission: 'payroll.allowance_tempates.view',
})

useHead({
  title: 'Allowance Templates',
})
</script>

<template>
  <AllowanceTemplatesPage />
</template>