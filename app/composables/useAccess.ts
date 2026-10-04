/**
 * Wewenang pengguna yang sedang login.
 *
 * Sumbernya `capabilities` dari `/api/accounts/auth/me/` — satu tempat
 * di backend (`apps/accounts/capabilities.py`) yang juga dipakai
 * `permissions.py` tiap modul untuk menolak request. Jadi menu yang
 * tampil dan API yang mengizinkan selalu berangkat dari perhitungan
 * yang sama.
 *
 * **Ini bukan penjagaan.** Menyembunyikan menu tidak menghalangi orang
 * menembak API langsung; endpoint-nya sudah menolak 403 sendiri. Yang
 * dilakukan di sini cuma tidak menyodorkan layar yang pasti menolaknya.
 */
export function useAccess() {
  const auth = useAuthStore()

  const capabilities = computed<Record<string, boolean>>(
    () => auth.user?.capabilities ?? {},
  )

  const roles = computed<string[]>(
    () => (auth.user?.roles ?? []).map((r: any) => r.code),
  )

  /**
   * Izin per model, bentuknya `app_label.verb_model`.
   *
   * Sumbernya `Role.permissions` — centang di layar Roles, bukan daftar
   * kode role yang ditanam di sini. Superuser dikirimi `["*"]` supaya
   * 708 baris tidak ikut melewati kabel tiap kali.
   */
  const permissions = computed<string[]>(
    () => auth.user?.permissions ?? [],
  )

  const isSuperuser = computed(
    () => auth.user?.is_superuser === true || permissions.value.includes('*'),
  )

  /**
   * Sama filosofinya dengan `isGranted`: yang **tidak diketahui**
   * dianggap boleh. Akun dengan cache lama belum punya kolom ini, dan
   * tombol yang hilang tanpa jejak jauh lebih sulit dilacak daripada
   * tombol yang ditekan lalu ditolak API dengan pesan jelas.
   */
  function can(permission?: string) {
    if (!permission)
      return true

    if (isSuperuser.value)
      return true

    if (!auth.user?.permissions)
      return true

    return permissions.value.includes(permission)
  }

  /**
   * `canWrite('hr.employee')` -> { create, update, remove, any }.
   *
   * Dipakai tabel dan form untuk menyembunyikan tombol tulis. Argumennya
   * `app_label.model_name` huruf kecil — sama persis dengan yang dipakai
   * `ModelPermission` di backend, supaya dua sisi tidak bisa berbeda
   * pendapat soal nama izinnya.
   */
  function canWrite(model?: string) {
    if (!model) {
      return { create: true, update: true, remove: true, any: true }
    }

    const [app, name] = model.split('.')

    const create = can(`${app}.add_${name}`)
    const update = can(`${app}.change_${name}`)
    const remove = can(`${app}.delete_${name}`)

    return { create, update, remove, any: create || update || remove }
  }

  /**
   * Nama wewenang yang **tidak dikenal dianggap boleh**.
   *
   * Menu yang hilang gara-gara salah ketik jauh lebih sulit dilacak
   * daripada menu yang tampil lalu ditolak API-nya dengan pesan jelas.
   */
  function isGranted(permission?: string) {
    if (!permission)
      return true

    if (!(permission in capabilities.value))
      return true

    return capabilities.value[permission] === true
  }

  /**
   * Memastikan `capabilities` sudah ada.
   *
   * Akun yang sudah login sebelum kolom ini ada punya cache `user` lama
   * tanpa `capabilities` — tanpa penyegaran ini menunya ikut hilang
   * untuk orang yang sebenarnya berhak, sampai mereka logout.
   */
  async function load(force = false) {
    if (!auth.isAuthed)
      return

    if (!force && auth.user?.capabilities && auth.user?.permissions)
      return

    try {
      await auth.fetchMe(true)
    }
    catch {
      // Gagal menyegarkan tidak boleh mematikan sidebar. Wewenang yang
      // belum diketahui dibiarkan apa adanya; API tetap jadi penjaga
      // sebenarnya.
    }
  }

  return {
    capabilities,
    permissions,
    roles,
    isSuperuser,
    isGranted,
    can,
    canWrite,
    load,

    canManageSecurity: computed(() => isGranted('security.manage')),
    canConfigureWorkflow: computed(() => isGranted('workflow.configure')),
    canMonitorAllWorkflow: computed(() => isGranted('workflow.monitor_all')),
  }
}
