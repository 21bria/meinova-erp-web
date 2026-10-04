/*
 * Warna sel kalender.
 *
 * Dua aturan yang membentuk berkas ini, dan keduanya pernah jadi cara
 * layar sejenis gagal:
 *
 * 1. **Tidak ada satu kode shift pun di sini.** `SHIFT-1`/`S1`/
 *    `Morning` adalah data peragaan, bukan kontrak — tenant berikutnya
 *    memakai `PAGI`/`SIANG`/`MALAM` atau `A`/`B`/`C`. Warna karena itu
 *    dibagikan menurut **urutan id shift yang muncul di bulan itu**,
 *    bukan menurut kodenya. Kode shift cuma dicetak apa adanya.
 * 2. **Setiap warna punya varian gelap.** Polanya
 *    `bg-<c>-500/10 text-<c>-600 dark:text-<c>-400`, sama dengan
 *    `MDashboardStat`/`MDashboardList` — dan itu memang yang membuat
 *    badge tetap terbaca di kedua latar tanpa satu pun `dark:` yang
 *    lupa dipasang.
 */

export interface CellTone {
  /** Badge shift / status di dalam sel. */
  badge: string
  /** Latar + garis sel-nya sendiri. */
  cell: string
  /** Titik warna kecil di daftar agenda. */
  dot: string
}

/*
 * Enam slot. Cukup untuk pola roster mana pun yang pernah ditemui (tiga
 * shift operasional adalah yang terbanyak), dan berhenti di enam
 * dengan sengaja: warna ketujuh yang harus tetap bisa dibedakan dari
 * enam sebelumnya di dua latar sekaligus tidak ada lagi yang aman.
 * Kalau habis, slotnya berputar — dua shift berwarna sama masih jauh
 * lebih baik daripada satu shift tanpa warna.
 */
export const SHIFT_TONES: CellTone[] = [
  {
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    cell: 'bg-amber-500/5 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  {
    badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    cell: 'bg-sky-500/5 border-sky-500/30',
    dot: 'bg-sky-500',
  },
  {
    badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    cell: 'bg-violet-500/5 border-violet-500/30',
    dot: 'bg-violet-500',
  },
  {
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    cell: 'bg-emerald-500/5 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  {
    badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    cell: 'bg-rose-500/5 border-rose-500/30',
    dot: 'bg-rose-500',
  },
  {
    badge: 'bg-teal-500/15 text-teal-700 dark:text-teal-300',
    cell: 'bg-teal-500/5 border-teal-500/30',
    dot: 'bg-teal-500',
  },
]

/*
 * Warna keadaan yang **bukan** hari kerja.
 *
 * Dipisah dari palet shift supaya tidak pernah bertabrakan dengannya:
 * hari libur yang kebetulan sewarna dengan Shift 2 membuat sebulan
 * kalender terbaca salah dalam sekali lihat, dan itu justru satu-satunya
 * hal yang layar ini janjikan.
 */
export const STATE_TONES: Record<string, CellTone> = {
  field_break: {
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
    cell: 'bg-muted/40 border-border',
    dot: 'bg-slate-400',
  },
  travel_out: {
    badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    cell: 'bg-indigo-500/5 border-indigo-500/30',
    dot: 'bg-indigo-500',
  },
  travel_in: {
    badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
    cell: 'bg-cyan-500/5 border-cyan-500/30',
    dot: 'bg-cyan-500',
  },
  off: {
    badge: 'bg-muted text-muted-foreground',
    cell: 'bg-muted/40 border-border',
    dot: 'bg-muted-foreground/50',
  },
  holiday: {
    badge: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
    cell: 'bg-pink-500/5 border-pink-500/30',
    dot: 'bg-pink-500',
  },
  /*
   * Hari pemulihan: **di dalam blok kerja**, tapi sengaja tanpa shift.
   *
   * Warnanya dipilih supaya terbaca sebagai "istirahat yang memang
   * direncanakan", bukan sebagai lubang — karena itu ia punya latar dan
   * garis penuh seperti sel kerja, bukan garis putus-putus milik
   * `unplanned`. Sekaligus jelas berbeda dari `field_break` yang abu-abu
   * netral: yang satu jatah libur roster, yang satu lagi jeda yang lahir
   * dari pergantian shift, dan HR harus bisa membedakannya sekali lihat.
   */
  recovery: {
    badge: 'bg-lime-500/15 text-lime-700 dark:text-lime-300',
    cell: 'bg-lime-500/5 border-lime-500/30',
    dot: 'bg-lime-500',
  },
  /*
   * Sengaja **berbeda** dari `off`, dan bergaris putus-putus.
   * "Belum dijadwalkan" adalah pekerjaan HR yang belum dilakukan;
   * "off" adalah jadwal yang memang begitu. Kalau keduanya dirender
   * sama, tidak ada yang pernah tahu rosternya belum terbit.
   */
  unplanned: {
    badge: 'bg-muted text-muted-foreground',
    cell: 'border-dashed border-border bg-transparent',
    dot: 'bg-muted-foreground/30',
  },
  not_applicable: {
    badge: 'bg-muted text-muted-foreground',
    cell: 'bg-muted/25 border-border',
    dot: 'bg-muted-foreground/30',
  },
}

/*
 * Hari kerja yang **tidak punya shift** — bukan warna netral.
 *
 * Ini keadaan yang harus terlihat: masternya belum diisi, dan
 * merendernya seperti sel kosong biasa membuat lubang data terbaca
 * sebagai hari yang memang tenang.
 */
export const MISSING_SHIFT_TONE: CellTone = {
  badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  cell: 'bg-orange-500/5 border-orange-500/40 border-dashed',
  dot: 'bg-orange-500',
}

export const NEUTRAL_TONE: CellTone = {
  badge: 'bg-muted text-muted-foreground',
  cell: 'bg-card border-border',
  dot: 'bg-muted-foreground/40',
}
