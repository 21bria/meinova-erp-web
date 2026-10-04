/*
|--------------------------------------------------------------------------
| Gambar di balik endpoint berautentikasi
|--------------------------------------------------------------------------
|
| `uploads` menyajikan berkasnya lewat `/api/uploads/<public_id>/preview/`,
| dan endpoint itu menuntut `Authorization: Bearer ...`. Sebuah
| `<img src="...">` tidak pernah membawa header itu — permintaannya
| dijawab 401 dan yang terlihat di layar adalah ikon gambar rusak, untuk
| foto yang sebenarnya ada.
|
| Jadi gambarnya diambil lewat jalur yang sama dengan permintaan API
| lain, lalu dipasang sebagai object URL. Alamat `/media/...` yang lama
| (dilayani statis, tanpa pemeriksaan) tidak lewat sini sama sekali —
| lihat `needsAuthedFetch`.
|
| Hasilnya disimpan per alamat: satu halaman tabel memuat 25 baris, dan
| pindah halaman lalu kembali tidak boleh berarti 25 unduhan lagi.
| `preview/` membalas `Cache-Control: private, no-store`, jadi peramban
| tidak menyimpannya untuk kita.
*/

type BlobFetcher = (path: string) => Promise<Blob>

/*
 * Batas sengaja ada. Object URL hidup sampai `revokeObjectURL`, jadi
 * cache tanpa batas pada layar yang digulir lama adalah kebocoran
 * memori yang tumbuh sebesar foto yang pernah dilewati.
 */
const MAX_ENTRIES = 200

const cache = new Map<string, string>()
const inflight = new Map<string, Promise<string | null>>()

/*
 * Alamat yang sudah terbukti gagal tidak dicoba lagi. Tanpa ini, tiap
 * render ulang tabel mengulang permintaan yang sudah pasti 404 —
 * dan gagalnya diam, jadi tidak ada yang menyadarinya.
 */
const failed = new Set<string>()

function origin(): string {
  return typeof window === "undefined"
    ? "http://localhost"
    : window.location.origin
}

/**
 * Bagian jalur sebuah alamat, atau `null` kalau alamatnya tidak masuk
 * akal.
 *
 * Yang dipakai jalurnya, bukan alamat utuhnya: backend merakit alamat
 * absolut lewat `build_absolute_uri()`, yang memakai host yang dilihat
 * Django — di belakang proxy atau di dalam container, host itu belum
 * tentu host yang bisa dibuka peramban. `useApi` merakit ulang dari
 * `apiBaseUrl`, satu-satunya alamat yang pasti benar untuk klien.
 */
export function imagePath(source: string): string | null {
  if (!source || !source.trim())
    return null

  try {
    const url = new URL(source, origin())

    return `${url.pathname}${url.search}`
  }
  catch {
    return null
  }
}

/**
 * Benar kalau alamatnya harus diambil dengan token, bukan dipasang
 * langsung ke `<img>`.
 */
export function needsAuthedFetch(source: string): boolean {
  const path = imagePath(source)

  return Boolean(path && /^\/api\//.test(path))
}

function remember(key: string, objectUrl: string) {
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next()

    if (!oldest.done) {
      const stale = cache.get(oldest.value)

      cache.delete(oldest.value)

      if (stale)
        URL.revokeObjectURL(stale)
    }
  }

  cache.set(key, objectUrl)
}

/**
 * Object URL untuk sebuah gambar berautentikasi, atau `null` kalau
 * gambarnya tidak bisa diambil.
 *
 * `null`, bukan lemparan: pemanggilnya sebuah avatar, dan jawaban yang
 * benar untuk foto yang gagal dimuat adalah inisialnya — bukan error
 * yang naik ke layar.
 */
export function loadAuthedImage(
  source: string,
  fetcher: BlobFetcher,
): Promise<string | null> {
  const path = imagePath(source)

  if (!path)
    return Promise.resolve(null)

  const cached = cache.get(path)

  if (cached)
    return Promise.resolve(cached)

  if (failed.has(path))
    return Promise.resolve(null)

  const running = inflight.get(path)

  if (running)
    return running

  const request = fetcher(path)
    .then((blob) => {
      /*
       * Balasan yang bukan gambar tetap sebuah Blob — halaman error
       * HTML juga. Dipasang apa adanya ia jadi ikon gambar rusak,
       * jadi yang bukan gambar diperlakukan sebagai gagal.
       */
      if (!blob || !blob.size || !blob.type.startsWith("image/")) {
        failed.add(path)

        return null
      }

      const objectUrl = URL.createObjectURL(blob)

      remember(path, objectUrl)

      return objectUrl
    })
    .catch(() => {
      failed.add(path)

      return null
    })
    .finally(() => {
      inflight.delete(path)
    })

  inflight.set(path, request)

  return request
}

/** Hanya untuk test: mengosongkan seluruh simpanan. */
export function resetAuthedImageCache() {
  cache.forEach(url => URL.revokeObjectURL(url))

  cache.clear()
  inflight.clear()
  failed.clear()
}
