<script setup lang="ts">
import AttendancePage from "@/modules/hr/attendance/page.vue"

definePageMeta({
  title: "Create Attendance",
})
</script>

<template>
  <AttendancePage mode="create" />
</template>