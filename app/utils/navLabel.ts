import { translate } from '@framework'

/*
| Judul menu yang bisa diterjemahkan, tanpa memutus yang sudah ada.
|
| `menus.ts` tetap membawa `title`/`heading` berbahasa Inggris seperti
| dulu; `titleKey`/`headingKey` **opsional** ditambahkan di sebelahnya.
| Item yang belum punya kunci — termasuk yang ditambahkan orang lain
| besok — tetap tampil persis seperti sebelumnya.
|
| Kenapa tidak mengganti `title` jadi kunci saja: `menus.ts` dibaca tiga
| tempat (`AppSidebar`, `Search`, dan penyaring menu), dan judulnya juga
| dipakai sebagai tooltip dan sebagai `key` v-for. Menggantinya dengan
| kunci mentah membuat ketiganya menampilkan `navigation.items.employees`
| pada hari pertama ada yang lupa mengisi katalog.
*/
export function navLabel(
  item: { title?: string, titleKey?: string } | null | undefined,
): string {
  if (!item)
    return ''

  const fallback = item.title ?? ''

  return item.titleKey
    ? translate(item.titleKey, fallback)
    : fallback
}

export function navHeading(
  group: { heading?: string, headingKey?: string } | null | undefined,
): string {
  if (!group)
    return ''

  const fallback = group.heading ?? ''

  return group.headingKey
    ? translate(group.headingKey, fallback)
    : fallback
}
