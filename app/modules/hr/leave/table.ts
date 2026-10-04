import type { CrudConfig } from "@framework"

import { leaveFilters } from "./filters"

export const leaveConfig: CrudConfig = {
  id: "leave",
  endpoint: "/api/hr/leaves/",
  defaultQuery: {},

  /*
   * Skema penyaring ikut, supaya permintaan **pertama** sudah membawa
   * nilai bawaannya — terutama rentang tanggal pada daftar
   * transaksional. Tanpa ini layar berangkat tanpa periode, dan yang
   * menentukan cakupannya jadi bawaan backend: hasilnya kebetulan sama,
   * tapi periode yang ditampilkan dan periode yang diminta diturunkan
   * dari dua tempat yang tidak saling mengenal.
   */
  filters: leaveFilters,

  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: true,
},
}
