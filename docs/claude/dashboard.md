# Dashboard Runtime

> Curated dari CLAUDE.md lama. Baca hanya saat relevan.

<!-- original lines 44-68 -->
### Dashboard (`type: "dashboard"`)
Beda dari tiga tipe lain: yang digenerate **bukan form/tabel**, melainkan susunan widget. Schema-nya di-inline jadi `schema.ts` supaya halaman tidak perlu menembak endpoint schema saat runtime.

```
pnpm meinova generate hr/dashboard
  → app/modules/hr/dashboard/{schema.ts, page.vue, index.ts}
```

- `page.vue` isinya cuma `<MDashboard :schema="hrDashboardSchema" />` — seluruh rendering ada di runtime `framework/components/dashboard/`, tidak digenerate
- **Satu request untuk semua widget.** `useDashboard` menembak `schema.endpoint` sekali dengan `?mode=&start=&end=` plus filter aktif, lalu membagikan hasilnya per `widget.key`. Jangan diubah jadi satu request per widget
- Endpoint dashboard membalas envelope `{success, message, data}`, sedangkan `ui-schema/` membalas polos — `useDashboard` menangani dua-duanya
- **`value: null` dirender "—", bukan 0.** Backend mengirim null kalau periodenya memang belum punya data; menampilkan 0 terbaca sebagai "kehadiran nol persen". Begitu juga `trend: null` → bagian trennya disembunyikan
- `span` memakai grid 12 kolom. Tailwind tidak bisa menerima kelas yang dirakit runtime, jadi pemetaannya ditulis penuh di `spanClass()` (`framework/core/utils/dashboard.ts`) — **kalau menambah nilai span baru, tambahkan juga di situ**
- `lookup_params` pada filter memakai penanda `$namaFilter` (mis. `{"company_id": "$company"}`) yang diresolusi `MDashboardFilters` terhadap filter yang sedang aktif; `depends_on` yang me-*disable* dropdown sampai induknya diisi
- Widget `stat` dikumpulkan jadi satu baris tersendiri di atas; sisanya masuk grid 12 kolom mengikuti `order`
- **Di bawah `sm` kartu KPI jadi carousel** (`Carousel` shadcn/embla) yang digeser jari plus indikator titik; dari `sm` ke atas dia grid biasa. Dua-duanya dirender lalu dipilih lewat CSS (`sm:hidden` / `hidden sm:grid`), bukan `useMediaQuery`, supaya markup server dan klien sama

#### Angka panjang: kartu KPI dan sumbu chart

Dua aturan yang lahir dari dashboard pertama yang isinya rupiah (Payroll). Keduanya berbawaan "seperti sebelumnya", jadi dashboard yang angkanya pendek tidak berubah sedikit pun.

- **Ukuran huruf angka KPI mengikuti panjangnya** (`valueClass` di `MDashboardStat`). Enam kartu sebaris menyisakan ~138px per kartu, dan "Rp 132.378.341" pada `text-3xl` tampil "Rp 132…" — Gross Payroll dan Net Payroll jadi terbaca **sama persis** padahal selisihnya delapan juta. Hanya tingkat pertama yang membesar di `sm:`; sisanya tidak, karena kartunya justru paling **sempit** di layar lebar — di situlah keenamnya berbagi satu baris
- Yang diperkecil **hurufnya, bukan angkanya**. Pembulatan ke "Rp 132 jt" di kartu KPI menghilangkan tepat yang dicocokkan orang payroll dengan daftar transfer bank
- **Sumbu chart justru dipendekkan** (`formatDashboardAxis`): "Rp 20.000.000" selebar 110px, dan enam label sebanyak itu pada kartu selebar setengah layar bertumpuk jadi `Rp 20.000.0Rp 40.000.0Rp 6…`. Tooltip tetap memakai `formatDashboardValue`, jadi nilai tepatnya muncul begitu kursornya menyentuh titiknya
- Satuannya **rb / jt / M / T**, bukan K/M/B: "132M" berarti miliar bagi sebagian pembacanya — kesalahan seribu kali lipat yang tidak berbunyi

#### `summary: false` — chart yang jumlahnya bukan angka

`MDashboardChart` menampilkan ringkasan kecil di kanan judul: Total untuk chart distribusi, nilai titik terakhir untuk chart tren. Schema boleh mematikannya dengan `summary: false` (`dashboard.chart(..., summary=False)` di backend).

Dipakai Komposisi Payroll, yang memuat sisi penghasilan **dan** sisi potongan sekaligus: jumlah keduanya bukan gross, bukan net, dan bukan biaya — cuma dua bilangan berbeda arti yang dijumlahkan. Tercetak besar di sebelah judul, ia terbaca sebagai angka utama kartunya. Schema yang tidak menyebut apa-apa tetap mendapat ringkasannya.

#### Baris daftar yang bisa ditekan

`MDashboardList` menerima `link` dari **dua** tempat:

- `data.link` (dari resolver) menimpa `widget.link` (dari schema) untuk tombol "Lihat Semua". Ada karena tujuannya bisa bergantung data — "buka payroll run yang sedang dibaca" berisi id yang baru diketahui saat resolvernya jalan, sementara schema di-generate jadi berkas statis
- `row.link` menjadikan **barisnya** tautan. Yang diganti `component`-nya, bukan isinya dibungkus `<a>`: membungkus isi membuat area yang bisa ditekan cuma seluas teksnya, sementara yang ditekan orang adalah barisnya
- Baris yang tidak menyebut tujuan tetap `<li>` biasa. Kursor penunjuk pada baris yang tidak melakukan apa-apa adalah janji yang tidak ditepati
- **`:is` diberi komponen, bukan string.** `:is="'NuxtLink'"` menghasilkan elemen `<nuxtlink to="…">` — nama komponen yang cuma muncul sebagai string tidak ikut ditransformasi auto-import Nuxt, jadi Vue memperlakukannya sebagai elemen HTML biasa. Barisnya tampil normal, kursornya berubah, dan **tidak melakukan apa pun saat diklik**, tanpa satu pun error di konsol. Dipakai `resolveComponent("NuxtLink")`, idiom yang sudah lebih dulu ada di `DashboardKpi.vue`, `DashboardQuickActions.vue`, dan `DashboardFavoriteMenus.vue`. Ditemukan UAT browser Payroll Dashboard: keempat temuan "Perlu Ditindaklanjuti" bertaut ke run-nya dan tidak satu pun bisa dibuka
- **Tautan yang menuju halaman daftar ber-query filter adalah dead link.** Halaman daftar CRUD di FE tidak membaca query string jadi filter, jadi `/payroll/payroll-run-employees?run=8&status=error` membuka daftar seluruh tenant sambil terlihat seperti daftar tersaring — kegagalan paling sulit ketahuan, karena halamannya terbuka dan berisi

#### Filter periode
`MDashboardPeriodPicker` menggantikan dropdown bulan/tahun yang lama: satu tombol berisi label periode, panah geser kiri/kanan, dan popover berisi pilihan satuan (Harian / Mingguan / Bulanan / Tahunan / Kustom), kalender, serta preset ("7 hari terakhir", "Bulan lalu", …).
- Satuan yang boleh dipilih datang dari `filters[].modes` di schema backend — bukan daftar tetap di FE. Backend juga menolak mode di luar daftar itu
- Perhitungan rentangnya dicerminkan di `framework/core/utils/dashboard.ts` (`rangeForMode`, `shiftPeriod`, `periodRangeLabel`) supaya label tombol berubah seketika tanpa menunggu respons. **Kalau aturan periode di backend berubah, dua sisi ini harus ikut disamakan** — terutama awal minggu (Senin) dan batas bulan
- Kalender reka-ui wajib diberi `locale="id-ID"` dan `:week-starts-on="1"`; bawaannya Inggris dengan minggu mulai Minggu, dan blok yang tersorot jadi bukan minggu yang benar-benar dihitung backend
- Ganti satuan **menjangkar ke tanggal mulai yang sedang aktif**, bukan melompat ke hari ini: dari "Agustus" ke "Mingguan" mendarat di minggu pertama Agustus
- Respons yang datang terlambat dibuang (`requestId` di `useDashboard`) — klik cepat pada panah periode pernah membuat angka periode lama mendarat belakangan

#### Quick vs Advanced Filter
Filter lookup membawa `placement` dari backend (`"quick"` | `"advanced"`, bawaan `"quick"`).
- Yang `quick` berdiri di kepala halaman lewat `MDashboardFilters`; yang `advanced` masuk panel geser `MDashboardAdvancedFilters` — bentuk dan sebutannya sengaja sama persis dengan Advanced Filter di toolbar CRUD (`MCrudToolbar`)
- Tombol Advanced Filter + tombol Reset **hanya muncul kalau ada filter ber-`placement: "advanced"`**. Dashboard lama yang tidak menyebut `placement` tidak berubah tampilannya sama sekali
- Panelnya tidak punya tombol Apply: `useDashboard` sudah memuat ulang tiap kali filter berubah, dan Apply akan menciptakan dua keadaan yang bisa berbeda (yang terlihat di panel vs yang sedang dihitung)
- Reset mengosongkan seluruh filter lookup, **bukan** periodenya — "tanpa periode" bukan keadaan yang bisa ditampilkan, dan melompat ke bulan berjalan mengubah angka yang sedang dibaca orang tanpa diminta

#### Dashboard tanpa periode

Schema boleh **tidak** mendeklarasikan filter bertipe `period`. Tiga
layar hari ini begitu, dan ketiganya laporan yang membaca **master**,
bukan transaksi: **Employee Reporting Audit**
(`reports/hr/employee-reporting-audit`), **Manpower Summary**
(`reports/hr/manpower-summary`), dan **Contract Expiry**
(`reports/hr/contract-expiry`) — tidak satu pun kolomnya berubah karena
bulan yang dipilih.

Dua hal yang ikut hilang saat `periodFilter` kosong, dan **keduanya
harus hilang bersamaan**:

- `MDashboardPeriodPicker` di kanan atas (`v-if="periodFilter"`, sudah
  begitu sejak awal);
- **label periode + badge rentang di kepala halaman** — ini yang dulu
  tertinggal. Laporan tanpa periode tetap menampilkan "Agustus 2026ㆍ31
  hari" di bawah judulnya, padahal tidak ada pemilih bulan di mana pun
  dan angkanya tidak tersaring bulan apa pun. Yang membacanya
  menyimpulkan laporannya per bulan, lalu mencari pemilih yang memang
  sengaja tidak ada.

`useDashboard` **tetap** menghitung `period` untuk semua dashboard dan
tetap mengirim `?mode=&start=&end=`; yang berubah cuma apakah ia
ditampilkan. Backend laporan tanpa periode mengabaikannya
(`get_period()` mengembalikan `{}`), jadi tidak ada yang perlu
disinkronkan di dua sisi.

Ketiga dashboard lain (`hr/dashboard`, `administration/dashboard`,
`reports/hr/period-summary`) semuanya menyebut filter periode, jadi
tampilan mereka tidak bergeser sedikit pun.

**Tanpa periode bukan berarti "pakai pemilih tanggal".** Contract Expiry
menghitung sisa hari dari **hari server saat request dilayani**, dan
As Of Date yang bisa dipilih sengaja **belum** dibuat: runtime filter
dashboard hari ini cuma melayani dua bentuk — pemilih periode dan
dropdown lookup (`MDashboardFilters.vue`). Menambahkan pemilih tanggal
berarti bentuk ketiga di runtime, dan memakai pemilih **periode bulan**
untuk laporan yang butuh satu tanggal menghasilkan kotak yang terbaca
seperti konfigurasi hidup padahal tidak menggeser satu angka pun.
Keputusannya ada di backend (`docs/claude/reports.md`, bagian "Contract
Expiry"); **jangan menambahkannya dari sisi FE saja.**

**Bunyi chart kosong ikut ada-tidaknya periode.** `MDashboard`
mengirim `empty-message` ke tiap `MDashboardChart`: `"Belum ada data
pada periode ini."` untuk dashboard berperiode (persis seperti
sebelumnya), `"Belum ada data pada filter ini."` untuk laporan potret.
Kalimat pertama menyuruh pembacanya mengganti pemilih periode — dan di
laporan potret pemilih itu memang tidak ada, jadi ia mengirim orang
mencari kontrol yang tidak pernah dibuat.

#### Filter Organization Scope

Company dan Location **bercentang banyak** (`multiple: true`) di seluruh
dashboard dan laporan; nilainya dikirim `?company=1,2`.

- **Isi dropdown datang dari backend yang sudah tersaring cakupan**
  (`/api/administration/organization/lookup/<jenis>/`). FE tidak
  menghitung cakupan apa pun, dan tidak boleh mulai
- **Tidak ada yang dicentang = tanpa penyaringan**, bukan tanpa hasil.
  Yang tampil tetap seluruh data **dalam cakupan** penggunanya
- Filter hanya **mempersempit**. Id di luar cakupan yang dipaksa lewat
  query string tetap membalas nol — penjagaannya di backend
  (`DataScopeService`), bukan di dropdown ini
- Branch/Location/Department/Section menunggu induknya lewat
  `depends_on`, dan `lookup_params` mengirim **seluruh** induk yang
  sudah terisi. Dengan dua company tercentang, daftar lokasinya
  gabungan keduanya

**Induk bercentang banyak mengubah bentuk "belum dipilih" dari `null`
jadi `[]`, dan array kosong itu truthy.** Dua tempat di
`MDashboardFilters.vue` pernah membacanya salah sekaligus, dan
`normalizeDepend()` sekarang jadi satu-satunya penentu "terisi" untuk
keduanya:

- `lookup_params` — `[]` yang dikirim apa adanya mendarat sebagai
  `company_id=` di query string, dan dropdown turunannya menyaring ke
  **nilai kosong** alih-alih tidak menyaring;
- `isDisabled()` — tanpa normalisasi, dropdown Location menyala padahal
  Company belum dicentang satu pun, lalu menampilkan lokasi seluruh
  tenant.

#### Tombol `self_filter` ("Lokasi Saya")

Pintasan satu-tekan yang mengisi sebuah filter dari profil penggunanya,
ditulis di schema dengan dialek `$me.<jalur>` yang sama dengan schema
form. Jalurnya hari ini `$me.data_scope.self_filter.location`.

- Nilainya boleh **satu angka atau daftar**, dan `toArray()` menerima
  keduanya. **Backend yang memutuskan bentuknya** — FE tidak pernah
  tahu siapa yang direksi, dan aturan yang ditulis di sini akan
  menyimpang dari cakupan yang ditegakkan backend tanpa ada yang
  menyadarinya
- **Tidak menyala sendiri saat halaman dibuka.** Angka pertama yang
  dilihat orang harus angka utuh
- `isSelfActive` menyala hanya kalau filternya berisi **persis** pilihan
  tombol itu. Mencabut satu lokasi untuk drill-down memadamkannya — dan
  itu benar: yang tampil bukan lagi "lokasi saya"
- Profil tanpa lokasi tidak mendapat tombolnya sama sekali; **super
  admin juga tidak** — cakupannya memang seluruh tenant

Aturan final isinya (ditegakkan backend, dicatat di sini karena inilah
yang dilihat pengguna saat menekannya):

| Pengguna | Hasil tekan |
|---|---|
| Direksi (`BOARD`/`BOD`) | lokasi **penempatannya**, tercentang di seluruh badan usaha yang boleh ia lihat — `demo.bod1` duduk di `JKT-HO` → 2 centang → Headcount 11 |
| Executive, GM HO/Site, Management, HR, Employee | satu Location penempatannya |
| Super admin | tidak mendapat tombolnya |

Menekan tombol karena itu **sama persis** dengan memilih "Jakarta Head
Office" di dropdown. Sempat tidak: tombolnya mencentang seluruh cakupan,
jadi Headcount tidak bergerak sama sekali (30 → 30) dan terbaca seperti
tombol rusak.

**Label Location** menyebut company hanya kalau namanya ambigu
("Jakarta Head Office — MMR"), dan untuk **direksi** dropdown-nya
dikelompokkan per **kode lokasi**: satu baris "Jakarta Head Office"
mewakili MNI *dan* MMR sekaligus. `value` tetap `Location.id` (id
terkecil sebagai wakil) — tidak ada bentuk data baru, dan backend yang
menerjemahkan wakil itu kembali ke seluruh id ber-kode sama. Drill-down
per perusahaan untuk direksi pindah ke filter **Company**, yang di-AND
dengan Location.

#### Widget `table` — paginasi sisi server
Dipakai laporan berbaris banyak (HR Period Summary). Widget-nya membawa `page_size`, `page_size_options`, `searchable`, `search_placeholder` dari schema backend.
- **Yang dipaginasi hanya tabelnya.** `total` dan baris `totals` di respons selalu dihitung dari seluruh dataset yang lolos filter — angka yang sama dengan KPI. Pindah halaman tidak boleh menggeser satu angka pun di luar tabel; kalau bisa, kartu KPI berhenti jadi ringkasan
- Halaman berikutnya diminta lewat `useDashboard.loadWidget(key, {page, page_size, search})` yang menembak `?widget=<key>` — **bukan** `load()`. `load()` memuat ulang seluruh widget, dan enam kartu KPI yang berkedip jadi kerangka lalu kembali ke angka yang sama terbaca seperti angkanya ikut dihitung ulang per halaman
- Ini satu-satunya pengecualian aturan "satu request untuk semua widget" di atas, dan hanya untuk widget yang state-nya berpindah sendiri
- `matched` (yang lolos kotak cari) yang dipakai menghitung jumlah halaman, bukan `total`. Kaki tabelnya `MPagination` yang sama dengan tabel CRUD
- Kotak cari **bukan filter laporan**: ia menyaring baris tabel saja dan tidak menyentuh KPI/chart. Diketik dengan jeda 350 ms — tiap huruf memicu satu perakitan ulang agregasi di server
- Filter/periode berganti → halaman kembali ke 1 **dan kotak cari dikosongkan**, karena `load()` membalas halaman pertama tanpa pencarian; kata kunci yang tertinggal di kotak akan berdiri di atas tabel yang tidak menyaringnya
- **Label penghitung baris di kanan atas kartu ikut schema** (`total_label`, bawaan `"Pegawai"`). Tidak semua tabel laporan berisi satu baris per pegawai: Manpower Summary satu barisnya satu **kelompok organisasi**, jadi "Pegawai 11" di sana menyebut angka yang bukan jumlah orangnya — tepat di sebelah kartu KPI yang berbunyi 30. Backend mengirim `total_label: "Kelompok"` untuk tabel itu; dua laporan HR lain tidak menyebutnya dan tetap berbunyi "Pegawai"
- Kepala tabel dan baris Total menempel (`sticky top-0` / `sticky bottom-0` per sel, bukan pada `<thead>`), kolom pertama terkunci mendatar (`sticky_columns`). Latar sel yang menempel **wajib pekat** — `bg-muted/40` yang tembus pandang membuat baris yang lewat di belakangnya terbaca menembus judul kolom
- **Baris Total hanya berdiri kalau ada kolom yang benar-benar menampilkannya.** `data.totals` tidak dijanjikan sekunci dengan kolom tabelnya: HR Period Summary dan Manpower Summary mengirimnya per kolom, tapi Contract Expiry mengirim rekap **per bucket** (`expired`, `expiring_30`, …) yang tidak satu pun namanya sama dengan nama kolom — yang dijumlahkan di sana memang bukan isi kolom mana pun. Tanpa penjagaan itu yang muncul adalah baris tebal berisi kata "Total" dan tujuh belas sel kosong, dan baris jumlah yang kosong seluruhnya terbaca sebagai angka yang **gagal dimuat**, bukan sebagai "memang tidak ada yang dijumlahkan". Penyaringnya ada **di dalam computed `totals`** (`MDashboardTable.vue`), bukan sebagai penanda boolean di sebelahnya: `v-if` pada penanda terpisah tidak menyempitkan tipe `totals` di dalam bloknya, dan tiap pembacaan sel jadi "possibly null" di `vue-tsc`
- **Label penghitung bawaan kini lewat katalog** (`common.labels.employees`: "Employees"/"Karyawan"); `total_label` dari schema tetap menang. Teks kotak cari dan baris Total juga lewat katalog (`common.state.searchMatched`, `common.state.searchNoMatch`, `common.actions.clearSearch`, `common.labels.total`)

#### Label kolom tabel ikut bahasa (17 Sep 2026)
`useDashboard` melokalkan `columns[].label` untuk widget **`table`** dengan kunci `<namespace>.fields.<kolom>` — ruang kunci yang sama dengan label widget. Kolom `list` sengaja tidak disentuh. Katalognya baru diisi untuk HR Period Summary (`app/i18n/locales/{en,id}/reports.ts`), dan `module-fields.spec.ts` mewajibkan kolom hanya untuk namespace di `COLUMN_CATALOGS`. Tabel laporan lain (Contract Expiry, Employee Reporting Audit, Manpower Movement/Summary) masih jatuh ke label Inggris dari schema; menambahkannya = isi katalognya lalu tambahkan namespace-nya ke set itu.

#### i18n dashboard bersama (18 Sep 2026)

Empat sumber teks, dan yang menentukan bukan komponennya melainkan **dari mana teksnya datang**:

| Kategori | Otoritas | Mekanisme |
|---|---|---|
| Label periode & satuan | frontend | `Intl` untuk nama bulan (`monthLabel`/`monthAbbr` tidak lagi memegang dua daftar tulis tangan), `common.period.modes.*` untuk satuan, `common.period.quarterLabel` untuk kuartal, `PERIOD_PRESETS[].labelKey` untuk pintasan |
| Teks komponen (tombol, aria-label, empty state) | frontend | katalog `common.*` lewat `translate()` |
| Nama deret/irisan chart | **backend mengirim kode**, frontend menerjemahkan | `datasets[].code` / `series[].code` (`apps/framework/charts.py`) → `common.series.<kode>` → `common.status.<kode>` → `label` API |
| Placeholder pencarian tabel | **backend mengirim kode konteks** | `search_placeholder_key` di schema → `common.placeholder.<kode>`; `search_placeholder` tetap jadi teks cadangan |
| Deskripsi widget | frontend, per modul | `<namespace>.description.<widget>` di katalog modul, fallback ke teks schema |
| Nama tenant (department, tipe cuti, nama pegawai) | **tidak pernah diterjemahkan** | tanpa `code`, `seriesLabel()` mengembalikan label apa adanya |

**Kenapa kode, bukan pencocokan teks.** Legend "Hadir"/"Telat" dirakit di Python, jadi ia selalu berbahasa penulisnya. Menukarnya di frontend dengan mencocokkan teks berarti nama department dan nama tipe cuti milik tenant ikut tertukar begitu salah satunya kebetulan sebunyi — dan itu kegagalan yang tidak menimbulkan error apa pun.

**Judul pemilih periode tidak lewat kamus bersama.** `common.fields.period` berisi "Periode Penggajian" (benar untuk Payroll), jadi `periodFilterLabel` di `useDashboard` mencari katalog modul lalu jatuh ke `common.labels.period_filter` — bukan ke `resourceLabel()` yang akan menariknya ke arti Payroll.

**Periode selamat saat bahasa berganti.** `app/layouts/default.vue` memasang `:key="locale"` supaya label yang dihitung sekali di `setup` ikut berganti bahasa; konsekuensinya seluruh state lokal halaman lahir ulang, dan periode laporan kembali ke bulan berjalan. Yang diperbaiki **bukan** `:key`-nya melainkan siklus hidup state-nya: `framework/core/composables/dashboardSession.ts` menyimpan periode + filter per modul di luar komponen, dan `useDashboard` membacanya saat lahir kembali lalu menulisnya tiap kali berubah. Client saja — di SSR fungsinya no-op, karena satu proses server melayani banyak request.

Yang **tidak** ikut disimpan: halaman tabel dan kotak cari (state tampilan, bukan query laporan), bahasa, dan sesi.

Adopter kode deret saat ini baru HR Period Summary. HR Dashboard, Payroll Dashboard, Manpower Summary/Movement, dan Contract Expiry masih mengirim `label` tanpa `code`, jadi legendanya tetap seperti sebelumnya sampai ikut mengadopsi `apps/framework/charts.py`.

Test: `framework/core/utils/__tests__/dashboard-i18n.spec.ts`, `apps/framework/tests_charts.py`, `apps/reports/tests/hr/test_period_summary_charts.py`.

#### Dialog drill-down — kontrak audit (17 Sep 2026)
Kontrak backend: `backend-erp/docs/claude/reports.md` § "Drill-down: kontrak audit". Frontend **hanya memformat** — `framework/core/utils/drilldown.ts`:
- `drilldownColumns(detail)` memilih kolom dari `detail_kind` (`late`, `early`, `attendance_day`, `leave`, `overtime`, `roster`). Payload lama tanpa `detail_kind` tetap mendapat empat kolom lama (Tanggal/Keterangan/Referensi/Nilai)
- `drilldownSummary(detail)` → "4 kejadian · total 2j 15m · sumber Kehadiran". Kejadian dan durasi disebut berdampingan; jam OT disebut sebagai menit **dan** agregat jam tabel ("total 6j 30m = 6,5 jam")
- **Durasi tidak pernah dihitung dari jam.** `duration_minutes` dari backend sudah dipotong toleransi; 08:00 → 08:27 boleh tertulis 12m. `null` → "—" dan subjudul menyebut berapa kejadian tanpa durasi
- Judul dialog = label kolom yang sudah dilokalkan (satu kunci untuk kolom dan dialog). Nama pegawai dari `detail.employee.name` bila ada
- Sumber (`source_code`) diterjemahkan lewat `common.drilldown.sources.*`; tombol "Buka {source}" tetap memakai `link` dari backend, tidak dirakit di sini
- `isDrillable()` — nol/kosong tidak membuka dialog
- Kunci: `common.drilldown.*` (`app/i18n/locales/{en,id}/common-drilldown.ts`). Test: `framework/core/utils/__tests__/drilldown.spec.ts`

#### Warna chart — palet semantik

Backend mengirim **nama** warna per dataset (`{"label": …, "data": […],
"color": "primary"}`), bukan hex. Yang menerjemahkannya
`useApexTheme().resolveColors()` (`app/components/charts/apex/theme.ts`),
dan ia punya dua nilai per nama: satu untuk mode terang, satu untuk
gelap. Hex yang terbaca jelas di latar putih lazimnya kusam di mode
gelap, dan yang tahu mode apa yang sedang dipakai cuma sisi ini.

Nama yang dikenal: `primary`, `success`, `warning`, `danger`, `info`,
`neutral`.

**Nama yang tidak dikenal dikembalikan apa adanya**, dan di situ letak
jebakannya: ApexCharts menerima string `"primary"`, gagal membacanya
sebagai warna CSS, lalu jatuh ke **hitam**. Di latar putih hasilnya
terbaca seperti pilihan warna yang disengaja — jadi tidak ada yang
melaporkannya — dan di mode gelap batangnya tenggelam ke latar kartu.
`primary` sempat memang tidak ada di palet ini; dua chart memakainya
("Permanent" di Manpower Summary, "Regular OT" di HR Period Summary),
dan keduanya hitam sampai 24 Ags 2026.

Nilainya mengikuti token `--primary` yang di desain ini memang **netral**
(nyaris hitam di terang, nyaris putih di gelap), ditarik satu langkah ke
dalam — slate-700 / slate-300 — supaya batang selebar itu tidak menjadi
blok putih yang menyilaukan di sebelah batang emas `warning`.

**Kalau backend memakai nama warna baru, tambahkan dulu di sini.**
Gejala lupanya bukan error, melainkan batang hitam.

**Palet kategori (`defaultColors`) panjangnya sembilan, dan itu bukan
angka bulat yang dipilih asal.** Ia dipakai widget yang warnanya cuma
pembeda — irisan donut, batang yang backend-nya tidak menyebut warna —
dan Apex **memutar** daftar itu kalau kategorinya lebih banyak. Sembilan
adalah batas atas yang bisa dikirim backend: `MAX_CHART_SEGMENTS = 8`
ditambah satu irisan `Lainnya`.

Sampai 25 Ags 2026 isinya cuma lima, dan itu menghasilkan tabrakan yang
tidak pernah dilaporkan siapa pun: "Headcount by Employee Group" di
Manpower Summary punya **enam** irisan, jadi irisan keenam
("Executive") diwarnai biru yang sama persis dengan irisan pertama
("Local Employee"). Dua kelompok berbeda, satu warna, dan legendanya
tetap terlihat benar.

**Lima slot pertama jangan digeser.** Chart lain sudah memakainya, dan
menukar urutannya mengecat ulang layar yang tidak sedang dikerjakan.
Empat slot terakhir divalidasi terhadap kedua latar sebelum dipasang —
termasuk pasangan melingkar irisan terakhir ↔ irisan pertama, yang
memang bersebelahan di donut.

Yang **belum** beres dan bukan bawaan perubahan itu: slot 3 ↔ 4
(amber ↔ merah) berdempetan sejak awal dan cuma terbaca jelas oleh mata
normal. Memperbaikinya berarti menggeser lima slot pertama, jadi itu
keputusan tersendiri — tercatat sebagai NEXT.

#### Donut (`BaseDonut.vue` + `MDashboardChart.vue`)

**Donut menerima dua bentuk data.** `series` (satu titik per irisan —
Leave Breakdown) **dan** `datasets` + `categories` (satu deret berisi
seluruh irisan — Expiring by Department). Bentuk kedua ditambahkan saat
Expiring by Department berganti dari batang ke donut: resolver-nya sudah
memotong Top 8 + `Lainnya` dan bentuk itu **tidak** diubah hanya karena
tampilannya berganti. Tanpa cabang itu donutnya menggambar `series` yang
kosong — kartunya berbunyi "Belum ada data" di sebelah ringkasan Total
yang jelas-jelas berisi.

**Warna donut menempel pada irisan, bukan pada deret.** Pada bentuk
`datasets` warnanya disebut sekali untuk seluruh deret (`"warning"`) —
benar untuk batang, salah untuk donut: Apex memutar daftar warna, jadi
satu nama warna mengecat **semua** irisannya kuning dan yang tersisa
cuma legendanya. Karena itu `donutColors` membuang warna deret pada
bentuk `datasets` dan menyerahkannya ke palet kategori. Bentuk `series`
tidak terpengaruh — di sana warnanya memang disebut per titik.

**Celah antar-irisan berwarna permukaan kartu** (`surfaceColor`), bukan
putih. Bawaan Apex putih tetap: benar di mode terang karena kebetulan
sama dengan kartunya, dan di mode gelap menjadi cincin putih terang yang
lebih menarik mata daripada datanya.

**Teks di tengah donut memakai tinta teks, bukan warna irisan.** Bawaan
Apex mewarnai nama irisan yang sedang disorot dengan warna deretnya dan
angkanya dengan putih tetapnya sendiri (`#f6f7f8`) — dua tinta yang
tidak dikenal sistem warna ini, dan yang kedua tidak pernah ikut
berganti mode. Identitas irisan sudah dibawa cincin, legenda, dan
tooltip-nya.

Isi tengahnya berganti mengikuti irisan yang disorot, lalu kembali ke
`Total` saat pointer menjauh — itu perilaku bawaan Apex dan memang
berguna. Yang perlu diingat kalau menulis test: membaca tinta tengah
tepat sesudah menguji tooltip akan mengukur label hover, bukan `Total`.

#### Sumbu bar chart (`BaseBar.vue`)

Dua hal diatur di sini, dan keduanya berlaku untuk **seluruh** bar chart
— jadi periksa Manpower Summary dan HR Period Summary kalau mengubahnya.

**Sumbu nilai yang isinya cacahan dibulatkan.** Apex membagi sumbu nilai
jadi lima ruas berapa pun rentangnya, jadi chart yang puncaknya 1 dapat
sumbu `0 | 0,2 | 0,4 | 0,6 | 0,8 | 1` — "0,8 kontrak", "2,5 department".
Formatter tidak menolong: yang salah **letak tick**-nya, bukan cara
mencetaknya, dan membulatkan labelnya menghasilkan sumbu `1 1 1 0 0 0`.
Yang dilakukan: `tickAmount` disamakan dengan nilai terbesar, hanya
untuk deret yang **seluruh** nilainya bulat dan puncaknya ≤ 8. Di atas
itu Apex sudah memilih kelipatan wajar sendiri (0, 200, 400, …), dan
satu tick per satuan justru tidak terbaca. Satu nilai pecahan saja
membatalkannya — itu sebabnya Overtime Trend (jam, bukan cacahan) tetap
memakai perhitungan Apex.

**Label kategori yang lebar dan banyak dimiringkan −45°.** Hanya pada
batang **tegak**, karena di situ kategorinya berbaris di sumbu X. Dua
belas label "Agu 2026" berdempetan tanpa spasi di kartu span-8 dan
terbaca "Agu 2026Sep 2026Okt 2026"; Apex tidak memiringkannya sendiri
karena label yang persis bersinggungan belum dihitung bertindih. Lebar
sebenarnya tidak diketahui saat opsi disusun, jadi ambangnya perkiraan
dari panjang teks — **≥ 8 karakter dan > 6 kategori**. Sengaja
konservatif: sumbu `Sep '25` milik HR Period Summary (7 karakter) tetap
mendatar seperti sebelumnya. Kalau suatu saat ada sumbu bulan yang
berdempetan lagi, ambang inilah yang digeser, bukan datanya.

#### Responsif: tablet & ponsel

Tiga hal yang menentukan, dan ketiganya pernah salah sekaligus di HR
Period Summary.

**1. `min-w-0` pada pembungkus widget** (`MDashboard.vue`). Item grid
bawaannya `min-width: auto` — ia **menolak menyusut di bawah lebar
isinya**. Tabel laporan berisi sembilan belas kolom punya lebar alami
sekitar dua ribu piksel, jadi tanpa `min-w-0` kolom gridnya ikut
melebar dan yang tergulir mendatar adalah **seluruh halaman**, bukan
tabelnya. Gejalanya persis "tidak responsif": judul, filter, dan kartu
KPI ikut terseret ke kanan, dan `overflow-auto` milik tabel tidak
pernah kebagian bekerja karena tidak ada yang memaksanya meluap.

Ini penyebab yang paling sering terlewat karena tidak ada satu pun
elemen yang terlihat salah — yang salah adalah elemen yang *tidak*
menyusut.

**2. Kolom terkunci hanya dari `md`** (`MDashboardTable.vue`). Dua
kolom terkunci selebar 104px + 224px memakan 328px dari layar 375px;
yang tersisa untuk digulir sekitar 47px. Tabelnya secara teknis
berfungsi dan secara praktis tidak bisa dibaca. `left`-nya karena itu
dikirim sebagai custom property `--sticky-left` dan dipasang lewat
kelas `md:left-[var(--sticky-left)]` — nilai inline tidak punya varian
layar. Kepala tabel tetap menempel menegak (`top-0`) di semua ukuran.

**3. `SPAN_CLASS` di `md` hanya membagi span 6** (`core/utils/
dashboard.ts`). Kartu span 8 dan 10 sudah penuh selebar baris di
tablet, jadi kartu span 1–5 di sebelahnya tidak pernah dapat pasangan:
ia mengambil setengah baris dan menyisakan setengahnya kosong. Pola
8-4-8-4 menghasilkan dua baris yang separuhnya melompong, dan yang
terlihat bukan "kartunya memang sedikit" melainkan tata letak yang
rusak. Span 6 tetap berbagi baris karena 6+6 selalu berpasangan pas.

Widget `stat` **tidak** lewat `spanClass` — ia punya grid sendiri
(carousel di ponsel, `statGridClass()` dari `sm` ke atas), jadi `span`
pada stat tidak berpengaruh sama sekali.

**Jumlah kolom baris KPI mengikuti jumlah kartunya** (`statGridClass()`
di `core/utils/dashboard.ts`). Sebelumnya barisnya selalu
`xl:grid-cols-6`, dan itu benar selama setiap dashboard kebetulan punya
persis enam kartu — HR Dashboard, Administration Dashboard, dan HR
Period Summary semuanya begitu. Manpower Summary yang pertama tidak:
empat kartu di grid enam kolom meninggalkan dua sel kosong di ujung
kanan, dan ruang kosong di sebelah kartu terakhir terbaca sebagai
kartu yang gagal dimuat, bukan sebagai kartu yang memang cuma empat.
Enam ke atas mengembalikan kelas yang sama persis dengan sebelumnya.

Kelasnya ditulis penuh per jumlah, alasan yang sama dengan
`SPAN_CLASS`: Tailwind memindai sumber apa adanya dan
`grid-cols-${n}` yang dirakit saat runtime akan ter-purge.

**Tabel di dalam dialog** butuh pembungkus `overflow-x-auto` sendiri.
Dialog drill-down berisi kolom jam, keterangan, dan nomor dokumen yang tidak
muat di lebar dialog ponsel, dan tanpa pembungkus yang terjadi bukan
gulir melainkan kolom yang saling menghimpit sampai tidak terbaca.

#### Layar yang memakai runtime ini

Tujuh, dan semuanya digenerate dari schema backend — **tidak ada satu
pun yang menulis susunan widget-nya sendiri**.

| Module | Rute | Periode |
|---|---|---|
| `hr/dashboard` | `/hr` | ada |
| `payroll/dashboard` | `/payroll/dashboard` | **tidak ada** — disaring Payroll Period & Payroll Run, dokumen, bukan rentang tanggal |
| `administration/dashboard` | `/administration` | ada |
| `reports/hr/period-summary` | `/reports/hr/period-summary` | ada |
| `reports/hr/employee-reporting-audit` | `/reports/hr/employee-reporting-audit` | **tidak ada** |
| `reports/hr/manpower-summary` | `/reports/hr/manpower-summary` | **tidak ada** |
| `reports/hr/contract-expiry` | `/reports/hr/contract-expiry` | **tidak ada** |

Menambah satu layar = empat sentuhan, dan tiga di antaranya di luar
`app/modules/`:

```bash
node scripts/meinova/cli.mjs generate <module>
```

1. generate module-nya (`schema.ts`, `page.vue`, `index.ts`);
2. `app/pages/<rute>.vue` yang tipis — cuma me-mount `page.vue`
   module-nya, dengan `definePageMeta({ module })`;
3. `app/constants/menus.ts` — **cerminan** `apps/accounts/seeds/menus.py`
   di backend. Rute yang tidak ada di seed backend tidak bisa dibatasi
   per role, jadi keduanya harus disentuh bersamaan, dan seed-nya perlu
   dijalankan untuk tenant yang sudah berdiri
   (`tenant_command seed_menus --skip-roles`);
4. kartu hub di `app/registry/section-hub/<section>.ts` — ikut tersaring
   `RoleMenuPermission` lewat `MasterHub`, jadi kartunya ikut hilang
   sendiri untuk role yang tidak berhak.

**Employee Reporting Audit** (`/reports/hr/employee-reporting-audit`)
adalah laporan master organisasi: satu tabel 19 kolom berisi struktur
pegawai, garis pelaporan, dan akun login-nya. Tanpa periode, tanpa KPI,
tanpa chart, dan tanpa drill-down. Dua hal yang perlu diketahui saat
membaca layarnya, dan keduanya diputuskan backend:

- **Feature Applicability tidak menyaringnya.** Direksi tetap terbit
  walau seluruh flag group `BOARD` dimatikan — di tenant peragaan HR
  Period Summary menghitung 28 pegawai, laporan ini menerbitkan 30.
- **Kotak carinya mencocokkan atasan juga.** Mengetik nomor seorang
  manajer menghasilkan barisnya **dan** seluruh bawahannya; itu bukan
  bug, itu yang dicari pengaudit.

Kontrak lengkapnya (sumber tiap kolom, semantik status, aturan cakupan)
ada di backend: `docs/claude/reports.md` bagian "Employee Reporting
Audit".

**Contract Expiry** (`/reports/hr/contract-expiry`) adalah laporan
masa kontrak: lima kartu KPI, dua chart batang, dan satu tabel 18 kolom
berisi **daftar orang** — bukan agregat, karena yang dicari pembacanya
justru nama yang harus dihubungi minggu ini. Layar ini **nol runtime
baru**; yang perlu diketahui saat membacanya:

- **Empat kartu pertama tidak menjumlah ke kartu kelima.** Yang berlaku
  `Expired + ≤30 + 31–60 + 61–90 + >90 + Tanpa Tanggal Akhir = Total
  Kontrak Aktif`; dua bucket terakhir sengaja tidak berkartu (mereka
  bukan tindak lanjut) dan hanya muncul di `contract_table.totals`.
- **Dua chart menjawab pertanyaan berbeda, jadi totalnya memang beda.**
  Contract Expiry Timeline menjumlah ke Total Kontrak Aktif; Expiring by
  Department hanya menghitung yang **perlu ditindaklanjuti** (Expired
  sampai 90 hari), jadi totalnya = keempat kartu pertama. Jangan
  "memperbaikinya" jadi sama. Aturan rekonsiliasi ini **tidak** lagi
  tercetak di keterangan Timeline (bunyinya satu kalimat, "Kontrak yang
  berakhir dalam 12 bulan ke depan."); tempatnya di sini dan di
  `docs/claude/reports.md` backend, karena yang mencarinya sedang
  mengaudit angkanya, bukan sedang membaca layarnya.
- **Bentuk kedua chart sengaja berbeda**, dan keduanya datang dari
  ui-schema (`chart`, `horizontal`), bukan dari kode layar. Timeline
  **batang tegak** (`horizontal: false`) karena sumbunya waktu — dua
  belas bulan berurutan, dan urutan dibaca lebih cepat ke kanan
  daripada ke bawah. Expiring by Department **donut** karena yang
  dibawanya komposisi: berapa bagian dari beban tindak lanjut yang
  dipegang tiap department, dengan totalnya di tengah.
  Mengubah keduanya berarti mengubah `schema.py` di backend lalu
  `pnpm meinova generate reports/hr/contract-expiry` — `schema.ts`
  adalah keluaran generator dan suntingan tangan di situ hilang pada
  regenerate berikutnya.
- **Angka tengah donut ≠ Total Kontrak Aktif, dan itu disengaja.** Ia
  menjumlah yang **perlu ditindaklanjuti** saja (Expired sampai 90
  hari), jadi sama dengan keempat kartu pertama — di tenant peragaan 4,
  sementara Timeline dan kartu kelima berbunyi 5.
- **Dua belas bulan selalu terkirim, termasuk yang bernilai nol.**
  Batang yang hilang dan bulan yang memang kosong terbaca sama, dan
  yang pertama membuat jarak antar-puncak salah baca. Ember tambahan
  `Sudah Lewat`, `> 12 Bulan`, dan `Tanpa Tanggal Akhir` sebaliknya
  hanya muncul kalau ada isinya — FE menggambar apa yang dikirim,
  tidak menambah dan tidak menyaring.
- **`days_remaining` negatif itu benar** (kontrak yang sudah lewat), dan
  kontrak tanpa tanggal akhir dikirim sebagai **string kosong**, bukan
  `0`. `formatDashboardValue` merendernya "—"; menampilkan 0 di situ
  berarti mengarang jawaban paling mendesak dari data yang tidak ada.
- **Expiry Status dan Renewal Status menggeser KPI dan chart juga**,
  bukan cuma tabelnya: keduanya menyaring populasi laporan. Memilih
  "Expired" membuat kartu "≤ 30 Hari" berbunyi 0, dan itu benar.
- **Renewal Status dibacakan backend dari dokumen Employee Action yang
  masih berjalan** (Draft / Pending Approval / Approved), bukan
  disimpulkan dari tanggal. Tidak ada nilai "Renewed", dan FE **tidak
  boleh** menambahkannya sendiri.
- Dua dropdown status dilayani endpoint milik laporan itu sendiri
  (`.../expiry-status/`, `.../renewal-status/`) karena keduanya tidak
  punya tabel master; bentuk responsnya sama dengan `BaseLookupView`
  dan id-nya angka, jadi `MLookupSelect` memakannya apa adanya.

Kontrak lengkapnya (populasi, sumber tiap kolom, ambang bucket, aturan
cakupan, semantik renewal) ada di backend: `docs/claude/reports.md`
bagian "Contract Expiry".
