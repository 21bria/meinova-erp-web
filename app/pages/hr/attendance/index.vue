<script setup lang="ts">
import AttendancePage from "@/modules/hr/attendance/page.vue"

definePageMeta({
  title: "Attendance",
//   showGlobalSearch: true,
})
</script>

<template>
  <AttendancePage mode="list" />
</template>