/*
| Identitas warna per modul/ikon.
|
| Empat bentuk yang tidak saling menggantikan, dan itu disengaja:
|
| * `bg`   — **titik henti gradien lembut** (`from-… to-…`), jadi
|            pemakainya wajib ikut menyebut arah (`bg-linear-to-*`).
|            Tanpa arah, kelas ini tidak menghasilkan latar apa pun;
| * `text` — warna ikon telanjang;
| * `vivid`— **tiga titik henti pekat** untuk ubin ikon aplikasi di
|            Application Launcher, dipasangkan dengan ikon putih. Tiga,
|            bukan dua: `from-x-500 to-x-600` berjarak satu tingkat dan
|            hasilnya terbaca rata — tombol Tailwind biasa yang
|            disudutkan, bukan ikon aplikasi yang punya volume. Titik
|            tengahnya yang membuat sisi kiri-atas terang dan kanan-
|            bawah dalam;
| * `glow` — bayangan bersemu warna ubinnya. Ambient tipis supaya ikon
|            terangkat dari latar putih beranda; bukan neon, dan
|            **hanya** untuk ubin launcher.
|
| Nilainya ditulis penuh, bukan dirakit runtime: Tailwind memindai teks
| sumber, dan `from-${name}-500` tidak pernah ikut tergenerate.
|
| Menambah modul baru = satu baris warna di katalog backend yang
| menunjuk salah satu kunci di bawah. Tidak ada komponen yang perlu
| disentuh.
*/
export const colorRegistry: Record<string, any> = {
  blue: {
    bg: 'from-blue-500/15 to-cyan-500/5',
    text: 'text-blue-600',
    vivid: 'from-blue-400 via-blue-500 to-blue-700',
    glow: 'shadow-blue-500/30',
  },

  emerald: {
    bg: 'from-emerald-500/15 to-green-500/5',
    text: 'text-emerald-600',
    vivid: 'from-emerald-400 via-emerald-500 to-green-700',
    glow: 'shadow-emerald-500/30',
  },

  violet: {
    bg: 'from-violet-500/15 to-purple-500/5',
    text: 'text-violet-600',
    vivid: 'from-violet-400 via-violet-500 to-purple-700',
    glow: 'shadow-violet-500/30',
  },

  orange: {
    bg: 'from-orange-500/15 to-amber-500/5',
    text: 'text-orange-600',
    vivid: 'from-orange-400 via-orange-500 to-amber-600',
    glow: 'shadow-orange-500/30',
  },

  amber: {
    bg: 'from-amber-500/15 to-yellow-500/5',
    text: 'text-amber-600',
    vivid: 'from-amber-300 via-amber-400 to-orange-600',
    glow: 'shadow-amber-500/30',
  },

  sky: {
    bg: 'from-sky-500/15 to-blue-500/5',
    text: 'text-sky-600',
    vivid: 'from-sky-400 via-sky-500 to-blue-600',
    glow: 'shadow-sky-500/30',
  },

  cyan: {
    bg: 'from-cyan-500/15 to-sky-500/5',
    text: 'text-cyan-600',
    vivid: 'from-cyan-400 via-cyan-500 to-sky-600',
    glow: 'shadow-cyan-500/30',
  },

  rose: {
    bg: 'from-rose-500/15 to-pink-500/5',
    text: 'text-rose-600',
    vivid: 'from-rose-400 via-rose-500 to-pink-700',
    glow: 'shadow-rose-500/30',
  },

  indigo: {
    bg: 'from-indigo-500/15 to-blue-500/5',
    text: 'text-indigo-600',
    vivid: 'from-indigo-400 via-indigo-500 to-indigo-700',
    glow: 'shadow-indigo-500/30',
  },

  slate: {
    bg: 'from-slate-500/15 to-gray-500/5',
    text: 'text-slate-600',
    vivid: 'from-slate-400 via-slate-500 to-slate-700',
    glow: 'shadow-slate-500/30',
  },
}

/*
| Penimpa warna modul, **di sisi tampilan saja**.
|
| Katalog backend menyebut `administration: slate` — sisa masa ketika
| ubinnya memang sengaja netral. Di launcher yang seluruh ubinnya
| berwarna penuh, satu ubin abu-abu di antara empat yang vivid tidak
| terbaca sebagai "netral"; ia terbaca sebagai aplikasi yang sedang
| dinonaktifkan, dan Administration justru modul yang paling sering
| dibuka admin.
|
| Kuncinya `app_code` dari backend, bukan judulnya: judul bisa berubah
| dan diterjemahkan, kodenya tidak. Satu baris per modul di sini, nol
| percabangan di komponen — `ApplicationLauncherItem` tidak pernah tahu
| modul apa yang sedang direndernya.
|
| **Tempat yang sebenarnya untuk ini adalah `APP_CATALOG` backend**
| (satu kata: `slate` → `orange`), dan begitu boleh disentuh, baris di
| bawah ini tinggal dihapus tanpa mengubah apa pun yang lain.
*/
export const appColorOverride: Record<string, string> = {
  administration: 'orange',
}
