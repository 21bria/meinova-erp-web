import { mergeAttributes, Node } from '@tiptap/vue-3'

/**
 * Node YouTube untuk editor artikel panduan.
 *
 * Ditulis sendiri, bukan memakai `@tiptap/extension-youtube`: yang
 * dibutuhkan cuma satu blok `<iframe>` dengan satu atribut, dan
 * paketnya membawa opsi ukuran, kontrol, dan nocookie yang semuanya
 * **sudah diputuskan di backend** — `sanitize_html()` membangun ulang
 * `src` dari nol dan menimpa atribut lainnya, jadi apa pun yang
 * ditawarkan paket itu akan dibuang saat disimpan.
 *
 * Diimpor dari `@tiptap/vue-3`, yang meneruskan seluruh isi
 * `@tiptap/core`. Mengimpor `@tiptap/core` langsung gagal di pnpm:
 * paketnya ada di store tapi tidak ditautkan ke `node_modules`
 * teratas, karena bukan dependensi langsung proyek ini.
 */
export const YoutubeEmbed = Node.create({
  name: 'youtubeEmbed',

  group: 'block',

  // Atom: tidak ada isi yang bisa diketik di dalamnya, dan kursor
  // memperlakukannya sebagai satu benda utuh. Tanpa ini, menekan
  // Backspace di sebelahnya menghapus setengah atributnya.
  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('src'),
      },
    }
  },

  parseHTML() {
    // Isi yang datang dari API sudah dibersihkan backend, jadi satu-
    // satunya `<iframe>` yang mungkin ada memang video YouTube.
    return [{ tag: 'iframe[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        frameborder: '0',
        allowfullscreen: 'true',
      }),
    ]
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (src: string) =>
          ({ commands }: any) =>
            commands.insertContent({
              type: this.name,
              attrs: { src },
            }),
    } as any
  },
})

/**
 * Pemeriksaan bentuk URL di sisi klien.
 *
 * **Bukan penjagaan** — yang menolak sungguhan tetap
 * `youtube_embed_url()` di backend, dan aturannya sengaja dibuat sama.
 * Gunanya cuma supaya penulis artikel tahu URL-nya salah saat
 * menempelkannya, bukan setelah menekan Save dan videonya diam-diam
 * hilang dari isi yang tersimpan.
 */
export function looksLikeYoutubeUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    const host = url.hostname.toLowerCase()

    const isYoutubeHost = [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtu.be',
      'www.youtu.be',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
    ].includes(host)

    if (!isYoutubeHost)
      return false

    const id = host.endsWith('youtu.be')
      ? url.pathname.replace(/^\//, '').split('/')[0]
      : url.pathname.startsWith('/embed/')
        ? url.pathname.slice('/embed/'.length).split('/')[0]
        : url.pathname.startsWith('/shorts/')
          ? url.pathname.slice('/shorts/'.length).split('/')[0]
          : url.searchParams.get('v') ?? ''

    // `.split('/')[0]` bertipe `string | undefined` di bawah
    // `noUncheckedIndexedAccess` — path kosong menghasilkan larik
    // kosong, dan itu memang salah satu bentuk URL yang harus ditolak.
    return /^[\w-]{11}$/.test(id ?? '')
  }
  catch {
    return false
  }
}
