<script setup lang="ts">
/*
 * Tidak ada item sidebar untuk layar ini, dan itu disengaja: aturan
 * kebijakan dibuka dari dalam kebijakannya (tab Rules), bukan sebagai
 * daftar rata berisi aturan seluruh kebijakan sekaligus.
 *
 * Rutenya tetap harus ada — editor workspace mendorong
 * `/<framework_module>` saat tombol Back ditekan, dan tanpa `index.vue`
 * tombol itu mendarat di 404.
 */
import Page from '~/modules/finance/accounting-policy-rules/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Policy Rules',
  module: 'finance',
})

useHead({ title: 'Policy Rules' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
