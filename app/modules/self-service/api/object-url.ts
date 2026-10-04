/*
|--------------------------------------------------------------------------
| Pemegang object URL
|--------------------------------------------------------------------------
|
| `URL.createObjectURL()` menyimpan berkasnya di memori tab **sampai
| dicabut**, dan tidak ada yang mencabutnya otomatis. Satu avatar yang
| lupa dicabut tidak terlihat sebagai apa pun; berpuluh pembukaan halaman
| dalam satu sesi barulah terasa, dan saat itu sebabnya sudah jauh di
| belakang.
|
| Dipisah dari composable-nya supaya urutannya bisa diuji sungguhan di
| lingkungan `node` milik repo ini — tanpa Vue, tanpa DOM, dengan API URL
| palsu yang mencatat setiap create dan revoke. Aturan yang dijaga:
|
|   * URL lama dicabut **saat digantikan**, bukan sebelum penggantinya ada
|   * dicabut saat dilepas
|   * tidak pernah dicabut dua kali
|   * mencabut yang sudah kosong bukan galat
*/

export interface ObjectUrlApi {
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
}

export interface ObjectUrlHolder {
  readonly current: string | null
  /** Pasang blob baru (atau `null`), cabut yang lama. Balas URL baru. */
  set: (blob: Blob | null) => string | null
  /** Cabut yang sedang dipegang. Aman diulang. */
  release: () => void
}

export function createObjectUrlHolder(api: ObjectUrlApi): ObjectUrlHolder {
  let current: string | null = null

  function release() {
    if (current === null)
      return

    api.revokeObjectURL(current)
    current = null
  }

  return {
    get current() {
      return current
    },

    set(blob: Blob | null) {
      // URL baru dibuat **lebih dulu**, baru yang lama dicabut. Urutan
      // sebaliknya membuat gambar berkedip: sumbernya kosong selama
      // sepersekian detik antara pencabutan dan pemasangan.
      const next = blob ? api.createObjectURL(blob) : null

      const previous = current

      current = next

      if (previous !== null)
        api.revokeObjectURL(previous)

      return next
    },

    release,
  }
}
