<script setup lang="ts">
import SalaryLevelsPage from '~/modules/payroll/salary-levels/page.vue'

definePageMeta({
  title: 'Salalry Levels',
  module: 'payroll',
  permission: 'payroll.salary_levels.view',
})

useHead({
  title: 'Salary Levels',
})
</script>

<template>
  <SalaryLevelsPage />
</template>