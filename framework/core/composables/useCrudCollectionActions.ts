import { computed, ref } from "vue"
import { translate } from "../utils/i18n"

/*
| Ketiganya diimpor EKSPLISIT, bukan bersandar pada auto-import Nuxt.
| `imports.dirs` di `nuxt.config.ts` diselesaikan relatif terhadap
| `app/`, jadi entri untuk direktori framework tidak menunjuk ke mana
| pun — dan yang menangkapnya `vue-tsc`, bukan browser.
*/
import { useAccess } from "@/composables/useAccess"
import { useApi } from "@/composables/useApi"
import { useNotify } from "@/composables/useNotify"

import type { CollectionAction } from "../types/crud"
import { apiErrorMessage } from "../utils/errors"

type CrudActions = {
  refresh?: () => Promise<any> | any
}

type Options = {
  actions?: CollectionAction[]
  /** Baris yang dicentang di tabel. */
  selectedIds?: () => string[]
  notify?: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
  }
}

/*
| Aksi massal dari toolbar tabel.
|
| Dipisah dari `MRecordActions` karena keadaan yang dibacanya berbeda:
| record action dinilai terhadap satu baris yang sedang dibuka, yang ini
| terhadap baris yang dicentang **dan** penyaring yang sedang aktif.
| Menggabungkannya berarti satu komponen yang kadang butuh record kadang
| tidak, dan cepat atau lambat salah satu jalurnya dinilai dengan
| keadaan milik jalur yang lain.
*/
export function useCrudCollectionActions(
  crud: CrudActions,
  options: Options = {},
) {
  /*
  | `notify` tidak diserahkan ke pemanggil, alasan yang sama dengan
  | `useCrudBulkDelete`: generator tidak pernah menghasilkannya, jadi
  | modul yang diregenerate akan diam lagi — dan aksi massal yang gagal
  | tanpa satu kalimat pun adalah kegagalan yang paling sulit
  | dilaporkan.
  */
  const notify = options.notify ?? useNotify()
  const api = useApi()
  const access = useAccess()

  const open = ref(false)
  const running = ref<string | null>(null)
  const current = ref<CollectionAction | null>(null)

  /*
  | Wewenang yang TIDAK dikenal dianggap boleh — filosofi yang sama
  | dengan `MRecordActions.isAllowed`. Yang menolak sungguhan tetap API;
  | tombol yang hilang tanpa jejak lebih sulit dilacak daripada tombol
  | yang ditolak dengan pesan jelas.
  |
  | Dua kosakata yang sama-sama berbentuk `a.b`, dan pembedanya garis
  | bawah di ruas kedua: `hr.change_leaveopeningbalance` izin per model,
  | `security.manage` wewenang. Memakai pemeriksa yang salah gagal ke
  | arah berbeda dan tanpa suara.
  */
  function isAllowed(action: CollectionAction) {
    const name = action.permission

    if (!name)
      return true

    const isModelPermission = String(name).split(".")[1]?.includes("_")

    if (isModelPermission)
      return access.can?.(name) !== false

    return access.isGranted?.(name) !== false
  }

  const available = computed(
    () => (options.actions ?? []).filter(
      action => action?.endpoint && isAllowed(action),
    ),
  )

  function selected(): string[] {
    return (options.selectedIds?.() ?? [])
      .map(id => String(id).trim())
      .filter(Boolean)
  }

  function ask(key: string) {
    const action = available.value.find(item => item.key === key)

    if (!action)
      return

    if (action.selection === "required" && !selected().length) {
      notify.info(translate("common.errors.selectRowsFirst", "Select the rows you want to process first."))

      return
    }

    current.value = action

    // Tanpa konfirmasi, jalankan langsung. Dialog kosong yang cuma
    // berisi tombol OK menambah satu klik tanpa menambah satu pun
    // keterangan.
    if (!action.confirm) {
      void run(action)

      return
    }

    open.value = true
  }

  async function confirm() {
    const action = current.value

    if (!action)
      return

    await run(action)
  }

  async function run(action: CollectionAction) {
    running.value = action.key

    const ids = action.selection === "none"
      ? []
      : selected()

    const idsField = action.idsField ?? "ids"

    try {
      const response = await api.request(action.endpoint, {
        method: (action.method ?? "post").toUpperCase() as any,
        body: {
          ...(action.payload ?? {}),
          // Tanpa baris tercentang, kuncinya **tidak dikirim sama
          // sekali** — bukan dikirim sebagai array kosong. Array kosong
          // terbaca backend sebagai "tidak ada yang dipilih" oleh
          // sebagian pemeriksa dan sebagai "batasi ke nol baris" oleh
          // sebagian lain, dan selisih itu tidak berbunyi: hasilnya nol
          // baris terproses yang terbaca seperti tombol yang tidak
          // bekerja.
          ...(ids.length ? { [idsField]: ids } : {}),
        },
      })

      notify.success(
        response?.message ?? `${action.label} berhasil.`,
      )

      open.value = false
      current.value = null

      await crud.refresh?.()
    }
    catch (error: any) {
      // Kunci pesannya `message`, bukan `detail`.
      notify.error(apiErrorMessage(error, `${action.label} gagal.`))
    }
    finally {
      running.value = null
    }
  }

  const confirmTitle = computed(() => {
    const value = current.value?.confirm

    if (value && typeof value === "object" && value.title)
      return value.title

    return current.value?.label ?? translate("common.state.confirmContinue", "Continue?")
  })

  const confirmDescription = computed(() => {
    const action = current.value

    if (!action)
      return ""

    const value = action.confirm
    const base = value && typeof value === "object"
      ? (value.description ?? "")
      : ""

    const count = selected().length

    /*
    | Cakupannya disebut di kalimat konfirmasi, dan itu bukan hiasan:
    | "baris terpilih" dan "seluruh baris yang sedang terlihat" adalah
    | dua tindakan yang sangat berbeda, dan yang menekannya tidak punya
    | cara lain membedakannya — tombolnya satu dan sama.
    */
    const scope = count
      ? translate(
          "common.state.processSelected",
          `${count} selected rows will be processed.`,
          { count },
        )
      : translate(
          "common.state.processAllVisible",
          "No rows are checked, so ALL rows currently visible "
          + "(following the active filters) will be processed.",
        )

    return base ? `${scope} ${base}` : scope
  })

  /*
  | Label tombol konfirmasinya = label aksinya sendiri ("Post Saldo
  | Awal"), bukan kata generik. Dialog yang tombolnya berbunyi "OK"
  | memaksa yang membacanya mengingat aksi mana yang tadi ia pilih —
  | dan di layar yang punya beberapa aksi massal, itu tebakan.
  */
  const confirmLabel = computed(() => current.value?.label ?? "OK")

  /*
  | Warnanya ikut varian aksinya. Merah hanya untuk yang destruktif:
  | tombol merah pada aksi yang justru menerbitkan data membuat yang
  | menekannya mengira sedang menghapus sesuatu.
  */
  const confirmVariant = computed(() => current.value?.variant ?? "default")

  return {
    available,
    open,
    current,
    running,
    ask,
    confirm,
    confirmTitle,
    confirmDescription,
    confirmLabel,
    confirmVariant,
  }
}
