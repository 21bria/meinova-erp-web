import type { CrudConfig } from "@framework"

import { businessTripLegsFilters } from "./filters"

export const businessTripLegsConfig: CrudConfig = {
  id: "businessTripLegs",
  endpoint: "/api/hr/business-trip-legs/",
  defaultQuery: {},

  /*
   * Skema penyaring ikut, supaya permintaan **pertama** sudah membawa
   * nilai bawaannya — terutama rentang tanggal pada daftar
   * transaksional. Tanpa ini layar berangkat tanpa periode, dan yang
   * menentukan cakupannya jadi bawaan backend: hasilnya kebetulan sama,
   * tapi periode yang ditampilkan dan periode yang diminta diturunkan
   * dari dua tempat yang tidak saling mengenal.
   */
  filters: businessTripLegsFilters,

  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: false,
},
}
