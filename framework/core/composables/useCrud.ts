import { computed, ref, watchEffect } from "vue"
import { useDebounceFn } from "@vueuse/core"
import { useAsyncData } from "#app"

import { useApi } from "@/composables/useApi"
import { useNotify } from "@/composables/useNotify"

import { useResourceAccess } from "./useResourceAccess"
import { apiErrorMessage } from "../utils/errors"
import { translate } from "../utils/i18n"
import { resolveFilterDefaults } from "../utils/dateRange"

import type {
  ApiList,
  CrudConfig,
  CrudUI,
} from "../types/crud"

export function useCrud<T extends { id?: number; name?: string; code?: string }>(
  config: CrudConfig,
) {
  const { request } = useApi()
  const notify = useNotify()

  const { load: loadAccess, accessFor } = useResourceAccess()

  loadAccess()

  /**
   * Flag dari schema **di-AND-kan** dengan izin tulis pengguna.
   *
   * Sebelumnya hanya schema yang menentukan, jadi pegawai melihat
   * tombol Add/Edit di layar yang API-nya pasti menolaknya — dan
   * penolakannya baru datang setelah seluruh form diisi.
   *
   * Diambil dari backend (`/api/framework/permissions/`), bukan
   * disimpulkan dari daftar izin di `/auth/me`: viewset ber-
   * `enforce_model_permissions = False` dan saklar
   * `ENFORCE_MODEL_PERMISSIONS` tidak terlihat dari sana, dan salah
   * menyimpulkannya menghilangkan tombol yang seharusnya ada.
   *
   * Resource yang **tidak dikenal** tidak disaring sama sekali —
   * filosofi yang sama dengan `isGranted`/`can`: yang tidak diketahui
   * dianggap boleh, karena API tetap penjaga sebenarnya dan tombol
   * yang hilang tanpa jejak lebih sulit dilacak daripada tombol yang
   * ditolak dengan pesan jelas.
   *
   * `import` dan `export` sengaja **tidak** ikut disaring: keduanya
   * membaca, dan membaca memang dibiarkan terbuka oleh
   * `ModelPermission`. Baris mana yang terbaca tetap urusan
   * `RoleDataPermission`.
   */
  const ui = computed<CrudUI>(() => {
    const access = accessFor(config.endpoint)

    const may = (action: "create" | "update" | "delete") =>
      access ? access[action] : true

    return {
      create: (config.ui?.create ?? true) && may("create"),
      edit: (config.ui?.edit ?? true) && may("update"),
      delete: (config.ui?.delete ?? true) && may("delete"),
      bulk_delete: (config.ui?.bulk_delete ?? false) && may("delete"),
      import: config.ui?.import ?? false,
      export: config.ui?.export ?? false,
    }
  })

  const rows = ref<T[]>([])
  const total = ref(0)
  const totalPages = ref(1)

  const page = ref(1)
  const pageSize = ref(10)
  const search = ref("")
  const ordering = ref<string | null>(null)

  /*
   * Nilai awal penyaring: bawaan dari skema, lalu `defaultQuery`.
   *
   * Urutannya menentukan. Rentang tanggal pada daftar transaksional
   * datang dari skema (`filter.dateRange`) dan harus sudah ikut di
   * permintaan **pertama** — daftar presensi yang berangkat tanpa
   * periode berarti satu `COUNT(*)` atas seluruh tabel setiap kali
   * halamannya dibuka. `defaultQuery` ditaruh belakangan supaya modul
   * yang memang mau menimpanya tetap bisa.
   *
   * Helper yang sama dipakai toolbar untuk menampilkan periodenya, jadi
   * yang terlihat di layar dan yang dikirim ke API tidak pernah
   * diturunkan dua kali dengan dua aturan.
   */
  function initialFilters(): Record<string, any> {
    return {
      ...resolveFilterDefaults(config.filters?.items),
      ...(config.defaultQuery ?? {}),
    }
  }

  const serverFilters = ref<Record<string, any>>(initialFilters())

  const query = computed(() => ({
    page: page.value,
    page_size: pageSize.value,
    search: search.value || "",
    ordering: ordering.value || undefined,
    ...serverFilters.value,
  }))

  const { data, pending, error, refresh } = useAsyncData<ApiList<T>>(
    () => `${config.name ?? config.endpoint}:${JSON.stringify(query.value)}`,
    () =>
      request(config.endpoint, {
        method: "GET",
        query: query.value,
      }),
    {
      server: false,
    },
  )

  watchEffect(() => {
    const meta = data.value?.meta

    rows.value = data.value?.data ?? []

    total.value = meta?.count ?? 0

    totalPages.value =
      meta?.total_pages
      ?? Math.max(
        1,
        Math.ceil((meta?.count ?? 0) / pageSize.value),
      )
  })

  const debouncedSearch = useDebounceFn(() => {
    page.value = 1
    refresh()
  }, 350)

  function onApply({
    search: nextSearch,
    filters,
  }: {
    search?: string
    filters?: Record<string, any>
  }) {
    search.value = nextSearch ?? ""

    /*
     * Bawaan dipasang kembali untuk kunci yang **tidak disebut**
     * payload-nya.
     *
     * Toolbar mengirim isi panel apa adanya, dan panel yang belum
     * pernah dibuka mengirim `{}`. Tanpa lapisan ini, mengetik di kotak
     * pencarian lalu menekan Enter akan menghapus rentang tanggalnya —
     * dan daftarnya berubah diam-diam jadi seluruh sejarah tanpa satu
     * pun kontrol di layar yang terlihat berubah.
     *
     * Yang **disebut** tetap menang, termasuk kalau nilainya kosong:
     * mengosongkan penyaring adalah perintah, bukan kelalaian.
     */
    serverFilters.value = {
      ...initialFilters(),
      ...(filters ?? {}),
    }

    page.value = 1

    refresh()
  }

  function onReset() {
    search.value = ""

    // Kembali ke bawaan, bukan ke kosong. Untuk daftar berperiode,
    // "kosong" berarti seluruh sejarah — dan Reset yang membuka seluruh
    // sejarah adalah tombol yang paling mudah ditekan tanpa curiga.
    serverFilters.value = initialFilters()
    page.value = 1

    refresh()
  }

  function onSort({
    key,
    dir,
  }: {
    key: string | null
    dir: "asc" | "desc" | null
  }) {
    ordering.value =
      !key || !dir
        ? null
        : `${dir === "desc" ? "-" : ""}${key}`

    page.value = 1
    refresh()
  }

  function onSearch(value: string) {
    search.value = value
    debouncedSearch()
  }

  function onChangePage(value: number) {
    page.value = value
    refresh()
  }

  function onChangePageSize(value: number) {
    pageSize.value = value
    page.value = 1
    refresh()
  }

  async function create(payload: any) {
    await request(config.endpoint, {
      method: "POST",
      body: payload,
    })

    await refresh()
  }

  async function update(
    id: number | string,
    payload: any,
  ) {
    await request(`${config.endpoint}${id}/`, {
      method: "PATCH",
      body: payload,
    })

    await refresh()
  }

  async function remove(id: number | string) {
    await request(`${config.endpoint}${id}/`, {
      method: "DELETE",
    })

    await refresh()
  }

  /*
  | Kalimat backend (`message` envelope), bukan `error.message` milik
  | `$fetch` — yang isinya `[GET] "http://…": 403 Forbidden`. Penolakan
  | hak akses adalah satu-satunya pesan yang bisa ditindaklanjuti
  | pengguna; sebelumnya ia tampil sebagai teks teknis dan tabelnya
  | berbunyi "No results.", yang terbaca seperti datanya memang kosong.
  */
  const errorMessage = computed<string | null>(() =>
    error.value
      ? apiErrorMessage(
          error.value,
          translate("common.errors.loadList", "Failed to load list."),
        )
      : null,
  )

  watchEffect(() => {
    if (errorMessage.value)
      notify.error(errorMessage.value)
  })

  return {
    ui,

    rows,
    total,
    totalPages,
    page,
    pageSize,
    search,
    ordering,
    serverFilters,
    pending,
    error,
    errorMessage,
    refresh,

    onSearch,
    onApply,
    onReset,
    onSort,
    onChangePage,
    onChangePageSize,

    create,
    update,
    remove,
  }
}