import type { CrudConfig } from "@framework"

import { __name__Filters } from "./filters"

export const __name__Config: CrudConfig = {
  id: "__name__",
  endpoint: "__endpoint__",
  defaultQuery: {},

  /*
   * Skema penyaring ikut, supaya permintaan **pertama** sudah membawa
   * nilai bawaannya — terutama rentang tanggal pada daftar
   * transaksional. Tanpa ini layar berangkat tanpa periode, dan yang
   * menentukan cakupannya jadi bawaan backend: hasilnya kebetulan sama,
   * tapi periode yang ditampilkan dan periode yang diminta diturunkan
   * dari dua tempat yang tidak saling mengenal.
   */
  filters: __name__Filters,

  ui: __CRUD_UI__,
}
