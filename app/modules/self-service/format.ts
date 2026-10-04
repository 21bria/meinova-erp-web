/*
|--------------------------------------------------------------------------
| Cara menulis angka, bukan cara menghitungnya
|--------------------------------------------------------------------------
|
| Yang ada di berkas ini murni tipografi: 90 menit ditulis "1 jam 30
| menit", bukan "1,5 jam". Tidak satu pun aturan bisnis — jam mana yang
| terhitung lembur, saldo mana yang tersisa, dan siapa yang berhak
| mengajukan seluruhnya diputuskan backend.
|
| Dipisah dari komponennya supaya bisa diuji: repo ini menjalankan
| vitest di lingkungan `node` tanpa DOM, jadi apa pun yang tinggal di
| dalam `<template>` tidak pernah tersentuh satu test pun.
*/

export interface DurationText {
  key: string
  params: Record<string, number>
}

/**
 * Menit → kunci katalog beserta angkanya.
 *
 * Mengembalikan **kunci**, bukan kalimat: satu-satunya tempat yang boleh
 * merakit kalimat adalah katalog i18n, dan fungsi yang memulangkan
 * "1 jam 30 menit" akan berbahasa Indonesia untuk pembaca berbahasa
 * Inggris.
 *
 * Katalognya `me.duration.*`, **bukan** `me.cards.overtime.*`: fungsi ini
 * dipakai kartu Lembur *dan* kartu Jam Kerja di `/me/attendance`, dan
 * kunci yang menyandang nama satu kartu akan ikut berubah saat kalimat
 * kartu itu diperbaiki — menyeret kartu lain yang tidak ada urusannya.
 *
 * Nol menit tetap punya bentuk ("0 menit"), tapi kartu lembur tidak
 * memakainya: nol lembur adalah keadaan **kosong**, dan backend sudah
 * menandainya begitu. Bentuknya tetap disediakan supaya fungsi ini tidak
 * punya masukan yang tidak dijawabnya.
 */
export function durationText(totalMinutes: number): DurationText {
  const total = Math.max(0, Math.trunc(totalMinutes || 0))

  const hours = Math.floor(total / 60)
  const minutes = total % 60

  if (hours && minutes)
    return { key: 'me.duration.hoursMinutes', params: { hours, minutes } }

  if (hours)
    return { key: 'me.duration.hours', params: { hours } }

  return { key: 'me.duration.minutes', params: { minutes } }
}
