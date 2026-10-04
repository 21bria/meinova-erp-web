import { useI18n } from 'vue-i18n'

/**
 * Kode stabil dari backend → kalimat yang dibaca orang.
 *
 * Backend mengirim **kode** (`late`, `unplanned`, `in_review`) beserta
 * label Inggrisnya. Yang dirender katalog; labelnya cuma cadangan untuk
 * kode yang belum sempat diterjemahkan.
 *
 * Kenapa bukan langsung memakai label backend: kalimatnya milik Django,
 * dan satu perbaikan tata bahasa di sana akan mengubah apa yang dibaca
 * pegawai berbahasa Indonesia. Kenapa bukan katalog saja tanpa cadangan:
 * kode baru yang muncul lebih dulu dari terjemahannya akan tampil sebagai
 * kunci mentah (`me.attendanceStatus.overtime`) di layar orang.
 *
 * Pola yang sama dengan `statusLabel()` untuk `common.status.*`.
 */
export function useCodeLabel() {
  const { t, te } = useI18n()

  return function codeLabel(
    group: string,
    code: string | null | undefined,
    fallback = '',
  ): string {
    if (!code)
      return fallback

    const key = `me.${group}.${code}`

    return te(key) ? t(key) : (fallback || code)
  }
}
