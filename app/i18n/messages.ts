import type { LocaleCode } from './config'

import en from './locales/en'
import id from './locales/id'

/*
| Katalog pesan, satu entri per bahasa.
|
| Katalognya **dimuat langsung**, bukan lazy: seluruhnya beberapa puluh
| kilobyte, dan pengguna bisa berganti bahasa kapan saja tanpa menunggu
| unduhan. Kalau nanti sudah puluhan modul dan ukurannya jadi masalah,
| tempat mengubahnya cuma berkas ini.
|
| `en` adalah acuan bentuk: kunci yang ada di `en` tapi tidak ada di
| bahasa lain akan jatuh ke `en` (lihat `FALLBACK_LOCALE`), dan test
| `messages.spec.ts` menjaga supaya tidak ada kunci yang **hanya** ada
| di bahasa selain `en` — kunci seperti itu tidak punya fallback.
*/
export const messages: Record<LocaleCode, Record<string, any>> = {
  en,
  id,
}

export type MessageSchema = typeof en
