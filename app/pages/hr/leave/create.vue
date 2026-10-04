<script setup lang="ts">
import Page from '@/modules/hr/leave/page.vue'
import { isPersonalMode } from '@/modules/self-service/requests/personalRequest'
import PersonalRequestPage from '@/modules/self-service/requests/PersonalRequestPage.vue'

// `?mode=my` (My Workspace → Ajukan Cuti): formulir pribadi yang mengirim
// ke `/api/me/leave-requests/`. Tanpa `mode`: formulir HR seperti biasa.
const route = useRoute()
const personal = computed(() => isPersonalMode(route.query))
</script>

<template>
  <PersonalRequestPage v-if="personal" kind="leave" />
  <Page v-else mode="create" />
</template>
