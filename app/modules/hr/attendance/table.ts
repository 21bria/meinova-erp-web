import type { CrudConfig } from "@framework"

import { attendanceFilters } from "./filters"

export const attendanceConfig: CrudConfig = {
  id: "attendance",
  endpoint: "/api/hr/attendance/",
  defaultQuery: {},

  /*
   * Skema penyaring ikut, supaya permintaan **pertama** sudah membawa
   * nilai bawaannya — terutama rentang tanggal pada daftar
   * transaksional. Tanpa ini layar berangkat tanpa periode, dan yang
   * menentukan cakupannya jadi bawaan backend: hasilnya kebetulan sama,
   * tapi periode yang ditampilkan dan periode yang diminta diturunkan
   * dari dua tempat yang tidak saling mengenal.
   */
  filters: attendanceFilters,

  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: true,
  export: true,
},
}
