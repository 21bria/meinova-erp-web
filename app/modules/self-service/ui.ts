/*
|--------------------------------------------------------------------------
| Skala tipografi kartu dashboard
|--------------------------------------------------------------------------
|
| Satu tempat yang memutuskan seberapa berat tiap lapis informasi, dibaca
| tujuh kartu. Tanpa ini, "Office" di kartu Jadwal dan "Sisa 9 hari" di
| kartu Cuti akan pelan-pelan jadi dua ukuran berbeda — dan barisnya
| terbaca seperti dua orang yang membuatnya, bukan seperti satu dashboard.
|
| Tiga lapis, dan lebih dari tiga berarti hierarkinya berhenti membantu:
|
|   primary    jawaban kartunya. Yang dicari mata pertama kali.
|   strong     angka/jam pendukung yang masih harus terbaca sekali lihat.
|   meta       konteks. Boleh dilewati tanpa kehilangan maksud kartunya.
*/

export const CARD_TEXT = {
  primary: 'text-lg leading-tight font-semibold tracking-tight break-words',
  strong: 'text-sm font-medium break-words',
  meta: 'text-xs text-muted-foreground break-words',
} as const

/**
 * Warna badge status kehadiran.
 *
 * **Bukan status dokumen.** Status alur (`approved`, `rejected`, …) sudah
 * punya satu peta warna di `WorkflowStatusBadge`, dan itu yang dipakai
 * kartu Izin — supaya "Disetujui" berwarna sama di kotak masuk dan di
 * dashboard. Status kehadiran tidak punya peta mana pun sebelum ini,
 * jadi ia dibuat di sini dan **hanya** untuk kehadiran.
 *
 * Kata-katanya tidak ikut ditulis di sini: seluruhnya sudah ada di
 * `common.status.*` untuk kedua bahasa, dan dibaca lewat `codeLabel()`
 * yang sama dengan seluruh aplikasi.
 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export const ATTENDANCE_VARIANTS: Record<string, BadgeVariant> = {
  present: 'default',
  remote: 'default',
  business_trip: 'secondary',
  late: 'secondary',
  incomplete: 'secondary',
  leave: 'outline',
  permit: 'outline',
  sick: 'outline',
  holiday: 'outline',
  day_off: 'outline',
  absent: 'destructive',
}

/*
| Warna tambahan di luar variant bawaan Badge.
|
| `late` sengaja amber, bukan merah: terlambat masuk adalah catatan yang
| perlu terlihat, bukan pelanggaran yang perlu diteriakkan — dan
| menyamakan warnanya dengan `absent` membuat orang berhenti membedakan
| keduanya. Nuansa yang sama persis dipakai `WorkflowStatusBadge` untuk
| `pending`.
*/
export const ATTENDANCE_TINTS: Record<string, string> = {
  present: 'bg-emerald-600 text-white border-transparent',
  remote: 'bg-emerald-600 text-white border-transparent',
  late: 'bg-amber-100 text-amber-900 border-transparent dark:bg-amber-500/20 dark:text-amber-200',
  incomplete: 'bg-amber-100 text-amber-900 border-transparent dark:bg-amber-500/20 dark:text-amber-200',
}
