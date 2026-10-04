<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  payrollTaxCategories,
  payrollTaxItems,
} from '~/registry/section-hub/payroll-tax'

definePageMeta({
  title: 'Tax',
  module: 'payroll',
})

useHead({
  title: 'Tax',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="Tax"
      description="Konfigurasi PPh21: lapisan tarif dan status PTKP pegawai."
      search-placeholder="Cari layar pajak"
      all-category-label="Overview"
      item-noun="screen"
      item-noun-plural="screens"
      empty-title="Tidak ada layar pajak yang bisa dibuka"
      empty-description="Coba kata lain, atau hubungi admin bila layar yang dicari memang belum diberikan ke role Anda."
      :categories="payrollTaxCategories"
      :items="payrollTaxItems"
    />
  </div>
</template>
