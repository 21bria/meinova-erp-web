<script setup lang="ts">
import AllowanceComponentPage from '~/modules/payroll/allowance-template-lines/page.vue'

definePageMeta({
  title: 'Allowance Components',
  module: 'payroll',
})

useHead({
  title: 'Allowance Components',
})
</script>

<template>
  <AllowanceComponentPage />
</template>
