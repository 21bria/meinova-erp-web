import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * Aturan penerusan `/media/**` ke origin backend.
 *
 * Dikembalikan sebagai objek supaya bisa di-spread: kalau base URL-nya
 * relatif, hasilnya `{}` dan tidak ada aturan yang terpasang sama
 * sekali — lebih jelas daripada aturan yang terpasang lalu menunjuk
 * dirinya sendiri.
 */
function mediaProxyRule(): Record<string, any> {
  const base = process.env.NUXT_PUBLIC_API_BASE_URL ?? ""

  if (!/^https?:\/\//i.test(base))
    return {}

  const origin = new URL(base).origin

  return {
    "/media/**": {
      proxy: `${origin}/media/**`,
    },
  }
}

/**
 * Padanannya untuk `pnpm dev`.
 *
 * `routeRules` dilayani nitro, dan di dev permintaan berkas mendarat di
 * middleware Vite lebih dulu — jadi aturannya benar tapi tidak pernah
 * kebagian. `devProxy` yang menanganinya, dan ia memang hanya berlaku
 * saat dev. Keduanya dipasang: yang satu untuk build, yang satu untuk
 * mesin orang yang sedang mengerjakannya.
 */
function mediaDevProxy(): Record<string, any> {
  const base = process.env.NUXT_PUBLIC_API_BASE_URL ?? ""

  if (!/^https?:\/\//i.test(base))
    return {}

  const origin = new URL(base).origin

  return {
    "/media": {
      target: `${origin}/media`,
      changeOrigin: true,
    },
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2026-03-13',

  devtools: {
    enabled: true,
  },

  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/main.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },


  components: [
    { path: "~/components", extensions: [".vue"] },
    { path: r("./framework/components"), pathPrefix: false, extensions: [".vue"] },
    { path: r("./framework/charts"), pathPrefix: false, extensions: [".vue"] },
  ],

  alias: {
    "@framework": fileURLToPath(new URL("./framework", import.meta.url)),
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',

    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/icon',

    'shadcn-nuxt',
    '@nuxt/eslint',

    '@nuxthub/core',
  ],

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700, 800],
    },
  },

  imports: {
    dirs: [
      "./lib",
      "./composables",
      "./stores",
      "./app/modules/**/composables",

      "./framework/core/composables",
      "./framework/core/utils",
    ],
  },
  routeRules: {
    /*
     * Berkas unggahan disajikan backend, tapi alamatnya disimpan
     * **relatif** (`/media/uploads/...`).
     *
     * Itu keputusan yang benar dan disengaja — lihat `toRelative()` di
     * `MRichEditorToolbar`: gambar di dalam artikel yang menyimpan
     * origin lengkap akan rusak begitu artikelnya dibuka di lingkungan
     * lain, dan rusaknya diam. Yang kurang cuma sisi penyajiannya: di
     * dev, frontend dan backend beda origin, jadi `/media/...` mendarat
     * di Nuxt yang tidak punya rute itu dan pemakainya melihat "Page
     * not found" untuk berkas yang sebenarnya ada di disk.
     *
     * Diteruskan di sini, bukan diperbaiki di tiap komponen: satu-
     * satunya cara memastikan **semua** pemakainya ikut, termasuk
     * `<img>` yang sudah tersimpan di dalam HTML artikel dan tidak
     * dilewati kode mana pun saat dirender.
     *
     * Kalau `NUXT_PUBLIC_API_BASE_URL` relatif (mis. `/api` di balik
     * satu reverse proxy), aturan ini **tidak dipasang**: origin-nya
     * memang sudah sama, dan meneruskannya ke diri sendiri hanya
     * menghasilkan lingkaran.
     */
    ...mediaProxyRule(),

    '/components': {
      redirect: '/components/accordion',
    },

    '/settings': {
      redirect: '/settings/profile',
    },

    '/login': {
      ssr: false,
    },
  },

  nitro: {
    devProxy: mediaDevProxy(),

    prerender: {
      ignore: [
        '/examples/forms',
        '/terms',
        '/privacy',
        '/components/pagination',
        '/docs',
      ],
    },
  },
})