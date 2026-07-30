<script setup lang="ts">
import SalaryGradePage from '~/modules/payroll/salary-grades/page.vue'

definePageMeta({
  title: 'Salalry Grade',
  module: 'payroll',
  permission: 'payroll.salary_grades.view',
})

useHead({
  title: 'Salary Grade',
})
</script>

<template>
  <SalaryGradePage />
</template>