<script setup lang="ts">
import ShiftCalendarPage from '@/modules/hr/shift-calendar/page.vue'

definePageMeta({
  title: 'Shift Calendar',
  module: 'hr',
})

useHead({
  title: 'Shift Calendar',
})
</script>

<template>
  <ShiftCalendarPage />
</template>
