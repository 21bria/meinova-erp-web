<script setup lang="ts">
/*
 * Rute **My Workspace**.
 *
 * Berkas di `app/pages/` selalu ditulis tangan dan sengaja tipis — yang
 * di `app/modules/` yang bisa diuji dan dipakai ulang, yang di sini cuma
 * alamatnya. Pola yang sama dengan `app/pages/hr/my-profile.vue`.
 */
import WorkspacePage from '@/modules/self-service/workspace/page.vue'

definePageMeta({ title: 'My Workspace' })
</script>

<template>
  <WorkspacePage />
</template>
