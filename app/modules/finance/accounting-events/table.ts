import type { CrudConfig } from "@framework"

import { accountingEventsFilters } from "./filters"

export const accountingEventsConfig: CrudConfig = {
  id: "accountingEvents",
  endpoint: "/api/finance/accounting-events/",
  defaultQuery: {},

  /*
   * Skema penyaring ikut, supaya permintaan **pertama** sudah membawa
   * nilai bawaannya — terutama rentang tanggal pada daftar
   * transaksional. Tanpa ini layar berangkat tanpa periode, dan yang
   * menentukan cakupannya jadi bawaan backend: hasilnya kebetulan sama,
   * tapi periode yang ditampilkan dan periode yang diminta diturunkan
   * dari dua tempat yang tidak saling mengenal.
   */
  filters: accountingEventsFilters,

  ui: {
  create: false,
  edit: true,
  delete: false,
  bulk_delete: false,
  import: false,
  export: true,
},
}
