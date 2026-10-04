<script setup lang='ts'>
import Page from '@/modules/hr/attendance-permissions/page.vue'
import { isPersonalMode } from '@/modules/self-service/requests/personalRequest'
import PersonalRequestPage from '@/modules/self-service/requests/PersonalRequestPage.vue'

// `?mode=my` (My Workspace → Ajukan Izin): formulir pribadi yang mengirim
// ke `/api/me/attendance-permissions/`. Tanpa `mode`: formulir HR.
const route = useRoute()
const personal = computed(() => isPersonalMode(route.query))
</script>

<template>
  <PersonalRequestPage v-if="personal" kind="permission" />
  <Page v-else mode="create" />
</template>
