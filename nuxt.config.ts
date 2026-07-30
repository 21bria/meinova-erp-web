import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

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