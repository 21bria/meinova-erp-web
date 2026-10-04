<script setup lang="ts">
/*
 * `/assets` belum punya dashboard (bukan bagian ASSET-6). Rute akarnya
 * dialihkan ke Register supaya tautan modul/breadcrumb tidak mendarat di
 * 404.
 */
definePageMeta({
  redirect: '/assets/register',
})
</script>

<template>
  <div />
</template>
