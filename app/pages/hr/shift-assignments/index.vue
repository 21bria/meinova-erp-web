<script setup lang="ts">
import ShiftAssignmentsPage from '@/modules/hr/shift-assignments/page.vue'

definePageMeta({
  title: 'Shift Assignment',
  module: 'hr',
})

useHead({
  title: 'Shift Assignment',
})
</script>

<template>
  <ShiftAssignmentsPage />
</template>
