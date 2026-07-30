<script setup lang="ts">
import EmployeesPage from '@/modules/hr/employees/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Employees',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <EmployeesPage mode="list" />
    </div>
  </div>
</template>