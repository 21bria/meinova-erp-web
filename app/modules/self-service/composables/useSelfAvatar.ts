import { useApi } from '@/composables/useApi'

import { fetchSelfAvatarBlob } from '../api/client'
import { createObjectUrlHolder } from '../api/object-url'

/**
 * Foto pegawai yang sedang login, sebagai object URL.
 *
 * **Kenapa tidak `<img :src="/api/me/avatar/">`.** Rute itu dijaga JWT,
 * dan `<img>` tidak pernah mengirim header `Authorization` — jadi
 * pemasangan langsung menghasilkan gambar yang selalu gagal, tanpa satu
 * pun pesan yang menyebut sebabnya. Berkasnya karena itu diambil lewat
 * klien API yang membawa token, lalu dijadikan `blob:` URL.
 *
 * Object URL **dicabut** saat komponennya dilepas dan sebelum diganti.
 * Tanpa itu tiap pembukaan halaman meninggalkan satu berkas di memori
 * tab selama tabnya hidup — kebocoran yang tidak terlihat sampai
 * seseorang membuka profilnya berpuluh kali dalam satu sesi.
 *
 * Tidak adanya foto **bukan galat**: `url` tetap `null` dan pemanggilnya
 * menampilkan inisial.
 */
export function useSelfAvatar() {
  const { request } = useApi()

  const url = ref<string | null>(null)
  const pending = ref(false)

  // Urutan cabut/pasangnya dipegang `createObjectUrlHolder` — bagian
  // yang paling gampang salah dan satu-satunya yang bisa diuji tanpa
  // browser. Lihat `api/object-url.ts`.
  const holder = createObjectUrlHolder({
    createObjectURL: blob => URL.createObjectURL(blob),
    revokeObjectURL: value => URL.revokeObjectURL(value),
  })

  function release() {
    holder.release()
    url.value = null
  }

  async function load() {
    // Di server tidak ada `URL.createObjectURL` maupun gunanya: fotonya
    // dipasang di browser orangnya.
    if (!import.meta.client)
      return

    pending.value = true

    try {
      url.value = holder.set(await fetchSelfAvatarBlob(request))
    }
    catch {
      // Gangguan pengambilan foto tidak boleh menjatuhkan halamannya.
      // Yang terjadi paling buruk: inisial, sama seperti pegawai yang
      // memang belum punya foto.
      release()
    }
    finally {
      pending.value = false
    }
  }

  onBeforeUnmount(release)

  return { url, pending, load }
}
