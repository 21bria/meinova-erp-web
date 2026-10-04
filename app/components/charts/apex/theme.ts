import { computed } from "vue"

export function useApexTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === "dark")

  const textColor = computed(() =>
    isDark.value ? "#e5e7eb" : "#1e293b"
  )

  const borderColor = computed(() =>
    isDark.value ? "#334155" : "#e5e7eb"
  )

  /*
   * Warna **permukaan kartu**, dipakai sebagai celah antar-mark.
   *
   * Apex memisahkan irisan donut dengan garis, dan bawaannya putih —
   * benar di mode terang karena kebetulan sama dengan kartunya, dan di
   * mode gelap menjadi cincin putih terang yang justru lebih menarik
   * mata daripada datanya. Celah yang benar berwarna latar, bukan
   * warna apa pun: yang terbaca "dua irisan bersebelahan", bukan
   * "dua irisan dan satu garis".
   *
   * Nilainya mengikuti token `--card` (`oklch(1 0 0)` /
   * `oklch(0.205 0 0)`) yang dirasterkan ke hex — Apex menaruhnya di
   * atribut SVG, dan di situ hex yang paling aman.
   */
  const surfaceColor = computed(() =>
    isDark.value ? "#171717" : "#ffffff"
  )

  /*
   * Palet **kategori**: dipakai widget yang warnanya cuma pembeda —
   * irisan donut, batang yang backend-nya tidak menyebut warna. Apex
   * memutar daftar ini, jadi panjangnya menentukan berapa kategori
   * yang masih punya warna sendiri: dengan lima slot, donut berisi
   * sembilan irisan memberi warna yang sama kepada irisan ke-1 dan
   * ke-6.
   *
   * Sembilan slot karena itu batas atas yang bisa dikirim backend —
   * `MAX_CHART_SEGMENTS = 8` ditambah satu irisan "Lainnya".
   *
   * **Lima slot pertama tidak boleh digeser.** Chart lain sudah
   * memakainya (Leave Breakdown, Headcount by Company, …), dan menukar
   * urutannya mengecat ulang layar yang tidak sedang dikerjakan. Empat
   * slot terakhir ditambahkan 25 Ags 2026 dan divalidasi terhadap
   * kedua latar: tidak satu pun pasangan bertetangga baru yang jatuh
   * di bawah ambang keterbacaan, termasuk pasangan melingkar irisan
   * terakhir ↔ irisan pertama.
   *
   * Yang **belum** beres dan bukan bawaan perubahan ini: pasangan
   * slot 3 ↔ 4 (amber ↔ merah) memang berdempetan sejak awal.
   * Memperbaikinya berarti menggeser lima slot pertama — lihat di
   * atas — jadi itu keputusan tersendiri, bukan efek samping.
   *
   * Empat slot terakhir bernilai sama di kedua mode: pada ambang
   * terang yang masih terbaca di latar gelap, keduanya memang bertemu
   * di keluarga warna yang sama.
   */
  const defaultColors = computed(() =>
    isDark.value
      ? [
          "#60a5fa",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#0891b2",
          "#db2777",
          "#65a30d",
          "#c026d3",
        ]
      : [
          "#2563eb",
          "#16a34a",
          "#d97706",
          "#dc2626",
          "#7c3aed",
          "#0891b2",
          "#db2777",
          "#65a30d",
          "#a21caf",
        ]
  )

  /*
   * Palet **semantik**, dipakai widget yang warnanya membawa arti —
   * hijau hadir, kuning telat, merah tidak hadir. Backend mengirim
   * namanya, bukan hex-nya: hex yang terbaca jelas di latar putih
   * lazimnya kusam di mode gelap, dan yang tahu mode apa yang sedang
   * dipakai cuma sisi ini. Filosofi yang sama dengan `icon`/`color`
   * pada katalog aplikasi.
   *
   * **`primary` wajib ada di sini**, dan ketiadaannya sempat lolos
   * lama. Nama yang tidak dikenal dikembalikan apa adanya (lihat
   * `resolveColors`), dan "primary" bukan warna CSS — Apex jatuh ke
   * hitam. Di latar putih hasilnya terbaca seperti pilihan warna yang
   * disengaja; di mode gelap batangnya tenggelam ke latar. Dua chart
   * memakainya: "Permanent" di Manpower Summary dan "Regular OT" di
   * HR Period Summary.
   *
   * Nilainya mengikuti token `--primary` yang memang netral di desain
   * ini (nyaris hitam di terang, nyaris putih di gelap), cuma ditarik
   * satu langkah ke dalam — slate-700/slate-300 — supaya batang
   * sebesar itu tidak menjadi blok putih yang menyilaukan di sebelah
   * batang emas Contract.
   */
  const semanticColors = computed<Record<string, string>>(() =>
    isDark.value
      ? {
          primary: "#cbd5e1",
          success: "#22c55e",
          warning: "#eab308",
          danger: "#ef4444",
          info: "#60a5fa",
          neutral: "#94a3b8",
        }
      : {
          primary: "#334155",
          success: "#16a34a",
          warning: "#ca8a04",
          danger: "#dc2626",
          info: "#2563eb",
          neutral: "#64748b",
        },
  )

  /**
   * Menerjemahkan daftar warna yang bisa berupa nama semantik **atau**
   * nilai CSS apa adanya. Nama yang tidak dikenal dikembalikan apa
   * adanya — Apex sendiri yang menolaknya kalau memang bukan warna, dan
   * itu jauh lebih mudah dilacak daripada warna yang diam-diam diganti.
   */
  function resolveColors(values?: (string | null | undefined)[]): string[] {
    if (!values?.length)
      return []

    return values
      .filter((value): value is string => !!value)
      .map(value => semanticColors.value[value] ?? value)
  }

  return {
    isDark,
    textColor,
    borderColor,
    surfaceColor,
    defaultColors,
    semanticColors,
    resolveColors,
  }
}