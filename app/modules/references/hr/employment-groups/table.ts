import type { CrudConfig } from "@framework"

import { employmentGroupsFilters } from "./filters"

export const employmentGroupsConfig: CrudConfig = {
  id: "employmentGroups",
  endpoint: "/api/administration/references/hr/employment-groups/",
  defaultQuery: {},

  /*
   * Skema penyaring ikut, supaya permintaan **pertama** sudah membawa
   * nilai bawaannya — terutama rentang tanggal pada daftar
   * transaksional. Tanpa ini layar berangkat tanpa periode, dan yang
   * menentukan cakupannya jadi bawaan backend: hasilnya kebetulan sama,
   * tapi periode yang ditampilkan dan periode yang diminta diturunkan
   * dari dua tempat yang tidak saling mengenal.
   */
  filters: employmentGroupsFilters,

  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: false,
},
}
