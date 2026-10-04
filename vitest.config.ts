import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/*
| Vitest polos, sengaja tanpa `@nuxt/test-utils`.
|
| Yang diuji berkas ini adalah bagian i18n yang **murni**: penormalan
| kode bahasa, bentuk katalog, dan aturan fallback. Semuanya fungsi biasa
| tanpa Nuxt, tanpa DOM, tanpa jaringan — jadi menyalakan runtime Nuxt
| untuk mengujinya cuma menambah beberapa menit dan beberapa cara baru
| untuk gagal karena hal yang tidak sedang diuji.
|
| Yang TIDAK tercakup di sini dan memang tidak berpura-pura tercakup:
| perilaku komponen, penyimpanan cookie, dan PATCH ke backend. Yang
| terakhir diuji di sisi Django (`test_user_language.py`).
*/
export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),
      "@framework": fileURLToPath(new URL("./framework", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: [
      "app/**/__tests__/**/*.spec.ts",
      // Util kerangka diuji di sebelah modulnya. Tanpa pola ini
      // `framework/**/__tests__` ada tapi tidak pernah dijalankan —
      // test yang hijau karena tidak pernah dipanggil.
      "framework/**/__tests__/**/*.spec.ts",
      // Generator ditulis dalam .mjs polos dan diuji apa adanya —
      // tidak ada langkah build yang perlu ditiru.
      "scripts/**/__tests__/**/*.spec.mjs",
    ],
  },
})
