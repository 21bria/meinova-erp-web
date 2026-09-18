# CURRENT WORK — Frontend

## Active Task

### HR Period Summary — dialog rincian audit + dwibahasa (17 Sep 2026)

`framework/core/utils/drilldown.ts` (format saja, tanpa aturan HR),
dialog `MDashboardTable` tanpa teks hardcoded, kolom tabel dashboard
dilokalkan di `useDashboard` (widget `table`), katalog baru
`common-drilldown.ts` + `reports.ts`. Vitest 313/313; error TS tetap 85
(0 di berkas yang disentuh). Detail: `docs/claude/dashboard.md`.
Belum: katalog kolom Contract Expiry / Reporting Audit / Manpower.
UAT browser (skrip scratchpad, ganti bahasa lewat menu profil) 79/81.
Dua FAIL = label pemilih periode/mode hardcoded Indonesia di
`framework/core/utils/dashboard.ts` (sudah ada, belum dikerjakan). Ganti
bahasa me-remount halaman (`:key="locale"` di layout) → periode kembali
ke bulan berjalan; perilaku lama. Legend chart & deskripsi widget dari
respons backend belum dilokalkan (OPEN Stage 4).

### My Workspace — Ajukan Cuti/Izin pribadi (17 Sep 2026)

`/hr/leave/create?mode=my` dan `/hr/attendance-permissions/create?mode=my`
merender `app/modules/self-service/requests/PersonalRequestPage.vue`
(field dari `form.ts` generator, disaring daftar putih; POST ke
`/api/me/*` tanpa `employee`). Tanpa `mode` → formulir HR lama.
Vitest 287/287, TS 85 (0 baru), UAT `scripts/uat/personal-requests.mjs`
25/25 (Farah = `demo.homanager`). Lembur belum. Kontrak backend:
`backend-erp/docs/claude/self-service.md` §6E.

### My Workspace — Jadwal Saya (17 Sep 2026)

`/hr/shift-calendar?mode=my` + checkbox "Tampilkan Jadwal Saya"; detail
di `docs/claude/hr/shift-calendar.md` → "Jadwal Saya". Vitest 276/276,
error TS tetap 85 (0 baru), UAT browser 25/25. Form Cuti/Izin/Lembur
personal **ditahan** menunggu keputusan otorisasi backend
(`backend-erp/docs/claude/self-service.md` §6D).

### Multi-bahasa — Stage 4: cakupan EN/ID seluruh modul
Status: **SELESAI** — 9 Sep 2026. 158 modul diregenerate, nol perubahan
logika, nol migration.

#### IMPLEMENTED — tiga mekanisme pusat

| Berkas | Perubahan |
|---|---|
| `apps/framework/introspection/schema.py` (backend) | namespace **diturunkan** dari `framework_module` — satu perubahan menghidupkan i18n untuk 182 modul sekaligus |
| `app/i18n/locales/{en,id}/common-fields.ts` | **kamus field bersama, 818 entri.** Katalog modul dicari lebih dulu; ini lapisan terakhir sebelum fallback Inggris |
| `framework/core/utils/i18n.ts` | `resourceLabel()` jatuh dari `<ns>.<ruang>.<key>` ke `common.<ruang>.<key>`; ruang `empty` dan `placeholder` ditambahkan; `translate()` menerima `params` |
| `app/i18n/locales/{en,id}/common.ts` | `tabs` (66), `empty` (18), `placeholder`, `errors` (9), 207 kode enum di `status` |
| `app/i18n/locales/{en,id}/codes.ts` | `codes.module.*` |
| `framework/core/composables/useDashboard.ts` | label widget/filter/`empty_text` dashboard diselesaikan **saat render** — dashboard tidak lewat generator label |
| `framework/components/**` (11 berkas) | 24 kalimat Indonesia hardcoded → kunci katalog; `Reset`/`Apply`; placeholder `Select {label}` |
| `framework/components/crud/MCrudToolbar.vue` + `builders/filters/*` | `search.placeholderKey` |
| `scripts/meinova/**` | `__SEARCH_PLACEHOLDER_KEY__`; `i18n` masuk schema dashboard |
| `app/i18n/__tests__/module-fields.spec.ts` | test baru, ERP-lebar |

**Kenapa kamus bersama, bukan katalog per modul:** dari 3.202 label yang
dipancarkan generator di seluruh ERP hanya ada 792 nama field berbeda —
dan sepuluh teratas (`is_active`, `code`, `name`, `sort_order`,
`company_name`) sudah mengisi hampir separuhnya. Tanpa lapisan bersama,
"Code" harus ditulis ulang di 92 katalog modul, dan modul ke-93 yang
lupa akan tetap berbahasa Inggris tanpa error apa pun.

**Dashboard/laporan jalur terpisah.** Modul CRUD memancarkan kunci ke
berkas hasil generate; dashboard menulis schema-nya sebagai JSON dan
renderer menyusun kuncinya saat runtime. Titik terjemahannya karena itu
di `useDashboard`, satu tempat yang dilewati semua widget.

#### Dua jebakan yang gagalnya diam

1. **Default `withDefaults` dievaluasi saat module dimuat** — sebelum
   plugin i18n terpasang, dan tidak pernah lagi sesudahnya
   (`MWorkspaceHistory.vue`). Dipindah ke `computed`.
2. **vue-i18n selalu menafsirkan `{label}` sebagai slot interpolasi.**
   Dipanggil tanpa params, slotnya diisi string kosong: "Select
   {label}" keluar sebagai "Select", dan `.replace()` sesudahnya tidak
   menemukan apa pun. Ketahuan hanya di browser. `translate()` sekarang
   mengoper params ke vue-i18n.

#### TESTED — diamati di browser, bukan unit test

| Layar | EN | ID |
|---|---|---|
| HR / Employees | Employee No. · First Name · Email Address | No. Karyawan · Nama Depan · Alamat Email |
| HR / Leave | Document No. · Leave Type · Total Days | No. Dokumen · Jenis Cuti · Total Hari |
| Payroll / Runs | Payroll Period · Run Type · Total Earning | Periode Penggajian · Jenis Proses · Total Penghasilan |
| Administration / Company | Legal Name · Tax Number | Nama Resmi · NPWP |
| References / HR | Code · Sort order · Actions | Kode · Urutan · Aksi |
| Reports / Manpower Summary | Headcount by Company · Manpower Summary | Headcount per Perusahaan · Ringkasan Tenaga Kerja |
| HR Dashboard | Daily Attendance · Leave Recap | Kehadiran Harian · Rekap Cuti |
| form Employees (18 label) | User · Passport Number · Tax Number | Pengguna · Nomor Paspor · NPWP |
| tab workspace Employees | General · Organization · Contract & Probation | Umum · Organisasi · Kontrak & Masa Percobaan |
| penyaring + tombol | Select Parent Company · Reset · Apply · Search... | Pilih Perusahaan Induk · Atur Ulang · Terapkan · Cari... |
| badge status | Active | Aktif |

Nol error console di seluruh pemeriksaan. Bahasa diganti lewat **tombol
di layar Settings**, bukan cookie — preferensi akun menang atas cookie,
jadi cookie yang dipaksa langsung ditimpa balik.

- `pnpm test` — **117/117 lulus** (8 berkas). `module-fields.spec.ts`
  membaca 1.710 kunci **langsung dari berkas hasil generate** (termasuk
  kunci dashboard yang disusun ulang dengan aturan `useDashboard`) dan
  menuntut tiap kunci punya isi di setiap bahasa.
- `pnpm typecheck` — **74 error, turun dari baseline 84.** Regenerasi
  ikut memperbaiki 10 error lama di berkas hasil generate yang basi.
- `pnpm build` — sukses, 31,5 MB (6,28 MB gzip).

#### Regenerasi

**158 modul** (150 CRUD + 8 dashboard/laporan), tiga putaran: setelah
namespace pusat, setelah label backend jadi Inggris, dan setelah
`placeholderKey`. Tiga modul frontend tidak punya schema backend
(`administration/security/sessions`, `references/hr/grades`,
`references/hr/work-location-types`) — tertinggal berbahasa Inggris.

#### OPEN

- **8 kode enum yang label-nya tinggal di `choices` model** (`own`,
  `explicit`, `subject`, `submitter`, `preparer`, `sent`, `inherit`,
  `on`) masih Indonesia di backend; mengubahnya menghasilkan migration.
  Pengguna English tetap terlayani lewat katalog `common.status`.
- **13 kode enum bermakna ganda** (`monthly`, `daily`, `none`, `work`,
  `fixed`, `partial`, `review`, …) belum diterjemahkan: satu kode
  berarti hal berbeda di modul berbeda, jadi butuh kunci per field
  (`codes.<field>.<kode>`), bukan kamus bersama.
- Label pada **respons** API (deret chart, sel tabel laporan dari
  `services.py`) belum dilokalkan.
- Salinan Indonesia tulis tangan di `app/pages/workflow/instances/`.
- 4 error TS `*Workspace.vue` — cacat template lama, ada di baseline.

#### DEFERRED — tidak disentuh

Lokalisasi pesan error backend · penyimpanan multibahasa master seeded ·
nama bisnis milik tenant · tabel terjemahan DB · redesign format
tanggal. **SCM belum ada modulnya** di repo ini.

---

### Multi-bahasa — Stage 2: menutup celah fondasi
Status: **SELESAI** — 9 Sep 2026. Arsitektur Stage 1 tidak diubah
sebaris pun: plugin `vue-i18n`, `User.language`, pemilih bahasa,
katalog, kontrak generator, dan perilaku rute semuanya tetap.

#### IMPLEMENTED — 2A: label Workflow

**Regenerasi 62 berkas TIDAK diperlukan.** Perbaikannya di dua tempat
yang dipakai bersama, bukan di berkas hasil generate.

Backend mengirim kembali kalimat **Inggris** (lihat CURRENT-WORK
backend). Frontend menerjemahkannya saat render, lewat **kode stabil**
yang memang sudah ikut dikirim di payload yang sama:

| Berkas | Peran |
|---|---|
| `app/i18n/locales/{en,id}/codes.ts` | katalog baru: kode enum → kalimat, **dikelompokkan per nama field** |
| `framework/core/utils/i18n.ts` | `codeLabel()`, `enumCodeField()` |
| `framework/builders/columns/createColumns.ts` | sel tabel enum |
| `framework/components/crud/MCrudFilters.vue` | opsi dropdown filter |
| `framework/components/forms/MFormBuilder.vue` | opsi dropdown form (3 tempat) |
| `app/modules/workflow/components/WorkflowStatusBadge.vue` | badge status — dipakai kotak masuk, dokumen berjalan, jejak persetujuan |
| `app/pages/workflow/instances/index.vue` | filter status (halaman tulis tangan, bukan hasil generate) |

**Aturan yang menjaga data bisnis, dan letaknya cuma satu tempat:**
kolom yang diterjemahkan harus berakhiran `_label`/`_display`.
`_name` **tidak ikut** — `department_name`, `company_name`,
`definition_name` adalah nama milik tenant. Itu batas antara "tampilan
enum sistem" dan "data bisnis", dan ia dijaga di `enumCodeField()`,
bukan di tiap layar. Ada test yang menguncinya.

Syarat kedua: barisnya harus benar-benar membawa field kodenya, dan
kodenya harus string — FK yang mengirim id angka dilewati.

Kunci dicari **per field** (`codes.approver_type.role`), bukan dalam
satu ruang datar. Kode enum di ERP ini pendek dan generik (`role`,
`manager`, `user`); satu ruang datar berarti enum HR bernama `manager`
suatu hari memungut label milik Workflow, dan salahnya tidak berbunyi.

Kode tanpa terjemahan jatuh ke label Inggris dari API. Modul yang
belum diterjemahkan tampil persis seperti sebelumnya.

#### IMPLEMENTED — 2B: format angka ikut bahasa

`formatLocaleNumber()` + `localeSeparators()` di
`framework/core/utils/i18n.ts`, dipakai di:

- `framework/builders/columns/createColumns.ts` — kolom angka
  (sebelumnya `toLocaleString("id-ID")` mati)
- `framework/core/utils/dashboard.ts` — angka, persen, mata uang
- `framework/components/forms/MCurrencyField.vue`
- `framework/components/import/MImportSummary.vue`

**Satu bug sungguhan ikut ketemu dan diperbaiki.** `MCurrencyField`
menampilkan `id-ID` (`1.234.567`) tapi membacanya kembali dengan
`replace(/[^\d.-]/g, "")` → `Number("1.234.567")` = **NaN**. Kolom uang
yang disunting lalu disimpan tanpa mengetik ulang seluruh angkanya
mengirim NaN ke backend, tanpa satu pun tanda di sisi frontend.
Parsernya sekarang menurunkan pemisah dari `Intl` untuk bahasa aktif,
dan tidak pernah meneruskan NaN. Ada test round-trip untuk kedua
bahasa.

`currency: "IDR"` sengaja **tidak** diturunkan dari bahasa: perusahaan
yang membukukan dalam mata uang lain tidak berubah mata uangnya karena
antarmukanya diganti ke English.

#### TESTED — UAT browser sungguhan

Chrome headless + CDP terhadap `pnpm dev` + `manage.py runserver`,
login `admin` di tenant `demo`. **16/16 lulus.**

```
 1 login                                        PASS  (landed /)
 2 UI default English                           PASS  (heading "Language", lang=en)
 3 menu sidebar English                         PASS  Dashboard·Employees·Employee Actions·Masters
 4 pemilih bahasa terlihat                      PASS  ["English","Bahasa Indonesia"]
 5 label berubah SEKETIKA tanpa reload          PASS  "Language" -> "Bahasa"
 6 tanpa logout                                 PASS  cookie access utuh, path tetap
 7 refresh                                      PASS
 8 ID bertahan sesudah refresh                  PASS
 9 menu sidebar ikut ID                         PASS  Dasbor·Karyawan·Data Induk
10 preferensi sampai ke User.language           PASS  GET /me/ -> "id"
11 logout                                       PASS
12 ID dipulihkan DARI AKUN                      PASS  cookie sengaja dipaksa "en" -> tetap ID
13 kembali ke English                           PASS
14 English bertahan + tersimpan di akun         PASS  GET /me/ -> "en"
15 tidak ada prefiks rute /en atau /id          PASS  / · /settings/appearance
16 tidak ada error console                      PASS  0 pesan
```

Nomor **12** yang paling berarti: cookie `app_settings` sengaja
disetel ke `en` sebelum login ulang, dan bahasanya tetap kembali ke
`id`. Itu membuktikan akun yang menang atas cookie — bukan cuma
"pilihan bertahan".

**Lima pemeriksaan sempat merah, dan kelimanya salah di alat ujinya:**
(a) viewport headless bawaan 756 px — di bawah breakpoint 768, jadi
shadcn merender sidebar sebagai Sheet off-canvas yang tersembunyi, dan
seluruh pemeriksaan menu "gagal" pada layar yang baik-baik saja;
(b) probe bahasa mencari kata "Bahasa" di seluruh body, padahal
"Bahasa Indonesia" adalah label tombol yang memang selalu ada di kedua
bahasa. Keduanya dibetulkan di skrip UAT, bukan di aplikasi.

Verifikasi enum Workflow, dibaca dari tabel yang hidup:

| | EN | ID |
|---|---|---|
| instances status | Approved · Cancelled | Disetujui · Dibatalkan |
| steps tipe penyetuju | Direct Manager · Role Holder | Atasan Langsung · Pemegang Peran |
| steps cakupan | Company · Location | Perusahaan · Lokasi |

Format angka, dibaca dari dasbor HR yang hidup: `0.00` (en) vs `0,00`
(id); `<html lang>` `en` vs `id-ID`.

#### TESTED — regresi

- `pnpm test` — **108/108 lulus**, 6 berkas (+26 test baru:
  `enum-codes.spec.ts`, `number-format.spec.ts`)
- `pnpm build` — **exit 0**, Σ 30,5 MB (6,16 MB gzip)
- `pnpm typecheck` — **84 error, sama persis dengan baseline Stage 1.
  Nol error baru.** Dua error di `MCrudFilters.vue` bergeser dari baris
  204/222 ke 236/254 — pergeseran 32 baris, tepat sebesar helper yang
  disisipkan; pesannya identik.
- Backend: `apps.accounts.tests.test_user_language` +
  `apps.hr.tests.attendance_permission.test_permission_workflow` —
  **20/20 OK** (189,3 s)
- `manage.py check` — bersih

Run pertama suite backend berakhir `FAILED (errors=1)`, dan **error itu
bukan di kode**: kedua puluh test lulus (`....................E`), yang
gagal `tearDownClass` dengan `out of shared memory /
max_locks_per_transaction` — tabrakan `DROP SCHEMA "test" CASCADE`
dengan run milik sesi lain di server PostgreSQL yang sama. Schema sisa
dibersihkan, lalu diulang bersih. Baca `E`-nya di **posisi mana**,
bukan cuma barisnya.

#### OPEN

- **Judul kolom masih Indonesia untuk semua orang.** Beda dari label
  enum: ini `label=` yang ditulis langsung di
  `apps/workflow/api/*/schema.py` ("Alur Kerja", "Tipe Penyetuju",
  "Cakupan Peran"). Permukaannya jauh lebih luas dan **bukan cuma
  Workflow** — widget dasbor HR ("Jam Lembur", "Kehadiran Harian")
  datang dari schema backend dengan cara yang sama. Jalur perbaikannya
  sudah ada (`--i18n` + regenerate), tapi pantas jadi satu pass
  sendiri.
- Salinan Indonesia tulis tangan di `app/pages/workflow/instances/`
  (keterangan halaman, placeholder pencarian, keadaan kosong,
  "N dokumen"). Bukan hasil generate; perlu disentuh satu per satu.
- Format **tanggal** masih memakai locale mati di
  `framework/core/utils/dashboard.ts` (2 × `Intl.DateTimeFormat("id-ID")`),
  `MWorkspaceHistory.vue`, `MDashboardPeriodPicker.vue` (`locale="id-ID"`),
  `MImportPreviewTable.vue` (`en-GB`), dan `MONTH_LABELS` Indonesia di
  `dashboard.ts`. Sengaja dilewati — tahap ini menyebut **angka**, dan
  redesign format tanggal masih DEFERRED.
- `app/utils/formatDate.ts` punya `DEFAULT_LOCALE = "id-ID"` yang
  **tidak dipakai** (implementasi aktifnya merakit `dd-mm-yyyy`
  manual; versi `Intl`-nya masih dikomentari). Kontraknya sengaja
  tidak disentuh.
- `app/components/charts/apex/formatters.ts` memakai `toLocaleString()`
  tanpa locale dan `Intl.NumberFormat("en")` — di luar `framework/`,
  belum ikut.

#### DEFERRED — tidak disentuh, sesuai instruksi

Terjemahan layar HR · Payroll · Finance · SCM · arsitektur lokalisasi
pesan error backend · penyimpanan multibahasa untuk master seeded ·
nama master/bisnis milik tenant · tabel terjemahan di DB · redesign
format tanggal global.

---

### Multi-bahasa (EN + ID) — fondasi framework
Status: **FONDASI SELESAI + LAPIS BERSAMA DITERJEMAHKAN.** 8 Sep 2026.
Bukan "ERP sudah berbahasa Indonesia" — yang selesai kerangkanya, menu,
dan label milik framework. Layar per modul masih Inggris; itu
disengaja, lihat DEFERRED.

#### CONFIRMED — arsitektur

- **`vue-i18n` dipasang sebagai plugin Nuxt biasa**
  (`app/plugins/i18n.ts`), **bukan** `@nuxtjs/i18n`. Alasannya satu:
  module itu ikut mengurus routing dan strategi bawaannya menyisipkan
  prefiks bahasa ke setiap rute (`/id/hr/employees`). Ratusan rute di
  sini sudah dirujuk `menus.ts`, `RoleMenuPermission`, dan tabel `Menu`
  backend — menggesernya berarti menyentuh kontrak yang tidak ada
  hubungannya dengan bahasa. Tidak ada satu rute pun yang berubah.
- Instance dibuat **per request** di dalam fungsi plugin, jadi SSR dua
  pengguna berbeda bahasa tidak saling menimpa.
- **Katalog per domain, bukan satu berkas raksasa:**
  `app/i18n/locales/{en,id}/` — `common`, `navigation`, `organization`,
  `hr`, `payroll`, `workflow`, `finance`, `settings`.
- **Kunci semantik, bukan kalimat Inggrisnya.**
  `common.actions.save`, bukan `common.actions.Save`.
- **Bahasa ketiga = satu baris di `app/i18n/config.ts` + satu folder
  katalog.** Tidak ada berkas lain yang perlu tahu.

#### CONFIRMED — persistensi preferensi

Tiga lapis, dan urutan kewenangannya **akun menang atas cookie**:

1. `vue-i18n` — yang membuat layar berubah seketika
2. cookie `app_settings` — **menumpang cookie preferensi yang sudah
   ada**, bukan cookie/sistem preferensi baru. Terbaca server, jadi
   halaman SSR sudah keluar dalam bahasa yang benar (tanpa kedipan
   Inggris→Indonesia saat hydration)
3. `User.language` di backend — supaya pilihan ikut orangnya, bukan
   ikut browsernya

Satu-satunya jalan mengganti: `useLocale().setLocale()`. Simpan-ke-akun
tidak ditunggu dan kegagalannya tidak membatalkan perubahan di layar —
jaringan putus tidak boleh membuat tombol bahasa terasa rusak; cookie
tetap memegangnya di browser itu.

`app/plugins/i18n.sync.client.ts` menarik bahasa dari akun sesudah
login. **Satu arah saja** (akun → UI); arah sebaliknya hanya lewat
pemilihnya, kalau tidak keduanya saling memicu.

#### CONFIRMED — pemilih bahasa

Dua tempat, satu komponen (`LayoutLanguageSwitcher`):
- sub-menu di dropdown profil sidebar (`variant="menu"`)
- Settings → Appearance (`variant="inline"`)

Berlaku seketika, **tanpa logout**. `<html lang>` ikut berubah.

**`:key="locale"` pada isi halaman di `layouts/default.vue`.** Teks di
template reaktif sendiri lewat `$t`; yang tidak: label yang dihitung
sekali lalu disimpan sebagai konfigurasi — judul kolom tabel, label
field form, opsi filter. Tanpa key itu separuh layar berganti bahasa
dan separuhnya tidak. Kuncinya di isi halaman saja, jadi sidebar dan
header tidak berkedip.

#### IMPLEMENTED — yang sudah diterjemahkan

- **Framework (berlaku di seluruh aplikasi sekaligus):**
  `MCrudToolbar` (Create/Import/Export/Refresh/Reset/Actions/Advanced
  Filter/Delete Selected/Download Template/placeholder cari),
  `MCrudActions` (Edit/Delete), `MCrudDelete`, `MCrudConfirm`,
  `MCrudEmpty`, `MCrudLoading`, `MFormDialog` (Save/Saving/Cancel),
  `MEmpty`, `MLoading`, `MError`, `MNotFound`.
- **`framework/builders/columns/createColumns.ts`** — ini yang benar-
  benar dipakai seluruh modul hasil generate: Active/Inactive, Yes/No,
  header "Actions", dan judul bawaan `column.status`. `header`/`cell`
  adalah fungsi yang dipanggil tiap render, jadi ikut berganti bahasa.

  **Sempat salah sasaran:** `framework/core/utils/column.ts` punya
  `statusColumn`/`actionsColumn` yang bentuknya mirip dan diterjemahkan
  lebih dulu — padahal **tidak dirujuk satu berkas pun** (`grep`
  mengembalikan nol pemakai di luar berkasnya sendiri). Ketahuan dari
  bundle hasil build: kunci `common.labels.status` tidak muncul di
  sana. Keduanya tetap diterjemahkan supaya tidak menyimpang, tapi yang
  berpengaruh di layar adalah `createColumns.ts`.
- **Navigasi:** 67 judul menu + 22 judul grup di `menus.ts` mendapat
  `titleKey`/`headingKey` **di samping** `title`/`heading` yang lama.
  Item tanpa kunci — termasuk yang ditambahkan besok — tetap tampil
  seperti sebelumnya.
- **Shell:** menu profil (Profil Saya/Settings/Notifications/Theme/Log
  out).
- Katalog HR & Payroll fase 1 sudah terisi (Karyawan, Kehadiran, Cuti
  Tahunan/Sakit, Kalender Kerja, Hari Libur, Roster; Gaji Pokok,
  Tunjangan, Potongan, Lembur, Penghasilan Bruto, Gaji Bersih, Periode
  & Proses Penggajian) — **siap dipakai, belum dipasang ke layarnya.**

#### CONFIRMED — yang TIDAK berubah

- **Nilai enum/API tetap kode stabil.** `statusLabel("APPROVED")`
  menerjemahkan **tampilannya**; objek dari API tidak disentuh dan
  nilai yang dikirim balik tetap `APPROVED`. Ada test yang menjaganya.
- **Data bisnis tidak diterjemahkan.** Departemen "Plant Maintenance"
  tetap "Plant Maintenance".
- **Zona waktu lepas dari bahasa.** `formatDate`/`formatDateTime` lama
  **tidak disentuh** — keduanya tetap `dd-mm-yyyy` di bahasa apa pun.
  Formatter sadar-locale ada sebagai **tambahan** di
  `useLocaleFormat()`, untuk layar baru.
- Tidak ada rute, permission, atau perilaku data scope yang berubah.

#### IMPLEMENTED — generator

`--i18n=<namespace>`, **opt-in**. Tanpa flag keluarannya **identik byte
per byte** dengan sebelumnya — ada test yang menjaganya.

```
pnpm meinova generate hr/employees --i18n=hr.employees
```

Label dipancarkan sebagai:

```ts
column.text("employee_no", resourceLabel("hr.employees.fields.employee_no", "Employee Number"))
```

Argumen kedua adalah teks Inggris yang dulu ditulis langsung di sana.
`resourceLabel` mengembalikannya apa adanya kalau kuncinya belum ada di
katalog — jadi modul yang diregenerate tapi belum diterjemahkan tampil
sama persis, dalam bahasa apa pun. Penerjemahan bisa dicicil per modul
**tanpa** regenerate.

Berkas generator yang berubah: `i18n.mjs` (baru), `columns.mjs`,
`form.mjs`, `filters.mjs`, `crud.mjs`, `generate.mjs`, `cli.mjs`, plus
token `__I18N_IMPORT__` di 9 template (`crud-page`, `crud-dialog`,
`crud-workspace` × `columns/form/filters`). Namespace juga bisa datang
dari schema backend (`i18n.namespace`), dan schema menang atas flag.

Generator **tidak** menulis berkas katalog — ia mencetak daftar kunci
untuk disalin. Katalog berisi terjemahan yang ditulis orang; generator
yang ikut menyentuhnya akan menimpanya pada regenerate berikutnya.

#### TESTED

`pnpm test` (vitest, baru) — **82 test, 4 berkas, semuanya lulus.**

- `app/i18n/__tests__/config.spec.ts` — penormalan kode bahasa, fallback,
  tag `Intl` yang tidak pernah melempar `RangeError`
- `app/i18n/__tests__/messages.spec.ts` — bentuk katalog: tidak ada
  kunci yatim (yang hanya ada di `id` → tidak punya fallback), tidak
  ada nilai kosong, kunci status semuanya huruf kecil
- `app/i18n/__tests__/framework-labels.spec.ts` — janji intinya: kunci
  yang tidak ada → teks Inggris lama, apa adanya. Termasuk saat
  berjalan **di luar konteks Nuxt**
- `scripts/meinova/__tests__/i18n.spec.mjs` — keluaran generator tanpa
  namespace = keluaran lama

Sisi backend: `apps/accounts/tests/test_user_language.py` **10/10 OK**,
regresi `apps.accounts` **32/32 OK** — lihat CURRENT-WORK backend.

`NODE_OPTIONS=--max-old-space-size=8192 pnpm build` — **exit 0**,
Σ 30,5 MB (6,16 MB gzip). Dijalankan dua kali; yang kedua sesudah
`createColumns.ts` ikut diterjemahkan.

`NODE_OPTIONS=--max-old-space-size=8192 pnpm typecheck` — **84 error,
seluruhnya sudah ada sebelumnya.** Nol error di berkas yang disentuh
tugas ini. (Satu-satunya potongan yang beririsan,
`SidebarNavGroup.vue(31)` `Property 'new' does not exist on NavGroup`,
ada di baris yang tidak disentuh — diverifikasi lewat `git diff`.)

#### OPEN

- **`apps/workflow/labels.py` di backend bertabrakan dengan fondasi
  ini.** Berkas itu menerjemahkan label enum workflow ke Bahasa
  Indonesia **di schema backend**, jadi 62 berkas hasil generate di
  `app/modules/workflow/` berbahasa Indonesia untuk **semua** pengguna
  — termasuk yang memilih English. Benar untuk saat itu (belum ada
  i18n); sekarang tempatnya sudah ada, dan katalog `workflow.*` sudah
  disiapkan untuk menerimanya. **Sengaja belum dikerjakan** — itu
  langkahnya sendiri.
- `app/components/Search.vue` mengimpor `navMenu` yang tidak
  diekspor `menus.ts` (sisa template asli). Tidak disentuh; bukan
  bagian tugas ini, tapi tercatat karena ia satu-satunya konsumen
  `menus.ts` yang belum ikut `navLabel()`.
- `AppSettings.vue` (Template Customizer) masih berlabel Inggris keras.

#### DEFERRED — sengaja tidak dikerjakan

- **Layar per modul.** HR, Payroll, Finance, SCM, Workflow, Reports
  masih memakai label Inggris dari schema backend. Katalognya sudah
  ada; jalur pemasangannya `--i18n` per modul. Dicicil, bukan sekali
  jalan — 90-an modul dalam satu perubahan tidak bisa ditinjau siapa
  pun.
- **Pesan validasi/error.** Butuh keputusan arsitektur di backend
  lebih dulu (lihat CURRENT-WORK backend).
- **Label master seeded** (jenis cuti, komponen payroll sistem) —
  kodenya sudah stabil, jalur termurahnya kunci katalog per kode.
- **`formatDate` lama** dibiarkan `dd-mm-yyyy`. Menggantinya berarti
  mengubah tampilan tiap tanggal di seluruh aplikasi dalam satu
  perubahan berjudul "dukungan multibahasa".

---

### Workflow Administration — label Bahasa Indonesia
Status: **DONE** — 8 Sep 2026. Display-only; tidak satu nilai enum/API
pun berubah.

#### Tidak ada framework i18n di repo ini, dan itu menentukan caranya

`vue-i18n` tidak terpasang, tidak ada `locales/`, tidak ada peta
terjemahan terpusat di `app/`. Yang **sudah** berfungsi sebagai peta
label terpusat justru schema backend: keempat modul di
`app/modules/workflow/` seluruhnya digenerate dari sana.

Karena itu labelnya diterjemahkan di backend (`apps/workflow/labels.py`
— satu peta untuk seluruh enum workflow, dipakai schema **dan**
serializer), lalu sisi frontend tinggal diregenerate. Menulis peta
kedua di frontend berarti dua daftar yang harus tetap sama tapi
disimpan terpisah — dan bedanya tidak menghasilkan error, cuma dua
layar yang menyebut hal yang sama dengan dua nama.

**62 berkas** diregenerate:

```
pnpm meinova generate workflow/definitions
pnpm meinova generate workflow/steps
pnpm meinova generate workflow/instances
pnpm meinova generate workflow/delegations
```

**Nilainya tidak bergeser satu huruf pun** — diverifikasi di berkas
hasil generate: `manager`, `role`, `user`, `position`,
`department_head`, `tenant`, `company`, `branch`, `location`,
`division`, `department`, `section`, `any`, `all`, `draft`, `active`,
`inactive`. Yang berubah hanya `"label"`.

Label yang mendarat: Tahapan Persetujuan · Tahap · Nama Tahap · Tipe
Penyetuju · Atasan Langsung · Pemegang Peran · Pengguna Tertentu ·
Hierarki Jabatan · Kepala Departemen · Peran · Cakupan Peran · Pengguna
· Tingkat · Wajib · Peran Cadangan · Umum · Cakupan · Dokumen Berjalan ·
Perusahaan · Cabang · Lokasi · Divisi · Departemen · Seksi · Draf ·
Aktif · Nonaktif.

**Build: PASS** — `NODE_OPTIONS=--max-old-space-size=8192 pnpm build`,
exit 0, Σ 30,2 MB (6,09 MB gzip). Dijalankan dua kali, yang kedua
sendirian tanpa test berjalan bersamaan, hasil sama.

#### Dua label yang sengaja TIDAK ikut

`Add Row` dan `Save Rows` **tidak datang dari schema**. Keduanya duduk
di `framework/components/workspace/resource/MWorkspaceResourceInline.vue`
(default prop `addLabel`, dan `"Save Rows"` ditulis langsung di
template) plus template generator yang tersalin ke **22 modul**.
Menerjemahkannya mengubah tombol di **seluruh aplikasi** — itu
keputusan bahasa aplikasi, bukan pekerjaan layar Workflow.

#### Temuan: `visibleWhen` tidak berlaku di grid inline

Schema step sudah membawa `visible_when` yang benar (`approver_role` dan
`approver_scope` hanya untuk `approver_type = "role"`; `level` hanya
untuk `manager`/`position`). `MFormBuilder.vue` menghormatinya;
`MWorkspaceResourceInline.vue` **tidak** — kolomnya dipilih semata dari
`field.table === true`.

Akibatnya di tab **Tahapan Persetujuan**, baris bertipe Atasan Langsung
tetap memperlihatkan sel Peran dan Cakupan Peran yang kosong dan tidak
berpengaruh — persis salah paham yang membuat orang mengira meja Atasan
Langsung ikut disaring cakupan. **Belum diperbaiki**: visibilitas
per-sel (bukan per-kolom) adalah perubahan komponen framework yang
dipakai 22 modul.

Aturan bisnisnya di backend: `docs/claude/CURRENT-WORK.md` →
Workflow — cakupan meja Role Holder.

---

### HR — Attendance Permission (Izin Kehadiran)
Status: **DONE (frontend)** — 7 Sep 2026. Digenerate dari schema
backend, bukan ditulis tangan.

Rute `/hr/attendance-permissions` (list · create · `[id]` · `[id]/edit`),
kartu hub di **Attendance & Leave** kelompok `attendance` — bukan
`leave`: yang membedakan izin dari cuti bukan panjangnya melainkan apa
yang dipotong, dan izin tidak punya saldo sama sekali.

**Dua perubahan yang keluar dari module ini dan berlaku umum:**

1. **`page.vue` hasil generate sekarang meneruskan slot** ke Workspace
   (`templates/crud-workspace/page.vue`). Workspace sudah lama punya
   `<slot :name="tab.key">` untuk tab `custom`, tapi tidak ada jalan
   mengisinya — satu-satunya jalan keluar sebelumnya menyunting berkas
   hasil generate, yang hilang saat diregenerate. Sekarang panel khusus
   ditulis di `app/pages/<module>/` yang memang tidak digenerate.
2. **`WorkflowStatusBadge` mengenal `in_review`.** Tanpa itu dokumen
   yang sedang ditinjau jatuh ke `outline` dan terlihat sama dengan
   draft. Label multi-kata juga tidak lagi jadi `In_review`.

**Panel Review** (`review/AttendancePermissionReview.vue`) menampilkan
jadwal, presensi sesungguhnya, peringatan tabrakan, dan jejak
persetujuan. Ditaruh di `review/`, **bukan** `components/`, karena
`components/` milik generator. Jejaknya memakai `WorkflowApprovalTrail`
yang sudah ada; bentuk `approval` dari serializer dipetakan di frontend
(`approver`→`approver_name`, `decision`→`status`, …) karena bentuk itu
dipakai bersama Travel Request dan Visitor — mengubahnya di backend
membuat tiga modul berbeda bentuk.

**Tidak satu angka pun dihitung di frontend.** `late_minutes`,
`excused_late_minutes`, dan selisihnya dibaca apa adanya dari
serializer.

Detail backend: `docs/claude/hr/attendance-permission.md` di repo Django.

**Yang belum:** tautan dari baris Attendance Exception ke dokumen
izinnya (kolom `permission_state`/`excused`/`unauthorized` sudah tampil
di layar Attendance), dan layar `PayrollPermissionRule`.

---

### Payroll — Compliance disederhanakan jadi Tax + BPJS (frontend)
Status: DONE — 7 Sep 2026. **UX/navigasi saja.** Tidak ada perubahan
backend, model, migration, tarif, publisher, maupun logika perhitungan.

**Masalahnya:** sidebar Compliance memuat tujuh item — Tax ditambah
enam resource BPJS satu per satu. Itu cerminan tabel backend, bukan
pekerjaan siapa pun. Prinsipnya: *resource backend boleh granular,
sidebar mewakili alur kerja.*

**Sekarang dua item:** `Tax` → `/payroll/tax` dan `BPJS` →
`/payroll/bpjs`. Keduanya halaman baru; rute yang sama ini pernah ada
di menu sebelum modul Payroll dikerjakan lalu dilepas karena
halamannya tidak pernah dibuat — kali ini halamannya ada.

**Pola yang dipakai `MasterHub`, bukan pola baru.** `features/
master-hub` memang sudah generik (lihat hub HR Attendance & Leave,
Roster & Travel, Visitor), isinya tinggal registry:
`registry/section-hub/payroll-bpjs.ts` dan `payroll-tax.ts`.

**Workspace `references/hr/Workspace.vue` sengaja TIDAK dipakai**
meski bentuknya lebih mirip "workspace bertab". Ia me-mount `page.vue`
tiap resource di dalam satu rute dan **tidak menyaring hak akses sama
sekali** — memakainya berarti satu item menu membuka enam layar BPJS
untuk role yang keenam menunya sudah dicabut. `MasterHub` menyaring
`isGranted` + `isVisible` per kartu dan menautkan ke rute aslinya, jadi
hak akses dan bookmark keduanya utuh.

**Enam rute BPJS lama tidak berubah satu huruf pun**
(`/payroll/bpjs-programs`, `-rules`, `-enrollments`, `-risk-classes`,
`-base-definitions`, `-base-components`), begitu juga
`/payroll/tax-brackets` dan `/payroll/tax-statuses`. Baris menunya di
`apps/accounts/seeds/menus.py` **tetap dibiarkan** — persis seperti
saat kartu HR dipindah ke hub: baris itulah yang membuat kartu hub
masih bisa disembunyikan per role.

**Satu celah hak akses ditutup di sini juga.** Rute hub sendiri
(`/payroll/bpjs`) belum terdaftar di tabel `Menu`, dan rute yang tidak
dikenal dianggap **boleh** — jadi tanpa langkah tambahan, mengganti
tujuh item dengan satu item hub justru memunculkan menu baru untuk role
yang ketujuh menunya sudah dicabut, lalu membuka hub kosong. `NavLink`
karena itu punya `hubItems`, dan `AppSidebar` menyembunyikan item hub
kalau **tidak satu pun** layar di dalamnya bisa dibuka. Daftarnya
diturunkan dari registry hub-nya (`toHubItems`), bukan ditulis ulang:
dua daftar yang harus sama tapi disimpan terpisah pada akhirnya selalu
berbeda, dan bedanya tidak menghasilkan error.

**Base Components tetap layar tersendiri di kategori Configuration,
tidak ditanam di dalam Base Definition.** Alasannya sama dengan
Allowance Components terhadap Allowance Template: layar master-nya
memakai editor dialog dan **tidak punya halaman detail**, jadi
"definisi terpilih → komponennya" berarti membuat layar detail baru,
bukan menata ulang navigasi. Yang membuatnya tidak perlu: layar Base
Components sudah punya penyaring `definition` (lookup ke
`/api/payroll/bpjs-base-definitions/lookup/`), jadi menelusuri komponen
milik satu definisi tetap satu langkah. Kartunya diberi `order` tepat
sesudah Base Definitions supaya urutan bacanya benar.

**Berkas:** `app/constants/menus.ts` · `app/types/nav.d.ts` ·
`app/components/layout/AppSidebar.vue` ·
`app/registry/section-hub/payroll-bpjs.ts` ·
`app/registry/section-hub/payroll-tax.ts` ·
`app/pages/payroll/bpjs/index.vue` · `app/pages/payroll/tax/index.vue`

---

### Payroll — BPJS jadi konsep kelas satu (frontend)
Status: DONE — 5 Sep 2026.

Lima modul di-generate dari schema backend, tanpa satu komponen baru:
`payroll/bpjs-programs`, `bpjs-base-definitions`, `bpjs-base-components`,
`bpjs-rules`, `bpjs-enrollments`. Rute halamannya ditulis tangan seperti
biasa, dan semuanya `<slug>/index.vue` — **bukan** `<slug>.vue`
bersebelahan dengan direktori, kesalahan yang sempat mematikan kedua
layar import Calendar tanpa satu error pun.

### Payroll — infrastruktur regulasi BPJS dinamis (#3B.1, frontend)
Status: DONE — 6 Sep 2026.

Satu modul baru di-generate: `payroll/bpjs-risk-classes`, plus rute
`app/pages/payroll/bpjs-risk-classes/index.vue` dan entri menu
**BPJS Risk Classes**. Empat modul lama di-regenerate karena schema
backend-nya bertambah kolom: `bpjs-programs` (`uses_risk_class`),
`bpjs-rules` dan `bpjs-enrollments` (`risk_class`), serta
`bpjs-base-definitions` (`daily_basic_method` + `daily_basic_factor`,
yang kedua muncul lewat `visible_when` hanya pada cara berpengali).

Tidak ada satu angka regulasi pun di layar mana pun — tarif, plafon,
dan pengali harian semuanya diisi operator. Itu bukan kebetulan
melainkan syarat #3B.1.

Menu **Compliance → BPJS** tidak lagi menunjuk Deduction Components.
Rutenya harus sama persis dengan `apps/accounts/seeds/menus.py` di
backend — sidebar dirakit dari `menus.ts` sementara pembatasan per role
dicocokkan lewat route di backend, jadi satu huruf yang beda membuat
menunya hilang untuk setiap role yang dibatasi, tanpa error dan tanpa
log. Keduanya disunting bersama.

Aturan bisnisnya di backend: `docs/claude/payroll.md` → Arsitektur BPJS.

---

### Payroll — beban perusahaan (frontend)
Status: DONE — 5 Sep 2026.

Tiga modul di-regenerate dari schema backend, tanpa satu komponen baru:

- `payroll/deduction-template-lines` — kolom, form, filter, dan tipe
  untuk `is_employer_cost` (**Employer Cost**).
- `payroll/dashboard` — dua kartu baru: **Beban Perusahaan** dan
  **Total Biaya Payroll**. Keduanya `span=3`, jadi mereka berbagi
  baris kedua dan tidak memampatkan enam kartu yang sudah ada.
- `payroll/payroll-run-employees` — `employer_contribution` di
  workspace; **tidak** di tabel dan **tidak** di kartu overview, sebab
  angka biaya perusahaan yang duduk sebaris dengan Net Pay terbaca
  sebagai bagian darinya.

Aturan bisnisnya di backend: `docs/claude/payroll.md` → Beban
perusahaan.

---

### Calendar Scope & Import (frontend)
Status: DONE — 5 Sep 2026

Modul `administration/calendar/{work-calendar,holiday}` di-regenerate
dari schema backend (`pnpm meinova generate` + `generate:import`).
Tabel Work Calendar menampilkan `Scope`, `Applies To`, dan satu kolom
`Working Days` (`Mon-Fri`) menggantikan tujuh kolom centang; baris
GLOBAL tampil **`All Companies`**, bukan satu baris per perusahaan.

**Rute halaman wajib `calendar/index.vue`.** `calendar.vue` yang
bersebelahan dengan direktori `calendar/` membuat Nuxt
memperlakukannya sebagai **layout induk**; tanpa `<NuxtPage/>` kedua
layar import diam-diam merender halaman Calendar — tanpa error, tanpa
404. Ditemukan hanya lewat UAT browser, tidak oleh satu pun unit test.
Konvensi yang sudah dipakai `hr/leave-opening-balances/`.

UAT browser (Chrome headless + CDP, tanpa Playwright):

- `scripts/uat/calendar-scope.mjs` — 33/33. **Prasyarat data**: tenant
  harus memuat contoh keempat cakupan termasuk satu Holiday
  `SELECTED_COMPANIES`. Fixture UAT-nya sudah dibersihkan dari `demo`,
  jadi pemeriksaan itu kini gagal karena **datanya tidak ada**, bukan
  karena layarnya rusak.
- `scripts/uat/holiday-import-confirm.mjs` (baru) — 9/9. Upload →
  Preview → Confirm → `run_import.delay()` → worker Celery → baris
  terlihat di tabel Holiday sebagai `GLOBAL / All Companies`. Unggah
  ulang berkas yang sama: `created=0 updated=1`, tanpa duplikat.

Kontrak schema & aturan bisnisnya di backend:
`docs/claude/calendar.md` (repo `backend-erp`).

---

### Payroll Dashboard: halaman contoh diganti layar yang benar-benar berisi
Status: VERIFIED (frontend) — 5 Sep 2026

`/payroll` selama ini **halaman contoh**: "Total Revenue $1.250,44",
"New Customers 1.234", "+12,5%" — angka karangan template yang duduk di
alamat yang sama dengan menu Payroll → Dashboard. Sekarang layarnya
`payroll/dashboard`, hasil `pnpm meinova generate` dari schema backend.

**Nol komponen baru.** Seluruh layarnya `MDashboard` + `MDashboardStat`
/`Chart`/`List`/`Table` yang sudah ada.

**Rutenya `/payroll/dashboard`**, dan menu Payroll → Dashboard menunjuk
ke sana. `/payroll` sendiri jadi pengoper (`definePageMeta({ redirect })`)
— path modul telanjang tetap dijawab supaya tautan lama tidak berakhir
404, tapi halamannya cuma ada satu: dua rute yang merender komponen
yang sama adalah dua tempat yang harus tetap sepakat.

**Empat perluasan framework**, semuanya lahir dari hal yang baru
kelihatan setelah ada dashboard berisi rupiah — dan semuanya berbawaan
"seperti sebelumnya", jadi tidak satu pun dashboard lama berubah:

| Berkas | Perubahan | Sebabnya |
| --- | --- | --- |
| `MDashboardStat.vue` | ukuran huruf angka mengikuti panjangnya | Enam kartu sebaris menyisakan ~138px per kartu. "Rp 132.378.341" pada `text-3xl` tampil "Rp 132…" — Gross Payroll dan Net Payroll terbaca **sama persis** padahal selisihnya delapan juta. Yang diperkecil hurufnya, bukan angkanya: pembulatan menghilangkan tepat yang dicocokkan orang payroll dengan daftar transfer bank |
| `MDashboardChart.vue` + `formatDashboardAxis` | sumbu rupiah dipendekkan (`Rp 20 jt`), tooltip tetap utuh | "Rp 20.000.000" selebar 110px; enam label sebanyak itu bertumpuk jadi `Rp 20.000.0Rp 40.000.0Rp 6…`. Satuannya **jt/M/T**, bukan K/M/B — "132M" berarti miliar bagi sebagian pembaca, kesalahan seribu kali lipat yang tidak berbunyi |
| `MDashboardChart.vue` | `summary: false` mematikan ringkasan di kanan judul | Komposisi Payroll memuat sisi penghasilan **dan** potongan; jumlah keduanya bukan gross, bukan net, bukan biaya. Tercetak besar di sebelah judul, "Rp 140.849.555" terbaca sebagai angka utama kartunya |
| `MDashboardList.vue` | baris boleh bertaut (`row.link`), `data.link` menimpa `widget.link` | Tujuannya bergantung data — "buka run yang sedang dibaca" berisi id yang baru diketahui saat resolvernya jalan, sementara schema di-generate jadi berkas statis. Baris yang tidak menyebut tujuan tetap `<li>` biasa: kursor penunjuk pada baris yang tidak melakukan apa-apa adalah janji yang tidak ditepati |

**Rincian bukan tiga kartu sebaris.** Framework ini tidak punya widget
bertab, jadi "By Policy | By Department | By Location" jadi tiga kartu.
Bertiga selebar 4 kolom, tiap kartu memuat lima kolom yang empat di
antaranya rupiah — dan yang terlihat "Rp 1…" di tiap sel. Susunannya
jadi 12 lalu 6 + 6: Per Kebijakan sebaris penuh (namanya paling
panjang), dua sumbu organisasi berbagi baris di bawahnya, dan 6 + 6
memang selalu berpasangan pas.

**UAT browser** (`scripts/uat/payroll-dashboard.mjs`) memakai Chrome
headless + CDP lewat paket `ws` yang sudah ada di repo — bukan
Playwright, yang tidak terpasang dan berarti ~300MB browser terunduh di
tiap mesin hanya untuk memastikan satu halaman tidak pecah. Sesinya
ditanam sebagai cookie `access` hasil login API, bukan diketikkan ke
form: yang diuji layar ini bukan halaman login, dan menebak bagaimana
`v-model` komponen pihak ketiga mendengarkan event menghasilkan UAT
yang gagal pada halaman yang bahkan bukan sasarannya.

**44/44 lolos.** Selain yang di layar (14 widget terender, tidak ada
console error / NaN / angka KPI terpotong / gulir mendatar di 1440px
maupun 390px, mode terang tetap terbaca), UAT ini menekan filternya
sungguhan, membuka tautan barisnya, dan membaca dashboard yang sama
dengan tiga akun berbeda — cakupan penuh, cakupan sebagian, dan akun
tanpa izin baca payroll. Dua akun terakhir dibuat perintah backend
`payroll_dashboard_uat --schema=demo` dan dihapus lagi sesudahnya.

Dua temuan, keduanya sudah ditutup:

- **Baris daftar tidak bisa diklik.** `:is` diberi string `'NuxtLink'`,
  jadi Vue merendernya sebagai elemen `<nuxtlink>`: keempat temuan
  "Perlu Ditindaklanjuti" tampak bisa ditekan dan tidak membawa ke mana
  pun, tanpa error. Diperbaiki dengan `resolveComponent`; catatannya di
  `docs/claude/dashboard.md`
- **UAT-nya sendiri menempel ke browser run sebelumnya.**
  `chrome.kill()` cuma membunuh proses peluncurnya, jadi Chrome lama
  tetap memegang port debug dan run berikutnya mewarisi cookie serta
  localStorage sesi lama — seluruh pemeriksaan tetap lolos, tapi
  sidebar (dan tangkapan layarnya) menyebut akun yang salah. Sekarang
  browser lama ditutup lewat `Browser.close` sebelum yang baru
  diluncurkan

Berkas: `app/pages/payroll/dashboard.vue` (baru) ·
`app/pages/payroll/index.vue` (jadi pengoper) · `app/constants/menus.ts` ·
`app/modules/payroll/dashboard/*` (generated) ·
`framework/components/dashboard/MDashboard{Stat,Chart,List}.vue` ·
`framework/core/{types,utils}/dashboard.ts` ·
`scripts/uat/payroll-dashboard.mjs` · `scripts/14_dashboard.sh`.

**Sisa:** `app/components/dashboard/TotalVisitors.vue` kini tidak
dipakai siapa pun — ia hanya hidup di halaman contoh yang diganti.
Dibiarkan karena menghapus berkas di luar lingkup tugas ini.

### Payroll Policies: satu layar baru, dan tiga modul yang ikut diregenerate
Status: DONE (frontend) — 4 Sep 2026

`PayrollPolicy` lahir di backend sebagai lapis antara Payroll Setting
perusahaan dan Payroll Assignment pegawai. FE-nya satu layar baru plus
tiga regenerasi.

**Layar Payroll Policies** (`/payroll/payroll-policies`), kartu hub
dipasang persis sesudah Payroll Settings — itu urutan bacanya: default
perusahaan dulu, baru pengecualiannya.

**Tanpa `visible_when`, dan itu disengaja.** Aturan kondisional
framework ditulis `{field: value}` di 193 tempat sementara
`MFormBuilder.evaluateRule` membacanya sebagai `{field, op, value}` —
jadi ia tidak pernah menyala, dan memperbaikinya berarti menyentuh
seluruh 193 aturan sekaligus. Layar ini karena itu menampilkan semua
kolom dan memisahkannya lewat **label**: "Bulanan - Salary Proration
Method", "Harian - Daily Rate Method". `clean()` backend menolak
kombinasi salah tempat, jadi orang yang mengisi kolom harian pada
kebijakan bulanan mendapat penolakan yang menyebutkan alasannya —
bukan kolom yang diam-diam tidak pernah dibaca. Memperbaiki
`visible_when` tetap tercatat sebagai utang framework.

"Ikut kebijakan perusahaan" tampil sebagai **kalimat** di tabel, bukan
sel kosong: sel kosong terbaca seperti data yang gagal termuat,
sementara yang sebenarnya terjadi adalah jawaban yang sah. Nilai
kosongnya sendiri lewat `placeholder`, bukan opsi bernilai `""` —
`SelectItem` reka-ui melempar error untuk nilai kosong, pola yang
sudah dipakai sejak keputusan #2.

**Tiga modul diregenerate:**

| Modul | Kenapa |
| --- | --- |
| `payroll/payroll-policies` | baru |
| `payroll/payroll-run-employees` | kolom "Kebijakan Perhitungan" + tab Payroll Snapshot memuat kebijakan & upah sehari |
| `hr/employees` | tab Payroll assignment dapat field Payroll Policy dan Daily Rate |

**`hr/employees` ikut membawa drift generator yang menumpuk**, bukan
hasil pekerjaan ini: modul yang tersimpan digenerate versi generator
lama, jadi regenerasinya sekalian memasukkan `collection actions`,
penanganan 404 → halaman Not Found, `can_edit`/`can_save`/`can_delete`,
dan sejumlah hint yang sudah lama ada di schema backend. Semuanya
aditif. Menahannya berarti menyunting berkas generated dengan tangan,
yang justru melanggar kontrak "schema backend adalah source of truth".

`Daily Rate` bersembunyi di balik `payroll.view_salary` persis seperti
`Basic Salary` — keduanya tidak tampil untuk pengguna tanpa izin itu,
dan itu memang perilaku yang benar.

Rinciannya di backend `docs/claude/payroll.md`.

### Payroll: layar Overtime Group yang akhirnya punya schema, plus layar tingkat
Status: DONE (frontend) — 3 Sep 2026

Business Decision #4 menambah satu model dan satu kolom, jadi FE-nya
dua layar: satu diperbaiki, satu baru.

**Overtime Group tidak pernah punya schema.** Layarnya sepenuhnya
hasil introspeksi — artinya kolom `tier_basis` akan terbit sebagai
`daily`/`monthly` mentah begitu ia lahir, persis kebocoran yang sudah
dua kali ditutup di modul ini. Schema-nya sekarang ada, dengan nama
manusia untuk kolom yang sudah lama di sana (Hourly Divisor, Default
Multiplier) dan kalimat untuk basis tingkat.

"Belum ditentukan" lagi-lagi lewat **placeholder**, bukan opsi
bernilai kosong: `SelectItem` reka-ui melempar error untuk nilai
kosong dan seluruh dialog akan mati begitu dibuka. Pola yang sama
dipakai Payroll Setting sejak keputusan #2.

**Layar Overtime Tiers** (`/payroll/overtime-group-tiers`) baru,
mengikuti pola Allowance Component terhadap Allowance Template: layar
tersendiri, bukan tab di dalam master-nya, karena master itu memakai
editor dialog dan mengubahnya jadi workspace bertab berarti merombak
layar yang sudah berjalan.

Rentang jam dan pengalinya dibaca sebagai kalimat — "Jam ke-1 dan
seterusnya", "2x upah per jam" — lewat `display_key` yang sudah
disiapkan keputusan #3. Dua angka di dua kolom menyuruh orang
menyusunnya sendiri.

`:g` saja tidak cukup untuk membuang nol berekor: `Decimal("1.00")`
menyimpan presisinya sendiri dan tetap tercetak "1.00", jadi
rentangnya terbaca "Jam ke-1.00 dan seterusnya". `normalize()` yang
membuangnya, `:f` sesudahnya yang menahan 100 berubah jadi "1E+2".

**Tab Component Breakdown** di Payroll Review — yang lahir di
keputusan #3 — langsung menampilkan rantai lemburnya tanpa perubahan
apa pun:

    OT   433,526.01  [kena pajak]
         10000000.00 / 173 = 57803.468208/jam;
         1 jam x 1.5 + 3 jam x 2 (tingkat total sebulan)

Berkas: `app/modules/payroll/overtime-groups/*` dan
`app/modules/payroll/overtime-group-tiers/*` (generated) ·
`app/pages/payroll/overtime-group-tiers/index.vue` ·
`app/registry/master-hub/payroll.ts` ·
`scripts/11_payroll_master.sh`.

### Payroll: label tunjangan yang berbunyi benar, dan rincian yang akhirnya terlihat
Status: DONE (frontend) — 3 Sep 2026

Business Decision #3 tidak menambah field backend, jadi FE-nya juga
kecil. Yang dikerjakan: menghentikan tiga kebocoran enum, dan membuat
rincian perhitungan terlihat di layar.

**Tiga kolom yang tadinya bohong.** Di layar Allowance Component,
Calculation Basis mencetak `percent_of_basic`, sementara Taxable dan
Prorated mencetak "Active"/"Inactive" — pada kolom Taxable itu bukan
cuma janggal, itu salah: "Active" tidak menjawab apakah tunjangan ini
menambah dasar pajak. Sekarang: "% of Basic Salary", "Taxable" /
"Non-taxable", "Prorated" / "Tidak diprorata" / "Per hari (tanpa
prorata)".

**Generator kolom diberi satu jalan keluar opt-in, bukan diperbaiki
menyeluruh.** `display_key` sekarang dibaca **sebelum** cabang boolean.
Tidak ada satu pun schema existing yang mendeklarasikan `display_key`
pada boolean, jadi module lain tidak bergeser sebaris pun — dibuktikan
dengan meregenerate `payroll-settings` dan `leave-rules` lalu
membandingkan: byte-identik. Perbaikan menyeluruh (`column.boolean`
yang sudah ada dan menampilkan Yes/No) tetap jadi utang framework;
mengubahnya sekarang menggeser tampilan tiap kolom boolean di semua
module sekaligus.

**Tab Component Breakdown di Payroll Review.** Sebelum ini rincian per
komponen tidak terlihat di layar mana pun — hanya totalnya. Tiga jalan
buntu, dan semuanya patut dicatat karena akan ditemui lagi:

- tab `resource` butuh endpoint, sedangkan `PayrollRunComponent`
  **sengaja** tidak punya ViewSet dan tidak boleh dibuatkan;
- workspace belum punya tipe tab untuk larik bersarang;
- `field.json` **dibuang generator** — tidak ada widget JSON di
  framework ini. Akibatnya kolom `snapshot` di layar Payslip pun
  selama ini tidak pernah tampil, dan tab yang memakainya terbit
  sebagai "No form fields configured for this section".

Yang dipakai akhirnya: textarea read-only berisi ringkasan yang
disusun serializer. Belum secantik tabel, tapi "kenapa tunjangan ini
800.000" sekarang terjawab dari layar — tiap baris membawa nilainya,
penanda pajak, penanda prorata, dan keterangan yang menghasilkan
angkanya sendiri.

**Temuan framework yang TIDAK diperbaiki.** `visible_when` tidak
berpengaruh apa pun. `MFormBuilder.evaluateRule` menunggu bentuk
`{field, op, value}`, sementara **seluruh 193 aturan** di backend
ditulis dengan dialek pendek `{field: value}` — jadi semuanya
diabaikan diam-diam. Itu sebabnya Rate tetap tampil pada komponen
bernilai tetap, dan Amount tetap tampil pada komponen persentase,
walaupun schema-nya sudah lama menyatakan sebaliknya. Memperbaikinya
berarti **menyalakan 193 aturan sekaligus di semua module** — di luar
cakupan keputusan #3, dan butuh pengujian tersendiri per module.

Berkas: `app/modules/payroll/allowance-template-lines/*` dan
`app/modules/payroll/payroll-run-employees/*` (generated) ·
`scripts/meinova/generators/columns.mjs`.

### Payroll: kebijakan potongan ketidakhadiran, dan enum yang berhenti bocor
Status: DONE (frontend) — 3 Sep 2026

Business Decision #2 menambah tiga kolom kebijakan dan enam kolom
audit. Tidak ada halaman baru yang ditulis tangan — dua module
digenerate ulang dari schema backend, dan hasilnya lengkap.

**Layar Payroll Settings (`/payroll/payroll-settings`)** sekarang punya
bagian potongan di bawah bagian prorata: Attendance Deduction Method,
Deduct Absence, Deduct Unpaid Leave. Semuanya berlabel kalimat manusia
— tidak ada `fixed_30` yang sampai ke layar — dan tetap satu baris per
perusahaan, tanpa konfigurasi per pegawai.

**"Belum ditentukan" tidak jadi opsi di dalam select, dan itu bukan
kelalaian.** Nilainya memang string kosong di database, tapi
`SelectItem` reka-ui **melempar error** untuk nilai kosong — itu nilai
yang ia pakai sendiri untuk mengosongkan pilihan, dan seluruh dialog
Payroll Setting akan mati begitu dibuka. Keadaan itu karena itu
disampaikan lewat `placeholder`: selama belum dipilih, yang terbaca
"Belum ditentukan - memakai hari kerja periode payroll", bukan kotak
kosong yang terlihat seperti data gagal termuat.

**Layar Payroll Review** — tab Days & Hours sekarang menjawab "kenapa
pegawai ini dipotong Rp600.000" tanpa membuka dokumen lain: Absent
Days, Leave Days, Paid Leave Days, Unpaid Leave Days, Attendance
Deduction Method, Deduction Base Days, Absence Deduction, Unpaid Leave
Deduction. Dua angka potongan juga naik ke kolom daftar.

**Satu bug lama ikut ditutup.** Kolom `proration_method` di daftar
Payroll Review mencetak `fixed_30` apa adanya. Sebabnya bukan di sini:
field yang tidak dideklarasikan di schema backend ikut terbawa lewat
introspeksi dengan `table=True`. Diperbaiki di schema (`table=False`
untuk kolom kodenya, label yang tampil), bukan dengan menambal berkas
generated — yang akan hilang di regenerate berikutnya.

**Regenerate tidak merusak perbaikan navigasi sebelumnya.**
`payroll-run-employees` digenerate tiga kali dan `page.vue`-nya tetap
membawa `canEdit`/`canSave`/`canDelete` dan `showError(404)` — karena
perbaikan itu ada di template `crud-workspace`, bukan di berkas
hasilnya. Halaman di `app/pages/payroll/payroll-run-employees/` tidak
disentuh.

Berkas: `app/modules/payroll/payroll-settings/*` ·
`app/modules/payroll/payroll-run-employees/*` (dua-duanya generated) ·
`scripts/15_payroll_processing.sh` tidak berubah.

### Payroll Settings: satu layar untuk kebijakan prorata
Status: DONE (frontend) — 3 Sep 2026

Business Decision #1 (prorata gaji pokok) butuh satu layar konfigurasi,
dan layarnya harus bisa dipakai orang HR — bukan orang yang tahu arti
`fixed_30`.

**Satu module baru digenerate,** `payroll/payroll-settings`, plus
halamannya di `app/pages/payroll/payroll-settings/` dan satu kartu di
Payroll Master Hub (kategori Payroll Setup, paling atas). Tidak ada
module payroll lain yang ikut digenerate ulang tanpa alasan.

**`payroll/payroll-run-employees` memang diregenerate** — schema-nya
berubah (tiga kolom penjelas prorata). Dampaknya ke perbaikan routing
kemarin **diperiksa, dan nol**: `page.vue`-nya keluar **identik**
byte-per-byte, karena perbaikan itu memang dipasang di template
generator, bukan di berkas hasilnya. Itu justru pembuktian yang tidak
direncanakan bahwa keputusan kemarin benar.

**Tiga hal yang tidak boleh dilihat pemakai, dan ketiganya ditutup:**

- **Enum mentah.** Dropdown-nya berbunyi "Fixed 30 days per month",
  bukan `FIXED_30`, dan kolom tabelnya membaca label lewat
  `display_key="proration_method_label"`. Sempat terbaca `calendar_days`
  di daftar sebelum itu dipasang
- **Metode mentah di layar Payroll Review.** Barisnya menyimpan
  `fixed_30`; yang ditampilkan `proration_method_label` dari serializer
- **Tab yang kosong.** Tab **Days & Hours** di Payroll Review terbit
  "No form fields configured for this section" — seluruh angka hari,
  faktor, dan metodenya tidak pernah terlihat di layar mana pun.
  Sebabnya `read_only=True` saja membuat generator membuang field dari
  form; penandanya `display=True`, yang memang sudah ada dan sudah
  dipakai Travel Request, cuma tidak pernah dipasang di schema ini

Sekarang tab itu menjawab "kenapa gaji pokoknya 4.500.000" tanpa
menghitung ulang: **Eligible Days 15,00 · Proration Base Days 30,00 ·
Proration Method Fixed 30 Days · Proration Factor 0,500000**, dengan
gaji sebulan 9.000.000 di Overview dan komponen `BASIC` 4.500.000 di tab
hasil.

**Dua celah framework ikut ketahuan, keduanya gagal tanpa suara:**

- **`help_text` di schema backend tidak pernah sampai ke layar.**
  Generator membuangnya di `form.mjs`; `MFieldHint` sudah lama
  merendernya. Yang hilang cuma jalannya ke sana — dan yang menulisnya
  tidak punya cara tahu, karena tidak ada error, cuma keterangan yang
  tidak muncul
- **`MFormBuilder` tidak mengoper `hint` ke `MSelectField` dan
  `MSwitchField`**, padahal keduanya menerima prop itu dan
  merendernya. Jadi keterangan pada dropdown dan saklar — dua jenis
  field yang paling butuh penjelasan — selalu hilang

Keduanya diperbaiki di generator dan framework, aditif: module yang
schema-nya tidak menulis `help_text` tidak berubah sama sekali.

**UAT browser tenant demo (Chrome headless + CDP), semuanya lewat UI:**

- `/payroll/payroll-settings` terbuka, kartunya muncul di Master Hub
- Dialog Create: label manusiawi, keterangan terbaca di bawah dropdown
  dan kedua saklar, **nol enum teknis** di layar
- Baris kebijakan dibuat untuk Meinova Mineral Resources, lalu metodenya
  diubah lewat dropdown jadi **Fixed 30 days per month** dan disimpan;
  daftarnya menampilkan "Fixed 30 Days"
- **Satu payroll run prorata dijalankan dari layar**: Generate Employees
  → konfirmasi → Calculate → konfirmasi, pada periode UAT November 2026
  dengan pegawai yang masuk 16 November bergaji 9.000.000. Hasilnya
  **4.500.000**, terbaca di tab hasil beserta catatan
  `Prorata 0.500000 dari 9000000.00 (15 / 30 hari, Fixed 30 Days)`

**Yang tidak disentuh:** halaman Payroll Master, layar transaksi lain,
menu, dan seluruh perbaikan routing kemarin. Tidak ada business rule
#2–#7 yang dikerjakan.

**Catatan data demo:** UAT ini meninggalkan satu pegawai (`UATPRO01`),
satu periode (`UAT-2026-11`), dan satu run (`PAY-2026-00004`) di tenant
demo sebagai bukti. Tidak satu pun angka baseline regresi tersentuh —
run Juni yang terkunci dan run Juli tetap seperti adanya.

---

### Payroll: Create / Edit / Detail yang Not Found — rutenya, bukan halamannya
Status: DONE (frontend + sedikit backend) — 3 Sep 2026

Payroll technical baseline tetap **FROZEN**: tidak ada business rule,
angka, atau engine yang disentuh, dan 63 test payroll tetap hijau. Yang
diperbaiki di sini navigasinya saja.

**Akarnya satu kalimat yang sudah tertulis di dokumen proyek ini
sendiri:** `framework_module` menentukan rute FE. Generator mendorong
`router.push("/<framework_module>/create")`, jadi halaman Nuxt-nya wajib
berada di `app/pages/<framework_module>/`. Payroll menaruhnya di rute
yang lebih enak dibaca — `/payroll/periods`, `/payroll/runs`,
`/payroll/review` — sementara module-nya bernama `payroll-periods`,
`payroll-runs`, `payroll-run-employees`. Akibatnya **setiap** Create,
Edit, dan Back di ketiga layar transaksi itu mendarat di "Page not
found", walau tidak satu berkas pun hilang.

Ini persis kegagalan yang pernah kena di Leave/Roster Policy dan sudah
dicatat di `docs/claude/generator-schema.md`. Payroll mengulanginya, dan
catatannya sekarang menyebut Payroll juga.

**Halamannya dipindah, bukan module-nya ditambal.** Menambal jalur
di dalam `page.vue` hasil generator akan hilang tanpa suara pada
`pnpm meinova generate` berikutnya — dan yang kembali persis 404 ini.

```
app/pages/payroll/periods/**  → app/pages/payroll/payroll-periods/**
app/pages/payroll/runs/**     → app/pages/payroll/payroll-runs/**
app/pages/payroll/review/     → app/pages/payroll/payroll-run-employees/
```

**`payroll-run-employees` tidak punya satu halaman pun.** Module-nya
digenerate, daftarnya dipinjamkan ke `/payroll/review`, tapi rute
`index`, `[id]`, dan `[id]/edit` miliknya sendiri tidak pernah dibuat —
jadi membuka baris dari layar Review, dan tombol Back-nya, 404. Sekarang
ketiganya ada. **`create.vue` sengaja tidak dibuat**: schema-nya
`create=False`, baris pegawai lahir dari Generate Employees.

`/payroll/review` dihapus dan menunya menunjuk `/payroll/payroll-run-employees`.
Judul menunya tetap "Payroll Review" — nama layar boleh manusiawi, yang
tidak boleh beda cuma rutenya.

**Bank Transfer dan Tax Report dilepas dari menu.** Keduanya ada di
sidebar sejak sebelum modul Payroll dikerjakan dan halamannya memang
belum pernah ada, jadi keduanya mendarat di 404. Menu yang menjanjikan
layar yang tidak pernah terbuka lebih buruk daripada menu yang belum
muncul; mengembalikannya nanti cukup dua blok di `menus.ts` plus
barisnya di `seed_menus`.

**Keadaan terkunci akhirnya terbaca di layar.** Temuan lama (tombol Save
tetap tampil pada run FINALIZED) selesai, dan bukan lewat `visible_when`
yang jadi jebakan di layar create. Servernya yang menjawab, lewat tiga
boolean yang **sengaja terpisah**:

| Field | Menentukan |
| --- | --- |
| `can_edit` | tombol Edit + item Edit di menu baris |
| `can_save` | tombol Save / Save & Close |
| `can_delete` | tombol Delete + item Delete di menu baris |

Menyatukan `can_edit` dan `can_save` **hampir** membuat kerusakan yang
lebih besar daripada bug aslinya: run yang menunggu persetujuan tidak
boleh disunting isinya, tapi layar edit-nya justru satu-satunya tempat
tombol **Withdraw** dan **Finalize** tinggal (keduanya `modes=["edit"]`).
Satu field untuk dua pertanyaan berarti payroll yang sudah disetujui
tidak bisa difinalisasi siapa pun. Ketahuan waktu menelusuri
`visible_when` tiap action, sebelum sempat masuk.

Mode `create` selalu boleh menyimpan — barisnya belum ada, jadi belum
ada yang bisa menyatakannya terkunci. Itu tepat masalah yang membuat
`visible_when` pada `action.save()` tidak bisa dipakai. Resource yang
tidak mengirim ketiga field itu tidak berubah sama sekali
(`undefined !== false`), jadi seluruh module lain aman.

**Dua bug framework ikut ketahuan, keduanya gagal tanpa suara:**

- **Item menu baris yang tidak melakukan apa pun.** `MCrudActions`
  ber-`showEdit`/`showDelete` bawaan `true`, sementara `createColumns`
  cuma mengoper handler-nya. Resource yang mematikan Delete lewat schema
  (`ui.delete: False` — Payroll Review) tetap menampilkan item Delete,
  dan menekannya **tidak menghasilkan apa pun**: tidak ada yang
  mendengarkan, tidak ada pesan. Sekarang keduanya dioper eksplisit, dan
  ikut membaca `can_edit`/`can_delete` per baris
- **ID yang tidak ada tidak pernah jadi Not Found.** `page.vue` menangkap
  galat lalu menampilkan **workspace kosong lengkap dengan tombol Save**.
  Tautan basi terbaca seperti record yang memang belum terisi.
  Sekarang khusus 404 dinaikkan jadi `showError({ statusCode: 404 })`;
  galat lain tidak diubah — jaringan putus bukan alasan mengganti
  seluruh halaman dengan "Page not found"

Ketiga perbaikan itu dipasang di **template generator** (`scripts/meinova/
templates/crud-workspace/page.vue`) dan `framework/builders/columns/
createColumns.ts`, lalu disalin identik ke tiga `page.vue` payroll —
jadi tidak ada module yang perlu diregenerate sekarang, dan regenerate
nanti tidak menghapusnya. Semuanya aditif: module yang tidak mengirim
field barunya berperilaku sama persis.

**UAT browser tenant demo (Chrome headless + CDP), semuanya lewat UI:**

- **29 rute payroll → OK**, nol Not Found. Tiga rute lama
  (`/payroll/runs`, `/payroll/periods`, `/payroll/review`) memang 404
  sekarang dan itu benar — tidak ada satu tautan pun yang menunjuk ke
  sana
- **Round-trip penuh Payroll Period 9/9**: List → Actions → Create →
  isi form (termasuk dua lookup) → Save → breadcrumb kembali ke List →
  Detail → tombol Edit → ubah → Save → refresh browser, nama tersimpan.
  Record ujinya dihapus lagi sesudahnya
- **Row action Edit** dari tabel Run, Period, dan Review → membuka
  `/…/{id}/edit` yang benar (ketiganya 404 sebelum ini)
- **Menu aksi per baris**: run FINALIZED **kosong**, run review "Edit",
  Payroll Review "Edit" saja (Delete hilang), Payslips tanpa kolom aksi
  sama sekali
- **Payroll Input**: baris periode Juli (review) "Edit/Delete", baris
  periode Juni (finalized) **kosong**
- **Tombol per keadaan**: run finalized tanpa Edit/Save/Delete; run
  review Edit di detail dan Save di edit; periode finalized terkunci;
  baris pegawai pada run finalized terkunci
- **ID salah** (`/999999`) dan **record yang sudah dihapus** → halaman
  Not Found sungguhan, bukan formulir kosong
- Modul dialog (Payroll Input, Allowance/Deduction Components, Tax
  Brackets, Leave Rules) membuka dialog Create tanpa pindah rute —
  memang tidak butuh halaman create/edit

**Tidak diubah:** angka, business rule, engine, workflow, migrasi,
seed payroll, dan halaman Payroll Master. Tidak ada module payroll yang
diregenerate.

**Yang tersisa, sengaja:** `/payroll/payroll-runs/2/edit` masih terbuka
kalau alamatnya diketik langsung pada run FINALIZED — isinya read-only,
tanpa Save dan tanpa satu pun tombol proses, jadi tidak ada yang bisa
dilakukan di sana. Menjadikannya 404 berarti menebak keadaan dokumen di
sisi rute, dan itu lapisan aturan kedua di tempat yang salah. Tombol
"Actions" per baris juga tetap terender walau menunya kosong pada baris
terkunci; menyembunyikannya berisiko ke pemakai `<slot>` di
`MCrudActions`.

---

### Payroll Baseline Freeze: layar ikut dibekukan, bukan cuma backend-nya
Status: FROZEN (baseline teknis, tanpa perubahan kode) — 3 Sep 2026

Hasil UAT Payroll dinyatakan technical baseline. **Tidak satu berkas
frontend pun diubah di tahap ini** — tidak ada module yang digenerate
ulang, tidak ada halaman baru, tidak ada menu yang bergeser. Yang
ditulis di sini batasnya, supaya tahap berikutnya tidak diam-diam
merombak layar yang baru saja dipakai sebagai alat bukti.

**Payroll BELUM production-ready.** Layarnya sudah terbukti menampilkan
angka yang benar; yang belum ada aturan bisnis di belakang angkanya.
Jangan menyatakan modul ini siap pakai ke pengguna — tujuh keputusan
bisnis masih terbuka, dan empat di antaranya (pembagi harian, perlakuan
absen, plafon BPJS, metode PPh21) **mengubah angka yang tercetak di
slip**. Daftarnya di `docs/claude/payroll.md` repo Django.

**TECHNICALLY VERIFIED di sisi ini** — sembilan module payroll processing
yang digenerate dari schema, tombol proses yang muncul/hilang lewat
`visible_when` (run FINALIZED tidak menampilkan satu pun tombol proses),
halaman Payslips yang angkanya sama persis dengan hasil run, layar
Review yang memperlihatkan efek effective date antara Juni dan Juli, dan
halaman Payroll Master yang tidak disentuh sama sekali.

**Yang dibekukan:** sembilan module `app/modules/payroll/*` beserta
halamannya, empat kartu Master Hub, entri menu Payroll, dan
`scripts/15_payroll_processing.sh`. Selama baseline berlaku, module
payroll **hanya** diregenerate kalau schema backend memang berubah —
regenerate "sekalian" akan menggeser layar yang angkanya sudah dijadikan
pembanding.

**Satu temuan UI tetap terbuka dan sengaja tidak diperbaiki.** Pada run
FINALIZED, tombol **Save** dan **Save & Close** masih tampil; API
menolaknya (`assert_editable`), jadi tidak ada risiko data. Perbaikannya
butuh syarat yang membedakan "belum ada nilai" dari "nilainya bukan itu"
di generator/runtime — bukan perubahan schema payroll — dan itu di luar
baseline ini. Dicatat ulang di sini supaya tidak hilang bersama entri
yang lebih lama.

**Berhenti di sini.** Halaman Bank Transfer, Tax Report, importer
Payroll Input, dan layar THR menunggu instruksi berikutnya.

---

### Payroll UAT: layar dipakai sebagai alat bukti, bukan diubah
Status: DONE (verifikasi, tanpa perubahan kode) — 3 Sep 2026

Tahap ini validasi backend, dan **tidak satu berkas frontend pun
diubah** — tidak ada module yang digenerate ulang, tidak ada halaman
baru, tidak ada menu yang bergeser. Yang dikerjakan di sisi ini
memakai layarnya untuk membuktikan hasil UAT terbaca sebagaimana
mestinya.

UAT browser (Chrome headless + CDP) sesudah login, atas data UAT
sungguhan di tenant demo:

- **`/payroll/runs/2/edit`** — run yang sudah FINALIZED menampilkan
  status `finalized`, overview 3 pegawai / net 34.131.827,57, dan
  **tidak satu pun tombol proses**: Generate Employees, Calculate,
  Submit, Acknowledge, dan Finalize semuanya hilang. `visible_when` di
  schema backend yang mengaturnya, dan ia bekerja
- **`/payroll/payslips`** — 3 slip terbit (`SLP-2026-000001` s/d
  `000003`) dengan Net Pay 11.460.000 / 13.471.994,22 / 9.199.833,35,
  persis sama dengan hasil run
- **`/payroll/review`** — baris periode Juli menampilkan basic
  20.000.000 dan net 20.623.000, sementara baris Juni yang terkunci
  tetap 10.000.000. Effective date terbaca di layar, bukan cuma di test
- **`/payroll/periods`** — UAT-2026-06 berstatus `finalized` lengkap
  dengan `Locked at`, UAT-2026-07 masih `review`

**Satu temuan UI, sengaja belum diperbaiki.** Pada run yang sudah
FINALIZED, tombol **Save** dan **Save & Close** masih tampil; menekannya
ditolak API (`assert_editable`), jadi tidak ada risiko data — tapi
tombol yang selalu gagal tetap bug. Perbaikannya **tidak** sesederhana
menambah `visible_when={"status": [...]}` pada `action.save()`: di layar
create nilainya belum ada, dan syarat atas nilai yang belum ada berarti
tombolnya hilang dari form record baru — jebakan yang sudah tercatat di
`docs/claude/generator-schema.md`. Yang dibutuhkan syarat yang membedakan
"belum ada nilai" dari "nilainya bukan itu", dan itu perubahan di
generator/runtime, bukan di schema payroll. Ditulis di sini supaya tidak
hilang.

Hasil dan mapping lengkapnya di `docs/claude/payroll.md` repo Django.

---

### Payroll Processing: mengisi menu yang sudah menjanjikannya
Status: DONE (frontend) — 3 Sep 2026

Menu Payroll sudah punya heading Processing sejak lama — Payroll
Periods, Payroll Run, Payroll Adjustments, Payslips — dan **tidak satu
pun halamannya ada**. Yang dikerjakan di sini mengisinya, plus empat
layar konfigurasi baru yang lahir dari schema backend.

**Sembilan module digenerate seperti biasa,** tidak satu pun ditulis
tangan:

```
pnpm meinova generate payroll/payroll-periods
pnpm meinova generate payroll/payroll-runs
pnpm meinova generate payroll/payroll-run-employees
pnpm meinova generate payroll/payroll-inputs
pnpm meinova generate payroll/payslips
pnpm meinova generate payroll/allowance-template-lines
pnpm meinova generate payroll/deduction-template-lines
pnpm meinova generate payroll/leave-rules
pnpm meinova generate payroll/tax-brackets
```

Tiga pertama workspace bertab (schema-nya memang `ui.workspace`),
sisanya dialog. Seluruh tombol proses — Generate Employees, Calculate,
Acknowledge Warnings, Submit, Withdraw, Finalize, Cancel — datang dari
`actions` di schema backend, jadi tidak ada satu baris pun di sisi ini
yang tahu urutan tahapan payroll. Kapan tombolnya muncul juga dari sana
(`visible_when` atas `status` dan `approval.can_act`).

**Halaman Payroll Master tidak disentuh.** Tidak digenerate ulang, tidak
dipindah, tidak diubah. Komponen isi template dapat layarnya sendiri
(`/payroll/allowance-components`, `/payroll/deduction-components`) —
halaman template memakai editor dialog, dan mengubahnya jadi workspace
bertab berarti merombak layar yang sudah berjalan.

**Menu:** dua item diperbaiki, bukan dirombak.

- "Payroll Adjustments" → `/payroll/adjustments` adalah tautan ke
  halaman yang tidak pernah ada. Koreksi/adjustment adalah salah satu
  **jenis** Payroll Input, bukan modul tersendiri, jadi itemnya jadi
  "Payroll Input" → `/payroll/inputs`
- "Tax" → `/payroll/tax` dan "BPJS" → `/payroll/bpjs`, sama-sama tidak
  pernah ada, diarahkan ke layar tempat aturannya benar-benar
  dikonfigurasi: Tax Brackets dan Deduction Components
- Satu item **ditambah**: "Payroll Review" → `/payroll/review`
- Empat master baru masuk **Master Hub**, bukan ke sidebar: itu memang
  tempatnya, dan sidebar Payroll tidak bertambah panjang

**Satu halaman ditulis tangan: `/payroll/reports/summary`.** Bentuknya
bukan CRUD — ia memilih satu run lalu membaca
`GET /api/payroll/payroll-runs/{id}/summary/`. Rekapnya dijumlahkan
**backend**, bukan di sini: satu run 500 pegawai punya ribuan baris
komponen, dan menjumlahkannya di browser berarti mengirim seluruhnya
lebih dulu.

Temuan validasi ikut ditampilkan di halaman laporan, bukan cuma di layar
run. Angka rekap yang lahir dari run bermasalah tetap terlihat rapi di
sini, dan itu justru yang berbahaya.

**Satu jebakan yang ketahuan waktu UAT:** amplop daftar API ini
`{ data: [...], meta: {...} }`, bukan `{ results }` bawaan DRF. Dropdown
run-nya kosong tanpa satu pun pesan error sampai itu dibetulkan —
halaman ini tidak lewat generator, jadi tidak ikut mewarisi
penanganannya. Sekarang keduanya diterima.

**Validation/warning, approval, dan payslip** semuanya dari backend:
`error_count`/`warning_count` di kolom tabel, `validation_summary` untuk
rinciannya, `approval.can_act` yang menentukan tombol keputusan, dan
Payslip yang read-only di API (`http_method_names` dibatasi) sehingga
generator tidak memasang tombol tulis apa pun.

**Cakupan data tidak ditangani di sini sama sekali** — penyaringannya di
API. Layar ini cuma menampilkan apa yang dikirim.

**Testing.** `pnpm typecheck` (butuh `NODE_OPTIONS=--max-old-space-size=8192`):
tidak ada error baru di berkas yang ditulis tangan; tiga module workspace
baru mewarisi dua error template yang sama persis dengan **seluruh**
module workspace lain di repo ini (`ColumnDef` dan `TabField`, ada di
20+ module sejak sebelumnya). `eslint` bersih untuk seluruh berkas baru.
UAT browser (Chrome headless + CDP, lihat `docs/claude/development.md`)
menjalankan 11 halaman payroll sesudah login: semuanya render dengan data
sungguhan — Review 10 baris, Allowance Components 6, Deduction Components
4, Tax Brackets 5. Halaman Payroll Run menampilkan tombol yang benar
untuk status Review (Generate Employees, Calculate, Submit for Approval)
beserta angka overview-nya. Halaman Summary menampilkan kartu total,
enam temuan validasi, tiga tabel rekap, dan angka rupiah terformat.

Kontrak lengkapnya (basis perhitungan, status, cakupan) ada di
`docs/claude/payroll.md` repo Django.

**Yang belum:** halaman Bank Transfer dan Tax Report — dua item menu
Reports yang sudah ada sejak sebelum pekerjaan ini dan masih menunjuk
halaman yang belum dibuat.

---

## Cara kerja

- Backend schema adalah source of truth. Kalau schema berubah,
  **regenerate module-nya**, jangan menyunting hasil generate.
- Gunakan generator/builder existing sebagai jalur utama; audit
  builder/runtime existing sebelum membuat solusi khusus module.
- Semua request lewat `useApi()`.
- Keputusan final ditulis ke dokumen domain, **bukan** ditumpuk di
  berkas ini.

Dokumen domain: `docs/claude/dashboard.md`,
`docs/claude/generator-schema.md`, `docs/claude/framework-patterns.md`,
`docs/claude/api-state.md`, `docs/claude/architecture.md`,
`docs/claude/hr/leave.md`, `docs/claude/hr/travel-request.md`.

---

## Completed / Stable

### Minimum Rest: sel Recovery, dan tidak satu baris pun yang menghitungnya
Status: DONE (frontend) — 2 Sep 2026

Backend menambah satu keadaan kalender (`recovery`) dan satu angka
(`recovery_days`); yang dikerjakan di sini merendernya. Aturannya —
berapa jam jeda minimum, hari mana yang jadi Recovery — seluruhnya di
backend (lihat CURRENT-WORK repo Django). Tidak ada satu baris di sisi
ini yang membandingkan jam.

**Empat perubahan, dan semuanya kecil:**

- `types.ts` — `RotationState` dapat `'recovery'`, respons dapat
  `recovery_days`
- `palette.ts` — `STATE_TONES.recovery` hijau lime, dengan latar dan
  garis **penuh** seperti sel kerja. Sengaja bukan garis putus-putus
  milik `unplanned`: hari pemulihan bukan lubang, ia jadwal yang memang
  direncanakan. Dan jelas berbeda dari `field_break` yang abu-abu netral
  — yang satu jatah libur roster, yang satu lagi jeda dari pergantian
  shift
- `page.vue` — badge **"N hari recovery"** di kepala kalender.
  Angkanya dari `recovery_days` milik respons, **bukan** dihitung ulang
  dari `days`: baris pemulihan boleh membentang melewati blok off dan di
  sana tidak berarti apa-apa. Badge-nya ada supaya "kenapa bulan ini
  hari terjadwalnya kurang" punya jawaban di layar yang sama dengan
  angka yang turun
- Grid, agenda, dialog tanggal, dan legenda warna **tidak disentuh** —
  ketiganya sudah merender `rotation_state_label` apa adanya, dan
  legendanya memang dirakit dari keadaan yang muncul di bulan itu

Sel Recovery `is_scheduled: false` dan tanpa `shift_code`, jadi ia
**tidak** ikut terhitung sebagai "hari kerja tanpa shift" yang oranye
itu. Dua keadaan berbeda: yang oranye lubang master, yang hijau
keputusan.

**Tiga modul diregenerate** karena schema backend berubah —
`hr/roster-policies` (kolom Minimum Rest (hours) di tab Cycle Pattern),
`hr/roster-shift-rotations`, dan `hr/shift-assignments` (kolom Kind;
Shift tidak lagi wajib dan disembunyikan lewat `visibleWhen` saat
Kind = Recovery / Rest). Modul `hr/shift-calendar` ditulis tangan, jadi
tidak ada yang perlu diregenerate di sana.

Test:
- `vue-tsc` — **76 error di 40 berkas**, dan **nol** di berkas yang
  disentuh. Yang muncul di `RosterPoliciesWorkspace.vue` (2 error)
  adalah pola yang **sama persis** dengan ketujuh belas modul workspace
  lain yang tidak disentuh sama sekali (`SiteRotations`, `Leave`,
  `Employees`, `workflow/definitions`, …) — cacat template generator,
  bukan regresi
- `eslint app/modules/hr/shift-calendar/` — **nol temuan**. Modul hasil
  generate memang tidak lolos eslint di repo ini (`roster-setup-lines`
  dan `leave-policies` yang tidak disentuh pun tidak), jadi itu bukan
  regresi
- UAT browser tenant `demo`, Chrome headless + CDP: **13/13 PASS** —
  `SHIFT-3 → Recovery → SHIFT-2` terbaca di sel 15/16/17 September,
  badge "2 hari recovery", "27 / 30 hari terjadwal", legenda menyebut
  Recovery, dialog tanggal berbunyi "Recovery · Kewajiban presensi:
  Tidak · Shift: —", kolom Minimum Rest di layar Roster Policy, dan
  baris "Recovery / Rest" di Shift Assignment Records

Angka di badge memang **turun**, dan itu yang diinginkan: LOK001
September 2026 berbunyi "27 / 30 hari terjadwal" — 29 hari kerja menurut
roster dikurangi dua hari Recovery. Tanpa badge-nya, dua hari yang
hilang tidak punya penjelasan di layar mana pun.

Dokumentasi: `docs/claude/hr/shift-calendar.md` (bagian "Hari Recovery"
+ warna).

**Halaman `/help` ikut diverifikasi — 3 Sep 2026.** Isinya milik backend
(diseed, bukan berkas di repo ini), jadi tidak ada satu baris pun yang
disunting di sisi frontend. Yang diperiksa **renderernya**, dan itu yang
memang bisa gagal diam-diam: UAT browser tenant `demo` **10/10 PASS** —
artikel *Mengatur perputaran shift dan membaca Shift Calendar* terbuka
lewat pencarian kata "recovery", bagian barunya ikut muncul di daftar
isi otomatis (*Di halaman ini*, diturunkan backend dari heading), dan
**keenam tabelnya terender sebagai tabel** — bukan tag mentah, yang
berarti isi barunya lolos `sanitize_html()` utuh.

---

### Employee Shift Calendar: kalender sendiri tanpa memilih siapa pun
Status: DONE (frontend) — 2 Sep 2026

Perubahannya kecil dan seluruhnya soal **bentuk layar**, bukan aturan:
tidak satu baris pun di sini yang menghitung siapa boleh melihat siapa.
Aturannya di backend (lihat CURRENT-WORK repo Django); yang dipakai di
sini **kesimpulannya**.

**Satu rute, dua bentuk layar.** Layar ini melayani empat kursi lewat
satu pintu, dan yang paling banyak jumlahnya — pegawai biasa — justru
yang paling salah dilayani sebelumnya: ia disodori dropdown "Pilih
pegawai" yang isinya **satu nama, namanya sendiri**, lalu layar kosong
sampai ia memilihnya. Sekarang ia mendarat langsung di kalendernya.

- `GET /api/hr/shift-calendar/access/` (baru) dibaca sekali saat layar
  dibuka: `selector_required`, `default_employee`, `can_adjust`
- `selector_required === false` → penyaring **Location dan Employee
  tidak dirender sama sekali**; Month tetap ada, dan kartunya menyempit
  (`md:max-w-xs`) alih-alih menyisakan dua kolom kosong
- `default_employee` mengisi pegawainya. Id-nya datang dari backend,
  **bukan** ditebak dari `/auth/me` — akun dan kartu pegawai dua hal
  berbeda, dan yang dipakai kalender yang kedua
- **Selagi jawabannya belum datang, penyaring ditampilkan**
  (`selector_required !== false`). Arah kesalahannya dipilih sadar:
  menyembunyikan lebih dulu lalu memunculkan terbaca seperti layar yang
  berubah sendiri; sebaliknya cuma menghilangkan satu penyaring yang
  belum sempat disentuh siapa pun
- Dipanggil di `onMounted` **di dalam composable**, bukan saat setup:
  di SSR request-nya jalan tanpa sesi pemakainya dan jawabannya jadi
  jawaban untuk orang yang salah

**VIEW ≠ ADJUST, dan sekarang terlihat begitu di kode.** Tombol "Adjust
Shift" dibaca dari `can_adjust` milik `access/` — jawaban backend, bukan
kesimpulan layar. "Hapus adjustment" tetap
`canWrite('hr.employeeshiftassignment').remove`: menghapus adalah kata
kerja yang berbeda dari menerbitkan, jadi izinnya dibaca terpisah.
Pembaca tanpa izin tulis tetap melihat **seluruh** kalender — yang
hilang cuma tombolnya, dan itu memang bentuk yang diinginkan untuk
pegawai dan atasan langsung.

Siapa yang melihat tombolnya ditentukan **seluruhnya di backend**, lewat
seed izin — bukan oleh satu baris pun di sini:

| Kursi | Tombol Adjust |
| --- | --- |
| Pegawai, atasan langsung | tidak |
| Admin Section, Admin Department | ya |
| HR Admin, HR Manager, Super Admin | ya |

Matriks itu berubah **tanpa menyentuh frontend**: yang dicentang di
layar Roles, dan `can_adjust` ikut sendiri.

**Empty state dipecah dua**, dan itu bukan kerapian: "Pilih pegawai"
pada layar yang tidak punya penyaring adalah instruksi yang tidak bisa
dijalankan siapa pun. Kalimat keduanya menyebut sebab yang sebenarnya —
akun yang belum ditautkan ke kartu pegawai.

Modul `hr/shift-calendar` **ditulis tangan** (bukan hasil generator),
jadi tidak ada yang perlu diregenerate; schema backend tidak berubah.

Test:
- `vue-tsc` — **19 error di 8 berkas, identik baseline**, **nol** di
  berkas yang disentuh (`page.vue`, `types.ts`, `useShiftCalendar.ts`)
- `eslint app/modules/hr/shift-calendar/` — **nol temuan**
- UAT API tenant `demo` (di repo backend, transaksi di-rollback):
  **47/47 PASS** atas sembilan kursi nyata. Yang paling relevan untuk
  layar ini — `selector_required=false` + `default_employee` terisi
  untuk pegawai biasa (`demo.opr1`, `demo.sitestaff`); `true` untuk
  supervisor, Admin Section/Department, HR, dan Super Admin;
  `can_adjust=false` untuk pegawai **dan** atasan langsung, `true`
  untuk empat kursi sisanya — dan `access/` selalu sepakat dengan apa
  yang benar-benar dilakukan `POST /shift-assignments/`

**Belum dikerjakan (sengaja):** UAT browser untuk bentuk baru layarnya.
Yang sudah diverifikasi payload dan logikanya, bukan pikselnya —
sebelumnya bagian ini dikunci UAT browser 77/77 dan angka itu **belum
diulang** untuk perubahan ini.

Dokumentasi permanen: `docs/claude/hr/shift-calendar.md`
("Penyaring — dua bentuk layar, satu rute" + "Permission — VIEW ≠
ADJUST").


### Shift Calendar untuk Admin Dept/Section dan atasan langsung
Status: DONE (frontend) — 2 Sep 2026

Dua issue UAT, dan **keduanya akarnya di backend** (lihat CURRENT-WORK
repo Django). Yang berubah di sisi ini satu baris fungsional.

**Approval terakhir yang "gagal disimpan" bukan bug frontend.**
`inbox.vue` sudah benar: ia membaca `error.data.errors.workflow[0]` lalu
`error.data.message`, dan baru jatuh ke kalimat generik kalau keduanya
kosong. Yang membuatnya kosong adalah **500** — response-nya bukan
envelope DRF sama sekali. Akarnya callback `on_commit` di dispatcher
notifikasi yang melempar sesudah datanya commit. **Tidak ada workaround
di FE**, dan itu keputusan yang disengaja: menelan 500 di `catch` akan
menyembunyikan kegagalan sungguhan yang bentuknya sama persis.

**`/hr/shift-calendar` — satu param, dan bukan kosmetik.** Dropdown
Employee sekarang mengirim `reporting_line: 1` lewat `depends`:

```vue
:depends="{ location: calendar.locationId.value, reporting_line: 1 }"
```

Atasan langsung dicakup `own`, jadi tanpa param itu ia cuma menemukan
**dirinya sendiri** di dropdown — padahal jadwal timnya yang harus ia
pantau, dan meja "Atasan Langsung" pada Roster Setup memang ia yang
tanda tangani. Terbukti di UAT: dropdown polos **1 baris**, dengan param
**17**.

- Param-nya **tidak** memperluas apa pun dengan sendirinya: isinya
  diturunkan backend dari akun yang meminta, jadi yang paling jauh bisa
  didapat seseorang adalah bawahannya sendiri
- Endpoint kalendernya tetap memeriksa ulang — **dropdown bukan
  penjagaan**, dan pegawai di luar cakupan tetap ditolak 400 walau
  id-nya diketik langsung ke URL
- Halamannya ditulis tangan, jadi tidak ada yang perlu diregenerate

**Menu**: `/hr/shift-calendar` kini diseed untuk `ADMIN-SECTION`,
`ADMIN-DEPARTMENT`, dan `EMPLOYEE` (`seed_menus` di backend; sumber
kebenaran susunannya tetap `app/constants/menus.ts`). Kartunya muncul di
hub **Attendance & Leave** — bukan Roster & Travel — jadi yang harus
dicek saat UAT adalah hub itu, **bukan sidebar**: sejak isinya jadi
kartu, sidebar hanya menampilkan hub-nya. Pemeriksaan UAT yang mencari
teks "Shift Calendar" di sidebar gagal dua kali karena itu, dan yang
salah pemeriksaannya, bukan menunya.

**Typecheck**: 76 error, **semuanya sudah ada sebelumnya**, nol di
`shift-calendar/page.vue`. (Catatan 1 Sep yang menyebut "19 error" salah
— itu hasil menghitung dari ekor log yang terpotong, bukan dari seluruh
keluaran `vue-tsc`.)

**UAT browser (Chrome headless + CDP, tenant `demo`) — 11/11.** HR
Manager menekan Approve di browser → tidak ada "Keputusan gagal
disimpan", dokumen `committed`; `demo.sitespv` membuka kalender LOK001
dan melihat DAY 07:00–19:00 → NIGHT 19:00–07:00 (+1) dengan "29/30 hari
terjadwal"; pegawai Jakarta HO ditolak 400 untuk Admin Section maupun
supervisor.


### HR → Roster Setup: cakupan organisasi + alur persetujuan
Status: DONE (frontend) — 1 Sep 2026

Perubahannya **hampir seluruhnya backend** (lihat CURRENT-WORK repo
Django). Yang berubah di layar: daftar Add Employees jadi lebih pendek
dan lebih benar, dan alasan penolakan akhirnya sampai ke pengguna.
Modul `hr/roster-setups` **tidak diregenerate** — schema backend-nya
tidak berubah, dan meregenerate module yang schema-nya sama hanya
menghasilkan diff kosong yang menyamarkan diff berikutnya.

**Satu perbaikan framework, dan dampaknya jauh lebih luas dari satu
modul.** Tombol action tidak punya kolom yang bisa ditempeli error, jadi
toast-nya satu-satunya yang dilihat pengguna — dan untuk **setiap**
penolakan validasi toast itu berbunyi `"Validation failed."`, karena
`apiErrorMessage` membaca `data.message` sementara alasannya ada di
`data.errors`. Di form tidak kelihatan (`normalizeApiErrors`
menempelkannya ke kolom); di tombol Submit tidak ada kolomnya.

- `apiErrorDetail(error)` baru di `framework/core/utils/errors.ts`:
  meratakan `data.errors` jadi satu kalimat, `null` kalau envelope-nya
  memang tidak punya `errors`
- **Didahulukan** di jalur `run()` `MRecordActions.vue`; 403/404/jaringan
  putus tetap lewat `apiErrorMessage` seperti biasa
- Berlaku untuk seluruh tombol action di semua modul. Yang paling
  terasa: Submit Roster Setup yang ditolak karena dokumennya memuat dua
  atasan berbeda kini menyebutkan **siapa membawahi siapa**, bukan dua
  kata

**Yang dilihat pengguna di layar Roster Setup:**

- **Add Employees** cuma menampilkan pegawai yang benar-benar boleh
  masuk: aktif, di site dokumen, cocok dengan penyaring
  Department/Section, Roster-nya berlaku, belum punya rencana berjalan,
  dan **di dalam cakupan data pembuatnya**. Pegawai HO tidak pernah
  muncul di dokumen site
  - Id yang tetap dikirim tapi tidak layak **dilaporkan jumlahnya** di
    pesan hasil — sebelumnya dilewatkan diam-diam, jadi "5 pegawai
    ditambahkan" untuk sepuluh id terbaca seperti berhasil seluruhnya
- **Preview Schedule** kini menyebut temuan **dokumen dan alur**, bukan
  cuma temuan baris. "0 bermasalah" pada dokumen yang mejanya bercabang
  terbaca seperti siap diajukan, lalu Submit-nya ditolak dengan alasan
  yang tidak pernah muncul di preview
- **Dropdown Add Employees membawa `reports_to` tiap kandidat.** Satu
  dokumen hanya boleh memuat satu atasan langsung, dan di data peragaan
  satu site punya tujuh — tanpa kolom itu penyusun batch baru tahu
  batch-nya bercabang **sesudah** tiga puluh nama dipilih. Kolomnya
  sudah dikirim backend; **menampilkannya di chip/daftar
  `MMultiLookupField` belum dikerjakan** (lihat known limitation)
- Form dokumen tidak berubah bentuknya. Yang berubah: Department dan
  Section ikut terisi otomatis dari cakupan pembuatnya, alasan yang sama
  dengan Company/Site — dokumen yang Section-nya kosong **hilang dari
  layar Admin Section yang baru saja membuatnya**

**Known limitation (belum dikerjakan, sengaja):**

- Hasil Preview Schedule masih ditampilkan sebagai **toast, bukan
  panel**. Rincian per pegawai — segmen, peringatan, `shift_plan` —
  sudah dikirim backend (`document_validations`,
  `workflow_validations`, `lines`) dan **tidak dirender di mana pun**.
  Panelnya pekerjaan halaman custom, bukan generator
- `MMultiLookupField` merender `label` + `disabled_key` saja, jadi
  `reports_to` yang sudah dikirim `candidates/` belum terlihat. Menaruh
  atasan di label backend akan mengubah teks yang sama untuk semua
  pemakai multilookup; yang benar kolom kedua di baris pilihan —
  perubahan framework, bukan modul
- **Tombol pemecah dokumen per atasan belum ada.** Satu site di data
  peragaan butuh tujuh dokumen dan ketujuhnya masih disusun tangan

Dokumentasi permanen: `docs/claude/framework-patterns.md` ("Alasan
penolakan validasi dulu tidak sampai ke layar").


### HR → Roster / Shift Calendar — jadwal shift terbit sendiri
Status: DONE — 26 Ags 2026; **UX + konfigurasi rotasi 27–28 Ags 2026**

Alur yang dilihat pengguna HR, dan tidak satu langkah pun melewati layar
penugasan shift:

0. **Roster Policy → tab Shift Rotation** — urutan perputaran shift site
   itu, **sekali** saat menyiapkan site (penyiapan, bukan pekerjaan
   harian)
1. **Roster Schedule** — blok kerja; rencana shift **terbit sendiri**
   dari langkah 0, tanpa tombol ditekan
2. **Shift Calendar** — hasilnya per tanggal
3. **Adjust Shift** — pengecualian, dibuat dari kalender

Layar kalender **perencanaan operasional** (bukan laporan) yang menjawab
satu pertanyaan: *"orang ini tanggal ini bekerja shift apa, jam berapa,
dan apakah itu berbeda dari rencananya?"* Tidak ada shift yang dihitung
di frontend.

- `app/modules/hr/shift-calendar/` — **ditulis tangan**: endpoint
  kalender merakit tiga sumber backend dan tidak punya baris untuk
  disunting, jadi bukan bentuk yang dikenal generator. Halaman tipis di
  `app/pages/hr/shift-calendar/index.vue`
- `app/modules/hr/shift-assignments/` — **hasil generator**, tidak
  disentuh tangan. Sejak 27 Ags jadi **Shift Assignment Records**:
  kategori hub `advanced` + `order: 900`, layar audit/penelusuran, bukan
  alur. Satu-satunya tempat lapis `baseline` bisa dilihat/disunting
  satu-satu — dan satu-satunya tempat kata "Layer" masih muncul
- Menu: kartu di hub **HR → Attendance & Leave** (`registry/
  section-hub/hr-attendance-leave.ts`). Seed menu backend ikut
  dipindahkan ke grup Attendance supaya dua sisi menyebut tempat yang
  sama — `useMenuAccess` mencocokkan rute, jadi aksesnya tidak pernah
  terputus karenanya. Baris menunya **tidak** dibuang saat kartunya
  dipindah: rute tanpa baris menu dianggap boleh
- **Kategori hub adalah tab penyaring, bukan judul kelompok.**
  Daftar kartunya datar dan diurutkan `order` saja — memindahkan kartu
  ke kategori `advanced` tanpa menaikkan `order` membuatnya tetap
  berdiri di urutan kedua pada tab "All". Ketahuan lewat UAT
- **Penyaring Location → Employee → Month.** Location mempersempit
  dropdown pegawai lewat `depends`; penyaringannya dikerjakan backend.
  Butuh satu tambahan backend yang **aditif**: param
  `location`/`company`/`branch` pada `/api/hr/employees/lookup/` — tanpa
  param daftarnya utuh, jadi Employee Master/Org Chart/Reporting Line
  tidak berubah
- **Lapis ditentukan alurnya, bukan dropdown.** Tombol di roster
  menulis `baseline`, dialog di kalender menulis `override`; kata
  "Layer"/"Baseline" tidak pernah muncul di kedua dialog. Sumber tanggal
  dibacakan dari `shift_source_label` backend ("Roster", "Adjustment",
  "Employee Default", "Work Schedule") — bukan peta istilah versi FE
- **Adjustment selalu `override` + `reason` wajib**, mendukung rentang
  tanggal, dan **alasannya ikut ditampilkan** di dialog tanggal
  (`assignment_reason`). Validasi tidak disalin ke FE — backend yang
  menolak, dan pesannya ditempel ke kolom lewat `normalizeApiErrors`. Menghapus
  override mengembalikan baseline sendiri; sesudah simpan/hapus
  kalender **dimuat ulang**, bukan ditambal
- **Nol kode shift di kode FE.** Warna dibagikan menurut urutan
  `shift_id` yang muncul di bulan itu, jadi layar tetap benar untuk
  tenant yang shift-nya bernama lain
- Desktop grid bulanan / ponsel daftar agenda, dipisah **CSS** bukan
  `useMediaQuery`

**Dua jebakan yang kena dan sudah dibereskan**, keduanya gagal tanpa
error: `useApi().request` mengembalikan envelope `{success, data}` apa
adanya sehingga kalender berbunyi "tidak ada data" untuk pegawai yang
jadwalnya jelas ada (idiom `response?.data ?? response`, sama dengan
`useDashboard`); dan `hint` kustom pada `MDateField` **menimpa** contoh
format bawaannya, menghilangkan satu-satunya petunjuk bahwa kolom itu
hari-dulu (`18.08.26`, bukan ISO).

Test:
- **UAT browser 77/77 PASS** (Chrome headless via CDP, tenant `demo`),
  lima blok: pola LOK001 Agustus 2026 persis seperti backend
  (02–08 S1 · 09–10 S3 · **11–13 S2 override** · 14–15 S3 · 16–22 S2 ·
  23–29 S1 · 30–31 S3) dengan penanda adjustment tepat di 11–13; shift
  malam tampil `23:00–07:00 (+1)` dan shift siang tidak; tiga shift tiga
  warna; **override rentang 18–20 SGA002 dibuat lalu dihapus** dan
  18–20 kembali ke baseline sementara 17 & 21 tidak pernah bergeser;
  travel/field break terbaca dan tidak menawarkan adjust; BOD001 31 sel
  `Not Applicable` + 0 hari terjadwal; `demo.gmsite` tidak melihat
  pegawai HO; read-only user tetap melihat kalender tanpa tombol tulis;
  390px memakai daftar agenda **tanpa gulir mendatar**; mode gelap
  seluruh badge terang dan dialog memakai token tema; layar Shift
  Assignment hasil generator terbuka dan terisi; console bersih
- `vue-tsc` — **76 error di 40 berkas, identik baseline**, daftar
  berkasnya sama persis, **nol** di berkas yang disentuh
- `eslint` berkas tulis tangan — **nol temuan**. Module hasil generator
  berprofil sama dengan module generate lain (378 baris vs 520/1381)
- Regresi backend untuk param lookup baru:
  `apps.hr.tests.applicability` — **26 test OK**

Dokumentasi permanen: `docs/claude/hr/shift-calendar.md` (baru) +
`docs/claude/framework-patterns.md` ("Layar operasional yang bukan CRUD
dan bukan dashboard"). Kontrak backend:
`~/Project/python/backend-erp/docs/claude/hr/shift-calendar.md`.

**Data UAT**: `tenant_command seed_shift_calendar_demo --schema=demo
--start=2026-08-01` lalu `seed_demo_attendance --schema=demo
--start=2026-08-01 --until=2026-08-31`.

#### Penyederhanaan UX + konfigurasi rotasi — 27–28 Ags 2026

Yang berubah di FE, dan tidak satu pun menyentuh cara shift dihitung:

- **Layar Roster Policy dapat tab inline *Shift Rotation*** — modul baru
  `app/modules/hr/roster-shift-rotations/` (**hasil generator**), plus
  `hr/roster-policies` diregenerate. Di situlah urutan perputaran shift
  disimpan: Step / Shift / Days
- **Roster Schedule dapat tombol *Generate Shift Baseline*** (tanpa
  isian — polanya milik konfigurasi) di samping *Set Shift Pattern
  (Manual)*. Keduanya datang dari schema backend, jadi cukup
  `generate hr/site-rotations`. Dialog manual memilih beberapa shift
  (**urutan pilihan = urutan perputaran**), panjang perputaran, dan
  rentang opsional — dan menyebutkan batasnya: polanya bertahan sampai
  rosternya berubah
- **Tombol Adjust Shift tidak ditawarkan** untuk pegawai yang
  `attendance_applicable`-nya false; overridenya akan tersimpan tanpa
  mengubah apa pun. Kenyamanan, bukan penjagaan
- Kolom read-only **Shift Plan** di grid Schedule dokumen roster
- Tab jadwal roster berganti nama **"Travel Purpose" → "Schedule"**
  (nama lama sisa dari masa `SiteRotation` merangkap Travel Request)
- Judul kalender jadi **Employee Shift Calendar** dengan kalimat yang
  menyebut Roster lebih dulu; tombol **Adjust Shift** (kapital konsisten)
- **Tiga perbaikan `MRecordActions.vue`** yang berlaku untuk seluruh
  record action, ketiganya gagal tanpa suara sebelumnya: `help_text`
  tidak pernah dirender untuk field non-`multilookup` (11 field di
  berbagai modul sudah menulisnya dan tidak satu pun terbaca), `default`
  dari schema diabaikan, dan ikon yang tidak terdaftar di
  `actionIcons.ts` jatuh ke `Zap` — `CalendarSync`/`CalendarPlus`/`Clock`
  belum ada di peta, jadi tiga tombol Roster Schedule tampil identik
- **`MMultiLookupField` mengingat label baris yang pernah dimuat.**
  `rows` cuma memuat hasil pencarian terakhir, jadi chip pilihan
  sebelumnya berubah jadi **angka id mentah** begitu kotak cari diketik
  lagi — dan di dialog yang urutan chip-nya bagian dari keputusan, itu
  satu-satunya umpan balik yang didapat pengguna

Test:
- **UAT browser 57/57 PASS**, tiga blok. A (14): tombol ada di dokumen
  roster, dialognya **tanpa pilihan Layer**, pola SHIFT-2 → SHIFT-1
  tersimpan dan terbaca di kolom Shift Plan, baris Off tidak membawa
  shift. B (20): kalender LOK004 langsung mencerminkan roster **tanpa
  membuka layar Shift Assignment**, sumbernya berbunyi "Roster",
  adjustment 18–20 → SHIFT-3 dengan 17 & 21 tidak bergeser, `(+1)`
  tampil, alasannya terbaca, hapus adjustment mengembalikan rencana
  roster. C (23): kartu Records turun ke urutan paling belakang, pola
  LOK001 Agustus **tidak bergeser sama sekali**, presensi memakai shift
  efektif (telat 22 menit diukur terhadap shift hasil penyesuaian),
  cakupan `demo.gmsite` tetap, read-only user tanpa tombol tulis, 390px
  tanpa gulir mendatar, mode gelap
- `vue-tsc` — tetap **76 error di 40 berkas, identik baseline**; dua
  yang ada di module roster hasil generate adalah pola yang sama persis
  di **setiap** `*Workspace.vue`
- `eslint` berkas yang disentuh — **nol temuan pada baris yang
  ditambahkan** (2 temuan lama `style/quotes` di `actionIcons.ts` tetap;
  berkas itu memang memakai kutip ganda sejak awal)
- Backend: `apps.hr.tests.shift_calendar` **55 OK** ·
  `apps.hr.tests.roster` **114 OK** · `apps.hr.tests.attendance`
  **62 OK** · `apps.hr.tests.travel_request` **93 OK** ·
  `apps.hr.tests.applicability` **26 OK** — 350 test, serial per modul

Test revisi (baseline dari konfigurasi, 28 Ags 2026):
- **UAT browser 73/73 PASS**, empat blok. ux2-a (15): tiga langkah
  perputaran terbaca di tab Shift Rotation, **Generate Shift Baseline
  tanpa isian**, dijalankan dua kali menghasilkan jumlah blok yang sama
  (idempoten). ux-b (20): rentang penyesuaian di tengah baseline, hapus
  → kembali ke rencana roster, `(+1)` shift malam, hari off tanpa shift
  — diverifikasi ulang terhadap pola konfigurasi SHIFT-1 → SHIFT-3 →
  SHIFT-2. ux2-b (15): roster **digeser 3 hari → rencana ikut tanpa satu
  tombol pun ditekan**, digeser balik → pulih persis; BOD `Not
  Applicable` 0/31; MANAGEMENT tetap terjadwal; presensi memakai shift
  efektif. ux-c (23): IA/hub, pola acuan LOK001, cakupan data,
  permission, 390px, mode gelap
- `vue-tsc` **76 error di 40 berkas — identik baseline**; `eslint`
  `app/modules/hr/shift-calendar` **nol temuan**
- Backend: `apps.hr.tests.shift_calendar` **66 OK** ·
  `apps.hr.tests.roster` **114 OK** · `apps.hr.tests.attendance`
  **62 OK** — 242 test. Dijalankan di **database test tersendiri**
  karena sesi lain memakai database test bersama di saat yang sama

**Satu bug backend ketahuan lewat UAT, bukan lewat test:**
`ShiftCalendarDaySerializer` menyebut kolom sel satu per satu, jadi dua
kunci baru **hilang di payload endpoint** sementara service dan seluruh
test service-nya hijau. Layarnya yang memperlihatkannya — dan sekarang
ada test API yang menguncinya.

### Reports → HR → Contract Expiry
Status: DONE — 25 Ags 2026 (revisi presentasi chart, 25 Ags 2026)

Laporan masa kontrak: 5 KPI, 2 chart batang, dan satu tabel 18 kolom
berisi **daftar orang** yang kontraknya sudah atau akan habis. Tanpa
periode dan **tanpa pemilih tanggal**. Menyelesaikan handoff backend;
tidak ada kontrak baru yang dibuat di sisi FE, dan tidak ada semantik
renewal yang dikarang sendiri — semuanya dibacakan dari respons.

- `app/modules/reports/hr/contract-expiry/` — **hasil generator**,
  `node scripts/meinova/cli.mjs generate reports/hr/contract-expiry`
- `app/pages/reports/hr/contract-expiry.vue` — halaman tipis
- `app/constants/menus.ts` + `app/registry/section-hub/reports.ts`
  (kategori `hr`, `order: 40`, ikon `i-lucide-file-clock`)
- **Dua perbaikan runtime**, keduanya tidak menggeser layar yang sudah
  ada (diregresi ulang, lihat di bawah):
  - **Baris Total tabel** (`MDashboardTable.vue`) — hanya berdiri kalau
    ada kolom yang benar-benar menampilkannya. `data.totals` tidak
    dijanjikan sekunci dengan kolom tabelnya, dan Contract Expiry
    mengirim rekap **per bucket**; tanpa penjagaan ini yang muncul baris
    tebal berisi kata "Total" dan tujuh belas sel kosong. Penyaringnya
    ditaruh **di dalam computed `totals`**, bukan sebagai penanda
    boolean di sebelahnya — `v-if` pada penanda terpisah tidak
    menyempitkan tipenya dan menambah 2 error `vue-tsc` baru
  - **Bunyi chart kosong** (`MDashboard.vue` → `MDashboardChart.vue`) —
    "Belum ada data pada **periode** ini" untuk dashboard berperiode
    (tidak berubah), "…pada **filter** ini" untuk laporan potret.
    Kalimat lama menyuruh pembacanya mengganti pemilih periode yang di
    laporan potret memang tidak pernah dibuat

Test:
- **UAT browser 128/128 PASS** (Chrome headless lewat CDP, tenant
  `demo`, sesudah `tenant_command seed_contract_expiry_demo`):
  rute/menu/hub terbit; **tidak ada pemilih maupun label periode**;
  5 KPI 1/1/1/1/5 dengan baris grid lima kolom; kedua chart
  benar-benar dirender ApexCharts — Timeline 12 bulan yang **totalnya
  5** (= Total Kontrak Aktif, tanpa ember "Sudah Lewat"/"Tanpa Tanggal
  Akhir") dan Expiring by Department `Site Operations 3 / Human
  Resources 1` yang **totalnya 4** (= keempat kartu mendesak, LOK008
  yang 300 hari lagi tidak ikut); tabel 18 kolom urut Expired → terdekat
  → terjauh, `days_remaining` −6 tampil apa adanya, Renewal Doc kosong
  jadi "—" bukan 0, dan **tidak ada baris Total kosong**; cari
  nama/nomor menyisakan barisnya tanpa menggeser KPI/chart; filter
  Company/Location/Department memindahkan KPI, chart, dan tabel
  bersamaan; Expiry Status "Expired" membuat kartu "≤ 30 Hari" berbunyi
  0 (filter menyaring **populasi**, bukan tabel saja); Renewal Status
  "Pending Approval" → SGA003 + `EAC-2026-00033`; `demo.gmsite` → **4**
  dan tetap 4 walau seluruh id company/location dipaksa lewat query
  string; di ponsel 375px halaman tidak tergulir mendatar dan kedua
  chart tetap terbit; mode gelap memakai varian palet gelap
  (slate-300 / #eab308), bukan tertinggal di varian terang
- **Regresi 9/9 PASS**: Manpower Summary tetap punya baris Total
  30/25/5/0 dan penghitung "Kelompok"; HR Period Summary tetap punya
  baris Total dan pemilih periodenya; Employee Reporting Audit tetap
  tanpa baris Total
- **Console bersih** — Contract Expiry menghasilkan keluaran yang sama
  persis dengan Manpower Summary dan Employee Reporting Audit; nol
  exception dan nol permintaan API yang gagal
- `vue-tsc --noEmit` — **76 error di 40 berkas, identik dengan
  baseline**; daftar berkasnya sama persis, dan **nol** di berkas yang
  disentuh maupun di module hasil generate
- `eslint` pada berkas yang disentuh — **nol temuan pada baris yang
  ditambahkan** kecuali **3** yang mengikuti gaya berkasnya sendiri
  (2 `style/quotes` di `MDashboard.vue`, 1 `antfu/if-newline` di
  `MDashboardTable.vue`; seluruh pohon `framework/` memang begitu).
  `app/constants/menus.ts` **12 temuan sebelum dan sesudah** — tidak
  satu pun pada baris yang ditambahkan. Module hasil generator
  (`schema.ts` 678 temuan) berprofil sama persis dengan dua module
  laporan yang sudah ada — itu gaya keluaran generator, dan
  memperbaikinya dengan tangan akan tertimpa saat diregenerate

Dokumentasi permanen: `docs/claude/dashboard.md` ("Dashboard tanpa
periode" — termasuk kenapa pemilih tanggal **belum** dibuat, "Widget
`table`" — aturan baris Total, "Layar yang memakai runtime ini" —
enam layar + bagian Contract Expiry). Kontrak backend:
`docs/claude/reports.md` di repo Django, bagian "Contract Expiry".

**Angka UAT bergeser tiap hari** karena Contract End-nya tetap
sementara "hari ini" berjalan. Jalankan ulang
`tenant_command seed_contract_expiry_demo --schema=demo` di hari UAT
dan angka di atas kembali persis.

**Dua revisi presentasi (25 Ags 2026), keduanya tampilan saja** —
payload, populasi, filter, cakupan, dan seluruh angka tidak disentuh
(KPI tetap 1/1/1/1/5, chart tetap 5 dan 4):

1. **Timeline jadi batang tegak** (`horizontal=False` di `schema.py`
   backend lalu **diregenerate**, bukan disunting di `schema.ts`);
   Expiring by Department tetap mendatar karena itu peringkat.
2. **Expiring by Department jadi donut** (`chart="donut"`), angka
   tengahnya 4 = yang perlu ditindaklanjuti, **bukan** Total 5.

Empat perbaikan runtime lahir dari keduanya dan berlaku untuk seluruh
chart: sumbu cacahan dibulatkan + label kategori dimiringkan
(`BaseBar.vue`), donut bisa membaca bentuk `datasets`+`categories`
(`MDashboardChart.vue` — tanpa itu kartunya berbunyi "Belum ada data"
di sebelah Total yang jelas berisi), palet kategori 5 → **9 slot**
(memperbaiki tabrakan lama: irisan ke-6 "Headcount by Employee Group"
berwarna sama persis dengan irisan pertama), dan celah antar-irisan
donut memakai warna kartu, bukan putih tetap.

Aturan durable-nya sudah pindah ke `docs/claude/dashboard.md`
("Sumbu bar chart", "Palet kategori", "Widget `table`"); yang tinggal di
sini angka acuan UAT-nya. Test revisi: **UAT 53/53** lalu **72/72
PASS**, seluruh UAT lama **128/128 tetap PASS**, backend
`test_contract_expiry` **84/84**, `vue-tsc` tetap 76/40 identik
baseline.

**NEXT dari revisi ini:** pasangan slot 3 ↔ 4 palet kategori
(amber ↔ merah) berdempetan **sejak awal** dan cuma terbaca jelas oleh
mata normal. Memperbaikinya berarti menggeser lima slot pertama —
artinya mengecat ulang Leave Breakdown dan chart lain — jadi itu
keputusan tersendiri, bukan efek samping revisi tampilan.

### Reports → HR → Manpower Summary
Status: DONE / STABLE — 24 Ags 2026

Laporan jumlah dan komposisi tenaga kerja: 4 KPI, 5 chart, dan satu
tabel **agregat** (satu baris = satu kombinasi company → location →
department). Tanpa periode.

- `app/modules/reports/hr/manpower-summary/` (hasil generator), halaman,
  item menu, kartu hub (`order: 30`)
- **Tiga perbaikan runtime**, semuanya bawaannya tidak berubah:
  `statGridClass()` (kolom baris KPI mengikuti jumlah kartunya),
  `total_label` pada widget tabel (bawaan tetap "Pegawai"), dan
  **`primary` ditambahkan ke palet chart** — nama itu tidak pernah ada
  di sana sehingga Apex jatuh ke hitam; ikut memperbaiki "Regular OT" di
  HR Period Summary

Test: UAT browser 57/57 PASS. Angka acuan tenant demo: KPI 30/25/5/0,
11 baris tabel agregat, filter Company MMR → 28 / MNI → 2, Location
Sagea Mine → 19, `demo.gmsite` → 19.

Dokumentasi permanen: `docs/claude/dashboard.md`.

### Reports → HR → Employee Reporting Audit
Status: DONE / STABLE — 23 Ags 2026

Satu tabel 19 kolom berisi struktur pegawai, garis pelaporan, dan akun
login-nya. Tanpa periode, KPI, chart, maupun drill-down.

- module hasil generator, halaman, item menu, kartu hub
- `MDashboard.vue` — label periode + badge rentang ikut
  `v-if="periodFilter"`, sama dengan pemilihnya

Test: UAT browser 21/21 PASS (tenant `demo`, akun `admin`, 30 baris).

Dokumentasi permanen: `docs/claude/dashboard.md`.

### Organization Scope pada filter dashboard
Status: DONE / STABLE — 23 Ags 2026

Filter Company bercentang banyak di HR Dashboard, Administration
Dashboard, dan laporan (dari schema backend, lewat regenerate).
`MDashboardFilters.vue` mendapat `normalizeDepend()` — induk bercentang
banyak mengubah "belum dipilih" dari `null` jadi `[]`, dan array kosong
itu truthy. Layar Security → Data Permission tidak diubah.

Dokumentasi permanen: `docs/claude/dashboard.md` ("Filter Organization
Scope").

### "Lokasi Saya" (`self_filter`) + label & pengelompokan Location
Status: DONE / STABLE — 23 Ags 2026

Tombolnya menerima satu angka maupun daftar (`toArray`), menyala hanya
kalau filternya berisi persis pilihannya, dan **isinya diputuskan
backend** — FE tidak pernah tahu siapa yang direksi. Label Location
menyebut company hanya saat ambigu ("Jakarta Head Office — MMR"); untuk
direksi dropdown dikelompokkan per kode lokasi, tanpa perubahan kode FE.

Dokumentasi permanen: `docs/claude/dashboard.md` ("Tombol
`self_filter`").

### Employee Group — Feature Applicability
Status: DONE / STABLE — 23 Ags 2026

Dua bentuk, keduanya sudah ada di framework: **saklar di master**
(Employee Group diregenerate, enam saklar) dan **field yang menyalakan
dirinya dari nilai form** (`autofill` + `visibleWhen` dengan
`not is_false`). Selector employee per modul menyaring lewat
`lookupParams: { feature: … }`.

Applicability **bukan** penyaring visibilitas: Employee Master, Org
Chart, Reporting Line, Headcount, Employee Reporting Audit, Manpower
Summary, dan **Contract Expiry** tidak ikut tersaring.

Dokumentasi permanen: `docs/claude/generator-schema.md`; kontraknya
`docs/claude/hr/employee-group.md` di repo Django.

### HR Leave — approver read-only
Status: DONE / STABLE — 21 Ags 2026

`can_edit` (bukan `is_editable`) yang menentukan read-only per pembaca;
`readonly_when` sudah datang dari schema di 14 field. Rute email tetap
`/hr/leave/{id}/edit`.

Dokumentasi permanen: `docs/claude/hr/leave.md`.

### HR Travel Request
Status: DONE / STABLE — 20 Ags 2026

Termasuk Cancel Request (`cancel_request`, bukan `cancel`), tab resource
inline, dan `errors.rotation_period`.

Dokumentasi permanen: `docs/claude/hr/travel-request.md`.

---

## Pending / Known Gaps

### Workflow Administration — NEXT

1. **`Add Row` / `Save Rows`** — komponen framework, 22 modul ikut.
   Keputusan bahasa aplikasi, bukan keputusan layar Workflow
2. **`visibleWhen` di grid inline** — hari ini hanya form yang
   menghormatinya, jadi baris Atasan Langsung tetap memperlihatkan sel
   Peran/Cakupan Peran. Perbaikannya menyentuh
   `MWorkspaceResourceInline.vue` yang dipakai 22 modul
3. **UAT browser ulang Attendance Permission** — kasus Bimo/Hesti/Eko
   sudah lulus lewat resolver dan test otomatis (274/274); yang belum
   diulang lewat layar

### Shift Calendar — NEXT

Layar Employee Shift Calendar **selesai**, dan alurnya sudah
disederhanakan jadi tiga langkah (27–28 Ags 2026). Yang ditahan, dan
seluruhnya perluasan — bukan lubang:

- **Pola shift belum tersimpan di mana pun.** *Set Shift Pattern*
  menulis hasilnya, bukan polanya; menyusun ulang berarti memilih
  shift-nya lagi. Rumahnya yang wajar `RosterPolicy` di backend — kolom
  master baru, jadi keputusan tersendiri
- **Perputaran mengulang dari awal di tiap blok kerja.** Perputaran yang
  berlanjut antarblok (yang meratakan beban malam antar crew sepanjang
  tahun) belum ada
- **Pola masih ditetapkan per dokumen roster** = per pegawai. Satu crew
  masih ditekan satu per satu; bulk-nya menunggu endpoint backend
- **Urutan perputaran ditentukan urutan klik** di multilookup, dan cuma
  dijelaskan lewat `help_text` + urutan chip. Belum bisa disusun ulang
  tanpa membatalkan pilihan

- **Crew/Team Shift Calendar** dan **Location Shift Calendar** —
  endpoint-nya **belum ada di backend**, jangan mulai dari FE
- **Bulk assign** — service backend sudah menerima banyak pegawai
  sekaligus; endpoint-nya belum ada
- **Approval workflow untuk shift adjustment** — backend memang belum
  punya; tercatat NEXT di sana juga
- **Minimum rest validation** antar shift berurutan — belum ada di mana
  pun
- **`EmployeeAttendance.shift` belum diisi importer** (baru seed) —
  gap backend
- **Site attendance exception policy/UAT** — `ATT-MMR-SITE` mematikan
  kedua ambang cuti, jadi site tidak pernah menerbitkan exception. Itu
  konfigurasi hidup, bukan bug
- **Dropdown Shift menampilkan nama, sel kalender mencetak kode.**
  Kontrak lookup backend (`label_field = name`); memperbaikinya ikut
  menggeser layar lain yang memakai lookup itu
- **Rentang override diketik, bukan diseret di kalender**; pemilih
  bulan/tahun langsung juga belum ada

Rinciannya: `docs/claude/hr/shift-calendar.md` → "Known limitation".

### HR → Attendance Import — layar belum dikerjakan

Backend **selesai** (24–25 Ags 2026) dan kontrak permanennya ada di
`~/Project/python/backend-erp/docs/claude/hr/attendance-import.md`
(712 baris: profile, device mapping, resolusi hari kerja lintas tengah
malam, idempotensi, pesan error, contoh format file, angka acuan UAT).
Endpoint import generiknya **tidak berubah**; yang berubah isi
schema-nya, jadi langkah pertamanya **regenerate**:

```bash
node scripts/meinova/cli.mjs generate:import hr/attendance
python manage.py tenant_command seed_attendance_import_demo --schema=demo
```

Yang berdampak ke layar, dan rinciannya ada di dokumen backend:

- `preview_columns` jadi **12 kolom**; ambil dari `ui-schema`, jangan
  ditulis tangan. Baris preview juga membawa `status` dan `match_source`
  yang tidak masuk daftar kolom
- **Status baris bukan cuma valid/invalid** — `valid`, `no_schedule`,
  `no_roster_shift`, dan `incomplete_day` **tetap terimport** (kuning);
  `duplicate` abu-abu; sisanya merah. `status_label` sudah berisi teks
  siap tampil — **jangan** memetakan kode ke label sendiri
- Ringkasan membawa `duplicateRows`, `sourceRows`, **dan** `totalRows`.
  Satu baris file bisa jadi **dua** baris preview (`row_mode:
  daily_in_out`) dengan `rowNumber` yang sama — **jangan pakai
  `rowNumber` sebagai key `v-for`**
- Lookup profile membawa `format.summary` / `format.notes`; render apa
  adanya, jangan menulis teks bantuan per profile di FE. `format` bisa
  `{}` — sembunyikan panelnya
- Baris `outside_organization_scope` sengaja mengirim `employee_code`
  dan `employee_name` **kosong**; jangan ditambal lookup
- `AttendanceDeviceEmployee` **belum punya endpoint CRUD** — jangan
  mulai layarnya, akan ada handoff terpisah. Nomor mesin yang belum
  dipetakan memang muncul sebagai `unknown_device_employee`
- Tombol **Waive / Require Leave**: kalau di FE ada logika yang
  menyembunyikannya untuk non-HR, lepaskan — backend yang menegakkan
  izinnya dan 403-nya sudah membawa pesan yang bisa ditampilkan

### Contract Expiry — NEXT

- **As Of Date yang bisa dipilih** belum ada; laporan selalu potret hari
  ini. Butuh **tipe filter tanggal baru** di runtime dashboard —
  keputusan bersama backend, jangan ditambahkan sepihak dari FE
- Tidak ada drill-down dari kartu KPI maupun batang chart ke daftar
  barisnya; belum diminta

### Baseline yang belum ditelusuri

- **`[Vue Router warn]: No match found for location with path
  "/reports/hr"`** muncul di **setiap** halaman `/reports/hr/*` —
  breadcrumb merakit tautan ke segmen `/reports/hr` yang tidak punya
  rute. Bukan temuan layar mana pun (Manpower Summary dan Employee
  Reporting Audit memunculkannya identik). Kalau dikerjakan: entah
  buatkan halaman indeksnya, atau buat breadcrumb tidak menautkan
  segmen yang tidak punya rute
- **"Hydration completed but contains mismatches."** tercatat 24 Ags
  2026 muncul di seluruh aplikasi. **Tidak terlihat** pada pemeriksaan
  25 Ags 2026 di `/reports/hr/manpower-summary` maupun
  `/reports/hr/contract-expiry`; belum ditelusuri kenapa. Kalau nanti
  dikerjakan, mulai dari app shell (sidebar/tema), bukan dari halaman
  laporan
- **`pnpm typecheck` tidak pernah hijau** — baseline **76 error di 40
  berkas** (`api-keys/types.ts`, `framework/core/utils/date.ts`,
  `MSettingSection.vue`, `MCrudFilters.vue`, dan puluhan
  `*Workspace.vue` hasil generate). Cara membacanya **diff** terhadap
  baseline, bukan menuntut nol. Butuh
  `NODE_OPTIONS=--max-old-space-size=8192`
- **`eslint` juga tidak pernah hijau** — seluruh pohon `framework/`
  memakai double-quote sementara aturannya single-quote, dan module
  hasil generator membawa ratusan `style/quotes`/`quote-props`/
  `comma-dangle` (bandingkan antar module, jangan diperbaiki tangan —
  akan tertimpa saat diregenerate). Ukurannya temuan **pada baris yang
  ditambahkan**

### Lain-lain

- **`UserDataPermission` belum punya layar.** Cakupan tambahan per orang
  hari ini hanya bisa diisi lewat seed/shell; layar Data Permission
  mengelola cakupan **role** saja. Bentuknya sudah tersedia —
  `UserDataPermission` sengaja sama persis dengan `RoleDataPermission`
  supaya `MTreeBuilder` dan service-nya dipakai ulang apa adanya.
  **Jangan membuat komponen pohon kedua.**
- **Label ambigu di Branch/Department/Section** belum diperbaiki;
  polanya sudah berdiri di `LocationLookup`.
- **Filter Company di layar CRUD** (Advanced Filter tabel) belum
  ditinjau — ronde Organization Scope hanya menyentuh filter dashboard
  dan laporan.
- **UAT browser yang masih tersisa**: tekan "Lokasi Saya" sebagai
  `demo.bod1` di HR Period Summary (harapkan badge `Location: 2
  dipilih`, Headcount 11); centang dua Company lalu pastikan dropdown
  Location ikut menyempit dan turunannya mati lagi saat Company
  dikosongkan; layar Attendance / Roster Assignment / Travel Request
  untuk penyaring Feature Applicability. Semuanya sudah lolos lewat
  HTTP/API.
- `references/hr/grades` dan `references/hr/work-location-types` masih
  memuat `id` ganda di `types.ts`; hilang sendiri begitu diregenerate.
- **Endpoint `from-rotation-period` belum punya pemanggil di FE** —
  diverifikasi ulang 23 Ags 2026 (`grep` di `app/`, `framework/`,
  `scripts/` nol hasil). Temuan lama dari ronde Travel Request B7;
  belum jadi task.

---

## Catatan pemadatan

**28 Ags 2026.** Kronologi dua revisi presentasi Contract Expiry (±90
baris) dipadatkan jadi satu ringkasan + pointer, **sesudah** diperiksa
bahwa aturan durable-nya memang sudah tinggal di
`docs/claude/dashboard.md` ("Sumbu bar chart", palet 9 slot beserta
catatan slot 3 ↔ 4, aturan baris Total, dashboard tanpa periode). Angka
acuan UAT-nya sengaja **tidak** dibuang — itu yang dipakai membandingkan
saat layarnya disentuh lagi.

**26 Ags 2026.** Handoff Shift Calendar dari backend (±160 baris
instruksi + contoh payload) dibuang setelah layarnya dikerjakan sampai
selesai, di-UAT, dan diverifikasi terhadap kode. Kontrak permanennya
tinggal di dua tempat: `docs/claude/hr/shift-calendar.md` di sini
(bentuk layar, aturan warna, adjustment, responsive, jebakan) dan
`docs/claude/hr/shift-calendar.md` di repo Django (payload, semantik
`rotation_state`, aturan lapis baseline/override). Yang tetap disimpan
di atas: perintah seed dan pola acuan LOK001 Agustus 2026, karena itu
yang dipakai membandingkan saat layarnya disentuh lagi.


**25 Ags 2026.** Handoff Contract Expiry dari backend (±240 baris
instruksi) dibuang setelah dikerjakan sampai selesai, di-UAT, dan
diverifikasi terhadap kode: kontrak permanennya tinggal di
`docs/claude/reports.md` repo Django (populasi, sumber kolom, ambang
bucket, semantik renewal, aturan cakupan) dan `docs/claude/dashboard.md`
di sini (runtime + daftar layar + tiga caveat rendering). Yang tetap
disimpan di atas: angka acuan UAT beserta perintah seed-nya, karena itu
yang dipakai membandingkan saat layarnya disentuh lagi.

Handoff **Attendance Import** dipadatkan dari instruksi penuh jadi
daftar dampak-ke-layar di bagian Pending — layarnya memang belum
dikerjakan, jadi butirnya tidak boleh hilang, tapi rincian format file,
contoh CSV, dan angka acuan exception-nya sudah punya rumah permanen di
`docs/claude/hr/attendance-import.md` repo Django.

**24 Ags 2026.** Handoff Manpower Summary dari backend (±150 baris)
dibuang setelah dikerjakan sampai selesai dan diverifikasi.

**23 Ags 2026.** Berkas ini sebelumnya 1570 baris berisi kronologi
handoff dan work log 20–23 Ags 2026. Isinya yang masih berlaku
dipindahkan lebih dulu ke dokumen domain — `docs/claude/dashboard.md`,
`docs/claude/generator-schema.md`, dan `docs/claude/hr/leave.md`
(**baru**) — lalu kronologinya dibuang.

**Satu hal yang perlu diketahui:** kronologi Travel Request (handoff
B3/B6/B7/M4 dan work log-nya) ikut terbuang, dan berkas ini tidak
dilacak git sehingga teks aslinya tidak bisa dipulihkan. Aturan
durable-nya memang sudah lebih dulu tinggal di
`docs/claude/hr/travel-request.md` — itu rumah permanennya sejak awal —
tapi kalau ada catatan "masih terbuka" khas ronde itu yang belum
tertulis di sana, catatan itu hilang. Yang berhasil diselamatkan dan
diverifikasi ulang terhadap kode: butir `from-rotation-period` di atas.
