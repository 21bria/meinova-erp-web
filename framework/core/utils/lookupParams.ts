/*
 * Menerjemahkan `lookupParams` schema jadi query param yang siap kirim.
 *
 * Bentuknya `{"company_id": "$company"}` — nilai berawalan `$` menunjuk
 * field lain, sisanya konstanta. Yang induknya belum terisi **dibuang**,
 * bukan dikirim kosong: `?company_id=` dibaca backend sebagai penyaring
 * yang tidak cocok dengan apa pun, dan dropdown-nya jadi kosong total
 * alih-alih terbuka.
 *
 * Ditaruh di sini karena dipakai **dua** pemanggil dengan sumber nilai
 * yang berbeda — `MFormBuilder` (nilai form) dan `MCrudFilters` (nilai
 * filter di toolbar). Dua salinan resolver yang harus tetap sama adalah
 * persis cara bug ini lahir pertama kali: penyaringan berantai bekerja
 * di form dan diam-diam tidak berpengaruh di tabel.
 */
export function resolveLookupParams(
  lookupParams: Record<string, unknown> | undefined | null,
  values: Record<string, unknown> | undefined | null,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [param, raw] of Object.entries(lookupParams ?? {})) {
    if (typeof raw === 'string' && raw.startsWith('$')) {
      const parentValue = (values ?? {})[raw.slice(1)]

      if (
        parentValue !== undefined
        && parentValue !== null
        && parentValue !== ''
      ) {
        result[param] = parentValue
      }

      continue
    }

    result[param] = raw
  }

  return result
}
