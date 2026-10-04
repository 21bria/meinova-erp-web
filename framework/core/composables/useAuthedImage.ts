import type { MaybeRefOrGetter, Ref } from "vue"

import { onUnmounted, ref, toValue, watch } from "vue"

import { useApi } from "@/composables/useApi"

import { createAuthedImageSource } from "../utils/authedImageSource"

export interface AuthedImage {
  /** Alamat siap pasang (`blob:` atau alamat statis), `null` kalau belum/gagal. */
  url: Ref<string | null>
  /** Pengambilannya masih berjalan. */
  pending: Ref<boolean>
  /** Sudah selesai dan gagal — pemanggil menampilkan cadangannya. */
  failed: Ref<boolean>
}

/**
 * Alamat gambar yang siap dipasang ke `<img>`: object URL untuk yang
 * berautentikasi, alamat aslinya untuk yang statis, `null` selama
 * pengambilannya belum selesai atau gagal.
 *
 * Dipakai `MAvatar` (inisial sebagai cadangan) dan `MUploadPreview`
 * (ikon + lightbox). Keduanya butuh membedakan "sedang diambil" dari
 * "gagal": yang pertama pantas mendapat pemutar, yang kedua pantas
 * mendapat kalimat. Aturan pengambilannya sendiri di
 * `authedImageSource.ts`.
 */
export function useAuthedImage(
  source: MaybeRefOrGetter<string | null | undefined>,
): AuthedImage {
  const { request } = useApi()

  const url = ref<string | null>(null)
  const pending = ref(false)
  const failed = ref(false)

  const resolver = createAuthedImageSource({
    fetcher: path => request<Blob>(path, { responseType: "blob" }),
    onChange: (value) => {
      url.value = value
    },
    isClient: import.meta.client,
  })

  /*
   * Penanda permintaan terakhir. Tanpa ini balasan yang datang
   * belakangan mematikan `pending` milik permintaan yang lebih baru —
   * dan pemutarnya berhenti berputar untuk gambar yang masih di jalan.
   */
  let token = 0

  watch(
    () => toValue(source),
    async (value) => {
      const current = ++token

      const trimmed = (value ?? "").trim()

      failed.value = false

      if (!trimmed) {
        pending.value = false

        await resolver.resolve(value)

        return
      }

      pending.value = true

      await resolver.resolve(value)

      if (current !== token)
        return

      pending.value = false
      failed.value = url.value === null
    },
    { immediate: true },
  )

  onUnmounted(() => {
    token += 1
    resolver.dispose()
  })

  return { url, pending, failed }
}
