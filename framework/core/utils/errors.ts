/**
 * Semua response error dari backend memakai envelope
 * `{success, message, errors, status_code}` — pesan manusiawinya ada di
 * **`message`**, bukan `detail`.
 *
 * Sebagian besar penanganan error di sini justru membaca `detail` lebih
 * dulu lalu jatuh ke `error.message` milik `$fetch`, yang isinya
 * `[POST] "http://…/": 403 Forbidden`. Akibatnya penolakan hak akses —
 * satu-satunya pesan yang benar-benar bisa ditindaklanjuti pengguna —
 * tampil sebagai teks teknis yang tidak menyebutkan apa pun soal role.
 *
 * `detail` tetap dibaca: DRF memakainya untuk error non-field, dan
 * beberapa endpoint di sistem ini membalas apa adanya tanpa envelope.
 */

import { useNotify } from "@/composables/useNotify"
import { translate } from "./i18n"

/** Pesan `$fetch` bawaan: `[METHOD] "url": <status> <teks>`. */
const RAW_FETCH_MESSAGE = /^\[[A-Z]+\]\s+".*":\s*<?\d{3}/

function payloadOf(error: any): any {
  return (
    error?.data
    ?? error?.response?._data
    ?? error?.response?.data
    ?? {}
  )
}

export function apiErrorMessage(
  error: any,
  fallback = "Terjadi kesalahan.",
): string {
  const data = payloadOf(error)

  const message =
    data?.message
    ?? data?.detail

  if (typeof message === "string" && message.trim())
    return message

  // Array of non-field errors (bentuk DRF `raise ValidationError([...])`).
  if (Array.isArray(data?.detail) && data.detail.length)
    return String(data.detail[0])

  const raw = error?.message

  // Pesan mentah `$fetch` tidak pernah berguna bagi pengguna; yang
  // tersisa cuma kode statusnya, dan itu lebih baik diterjemahkan.
  if (typeof raw === "string" && raw.trim() && !RAW_FETCH_MESSAGE.test(raw))
    return raw

  const status =
    error?.statusCode
    ?? error?.status
    ?? error?.response?.status
    ?? data?.status_code

  if (status === 403)
    return "Anda tidak punya hak untuk melakukan tindakan ini."

  if (status === 401)
    return "Sesi Anda sudah berakhir. Silakan masuk kembali."

  if (status === 404)
    return translate("common.errors.notFound", "The requested record was not found.")

  return fallback
}

/**
 * Kalimat **sebenarnya** dari envelope yang membawa `errors`.
 *
 * `apiErrorMessage` mengembalikan `data.message`, dan untuk penolakan
 * validasi isinya selalu "Validation failed." — kalimat yang tidak
 * memberi tahu apa pun. Di form itu tidak masalah: `normalizeApiErrors`
 * menempelkan isinya ke kolom masing-masing. Di **tombol action** tidak
 * ada kolom yang bisa ditempeli, jadi satu-satunya yang dilihat
 * pengguna adalah toast — dan sampai sekarang toast itu berbunyi
 * "Validation failed." untuk penolakan yang sudah menjelaskan dirinya
 * dengan lengkap ("Step #2 … dokumen ini memuat 2 meja yang berbeda: …").
 *
 * Mengembalikan `null` kalau envelope-nya memang tidak punya `errors` —
 * pemanggil jatuh ke `apiErrorMessage` seperti biasa.
 */
export function apiErrorDetail(error: any): string | null {
  const errors = payloadOf(error)?.errors

  if (!errors || typeof errors !== "object")
    return null

  const lines: string[] = []

  for (const value of Object.values(errors)) {
    if (typeof value === "string" && value.trim())
      lines.push(value.trim())
    else if (Array.isArray(value))
      lines.push(...value.map(String).filter(item => item.trim()))
  }

  return lines.length ? lines.join(" ") : null
}

/** Sudah pernah ditampilkan ke pengguna oleh salah satu jalur pelaporan. */
export function wasReported(error: any): boolean {
  return Boolean(error && typeof error === "object" && (error as any).__meinovaReported)
}

/**
 * Menampilkan error yang **tidak menempel ke kolom mana pun**.
 *
 * Aman dipanggil berkali-kali untuk error yang sama: error-nya ditandai,
 * jadi pemanggil yang sudah melaporkannya sendiri tidak menghasilkan dua
 * toast yang sama persis.
 */
export function reportApiError(error: any, fallback?: string): void {
  if (error && typeof error === "object") {
    if ((error as any).__meinovaReported)
      return

    try {
      Object.defineProperty(error, "__meinovaReported", {
        value: true,
        enumerable: false,
      })
    }
    catch {
      // Error yang dibekukan tetap dilaporkan, cuma tidak bisa ditandai.
    }
  }

  useNotify().error(apiErrorMessage(error, fallback))
}

/**
 * Error per field untuk ditempel ke form.
 *
 * Envelope tanpa `errors` (penolakan hak akses, 404, 500) sengaja
 * mengembalikan `detail` saja — tanpa itu, seluruh isi envelope
 * (`success`, `status_code`, …) ikut terbaca sebagai nama field dan
 * form mencari kolom bernama "success".
 *
 * **Fungsi ini ikut menampilkan toast** untuk error yang tidak menempel
 * ke kolom mana pun, dan itu memang efek samping yang disengaja. Alasan
 * yang membuatnya sepadan: ini satu-satunya titik di `framework/` yang
 * dilewati **setiap** jalur simpan di seluruh modul hasil generate.
 * `use<X>Detail.ts` dan `page.vue` mengimpornya, sementara keduanya
 * berkas hasil generate — memasang laporannya di sana berarti seratus
 * modul harus diregenerate dulu, dan yang lupa tetap gagal diam-diam.
 *
 * Yang diperbaikinya nyata: 403 pada form workspace **tidak muncul di
 * mana pun**. `<X>Form.vue` menyaring error ke kolom milik tab-nya, jadi
 * `detail` dibuang sebelum sempat dirender; dialog CRUD punya toast
 * sendiri, form biasa tidak. Pengguna menekan Save, tidak terjadi apa
 * pun, tanpa satu kalimat pun.
 */
export function normalizeApiErrors(error: any): Record<string, any> {
  const data = payloadOf(error)

  if (data?.errors && typeof data.errors === "object")
    return data.errors

  const isEnvelope =
    data
    && typeof data === "object"
    && ("success" in data || "status_code" in data)

  if (isEnvelope) {
    reportApiError(error)

    return { detail: apiErrorMessage(error) }
  }

  if (data && typeof data === "object")
    return data

  // Tidak ada payload sama sekali — jaringan putus, CORS, server mati.
  // Ini pun tidak menempel ke kolom mana pun.
  reportApiError(error)

  return {}
}

/**
 * Pesan error simpan yang **tidak menempel ke kolom mana pun** di form.
 *
 * Form workspace menyaring error per kolom milik tab-nya. Kunci yang
 * bukan kolom form — `status` saat dokumen sudah terkunci, kunci
 * tumpang-tindih milik dokumen lain, `non_field_errors` — tidak pernah
 * dirender di mana pun, dan pengguna menekan Save tanpa satu kalimat
 * pun sebagai jawaban. Yang dikembalikan di sini ditampilkan workspace
 * di atas tab, apa adanya: kalimat backend tidak diganti kalimat umum.
 *
 * `attachedKeys` = kolom yang benar-benar dirender form.
 */
export function unattachedErrors(
  errors: Record<string, any> | null | undefined,
  attachedKeys: Iterable<string>,
): string[] {
  if (!errors || typeof errors !== "object")
    return []

  const attached = new Set(attachedKeys)
  const lines: string[] = []

  for (const [key, value] of Object.entries(errors)) {
    if (attached.has(key))
      continue

    const messages = Array.isArray(value) ? value : [value]

    for (const message of messages) {
      if (typeof message === "string" && message.trim())
        lines.push(message.trim())
    }
  }

  return [...new Set(lines)]
}
