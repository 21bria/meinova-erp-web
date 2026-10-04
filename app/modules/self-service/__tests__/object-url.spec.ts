import { describe, expect, it } from 'vitest'

import { createObjectUrlHolder } from '../api/object-url'

/*
| Daur hidup object URL avatar.
|
| Tidak bisa diuji lewat UAT: `demo.gm` belum punya foto, jadi jalur
| blob-nya tidak pernah terpicu di tenant dev — dan menyisipkan data foto
| palsu ke dev cuma demi test bukan harga yang pantas. Diuji di sini
| dengan API URL palsu yang mencatat tiap create dan revoke.
*/

function fakeApi() {
  const created: string[] = []
  const revoked: string[] = []

  let n = 0

  return {
    created,
    revoked,
    api: {
      createObjectURL: () => {
        n += 1
        const url = `blob:fake/${n}`
        created.push(url)
        return url
      },
      revokeObjectURL: (url: string) => {
        revoked.push(url)
      },
    },
  }
}

const blob = () => new Blob(['x'])

describe('pemegang object URL', () => {
  it('mulai kosong', () => {
    const { api } = fakeApi()

    expect(createObjectUrlHolder(api).current).toBeNull()
  })

  it('memasang URL untuk blob', () => {
    const { api, created } = fakeApi()
    const holder = createObjectUrlHolder(api)

    const url = holder.set(blob())

    expect(url).toBe('blob:fake/1')
    expect(holder.current).toBe('blob:fake/1')
    expect(created).toEqual(['blob:fake/1'])
  })

  it('mencabut yang lama saat digantikan', () => {
    const { api, revoked } = fakeApi()
    const holder = createObjectUrlHolder(api)

    holder.set(blob())
    holder.set(blob())

    expect(revoked).toEqual(['blob:fake/1'])
    expect(holder.current).toBe('blob:fake/2')
  })

  it('uRL baru dibuat sebelum yang lama dicabut', () => {
    /*
     * Urutannya penting: mencabut lebih dulu membuat `src` kosong
     * selama sepersekian detik, dan gambarnya berkedip tiap kali
     * dimuat ulang.
     */
    const order: string[] = []

    const holder = createObjectUrlHolder({
      createObjectURL: () => {
        order.push('create')
        return 'blob:x'
      },
      revokeObjectURL: () => {
        order.push('revoke')
      },
    })

    holder.set(blob())
    order.length = 0
    holder.set(blob())

    expect(order).toEqual(['create', 'revoke'])
  })

  it('blob null mencabut dan mengosongkan', () => {
    const { api, revoked } = fakeApi()
    const holder = createObjectUrlHolder(api)

    holder.set(blob())

    expect(holder.set(null)).toBeNull()
    expect(holder.current).toBeNull()
    expect(revoked).toEqual(['blob:fake/1'])
  })

  it('release mencabut yang dipegang', () => {
    const { api, revoked } = fakeApi()
    const holder = createObjectUrlHolder(api)

    holder.set(blob())
    holder.release()

    expect(revoked).toEqual(['blob:fake/1'])
    expect(holder.current).toBeNull()
  })

  it('tidak pernah mencabut dua kali', () => {
    const { api, revoked } = fakeApi()
    const holder = createObjectUrlHolder(api)

    holder.set(blob())
    holder.release()
    holder.release()
    holder.release()

    expect(revoked).toEqual(['blob:fake/1'])
  })

  it('release saat kosong bukan galat', () => {
    const { api, revoked } = fakeApi()
    const holder = createObjectUrlHolder(api)

    expect(() => holder.release()).not.toThrow()
    expect(revoked).toEqual([])
  })

  it('tidak ada URL yang tertinggal setelah dipakai berulang', () => {
    /*
     * Simulasi halaman yang dibuka-tutup sepuluh kali. Yang dijaga:
     * jumlah yang dibuat dan yang dicabut sama persis di akhir.
     */
    const { api, created, revoked } = fakeApi()
    const holder = createObjectUrlHolder(api)

    for (let i = 0; i < 10; i++)
      holder.set(blob())

    holder.release()

    expect(created).toHaveLength(10)
    expect(revoked).toHaveLength(10)
    expect(new Set(revoked)).toEqual(new Set(created))
    expect(holder.current).toBeNull()
  })
})
