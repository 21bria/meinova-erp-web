<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  payrollBpjsCategories,
  payrollBpjsItems,
} from '~/registry/section-hub/payroll-bpjs'

definePageMeta({
  title: 'BPJS',
  module: 'payroll',
})

useHead({
  title: 'BPJS',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="BPJS"
      description="Program, aturan iuran, kepesertaan, dan konfigurasi dasar iuran."
      search-placeholder="Cari layar BPJS"
      all-category-label="Overview"
      item-noun="screen"
      item-noun-plural="screens"
      empty-title="Tidak ada layar BPJS yang bisa dibuka"
      empty-description="Coba kata lain, atau hubungi admin bila layar yang dicari memang belum diberikan ke role Anda."
      :categories="payrollBpjsCategories"
      :items="payrollBpjsItems"
    />
  </div>
</template>
