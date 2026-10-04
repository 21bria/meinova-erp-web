<script setup lang="ts">
import AttendancePage from "@/modules/hr/attendance/page.vue"

definePageMeta({
  title: "Edit Attendance",
})
</script>

<template>
  <AttendancePage mode="edit" />
</template>