import Image from '@tiptap/extension-image'

/**
 * Gambar dengan lebar yang bisa diatur.
 *
 * `@tiptap/extension-image` bawaan hanya mengenal `src`, `alt`, dan
 * `title` — atribut `width` yang ditulis di HTML dibuang saat
 * `setContent`. Jadi tanpa turunan ini, tombol ukuran di toolbar
 * terlihat bekerja (gambarnya langsung mengecil) lalu **ukurannya
 * hilang begitu artikelnya dibuka lagi**, dan tidak ada satu pun pesan
 * yang menjelaskannya.
 *
 * Lebarnya disimpan sebagai atribut `width` pada `<img>`, bukan kelas
 * CSS: kelas berarti satu daftar nama yang harus dijaga tetap sama di
 * editor **dan** di halaman baca, dan sanitizer backend sudah
 * mengizinkan `width` sejak awal.
 */
export const ImageBlock = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: null,

        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute('width')

          return value ? Number.parseInt(value, 10) : null
        },

        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.width)
            return {}

          return { width: attributes.width }
        },
      },
    }
  },
})
