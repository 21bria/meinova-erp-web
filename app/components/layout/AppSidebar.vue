<script setup lang="ts">
import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'
import { moduleMenus, navMenuBottom } from '~/constants/menus'

type NavItem = NavLink | NavGroup | NavSectionTitle

function resolveNavItemComponent(item: NavItem): any {
  if ('children' in item)
    return resolveComponent('LayoutSidebarNavGroup')

  return resolveComponent('LayoutSidebarNavLink')
}

/**
 * Key `v-for` yang stabil lintas penyaringan.
 *
 * Tidak bisa langsung `item.link` di template: `NavItem` adalah union
 * dan `NavSectionTitle` tidak punya `link`. Rute dipakai lebih dulu
 * karena itu yang benar-benar unik — dua menu boleh berjudul sama
 * ("Masters" ada di HR dan Payroll).
 */
function navKey(item: NavItem): string {
  return ('link' in item && item.link ? item.link : '')
    || ('title' in item && item.title ? item.title : '')
    || ''
}

const route = useRoute()

const activeModule = computed(() => route.path.split('/')[1] || 'home')

const { isGranted, load: loadAccess } = useAccess()
const { isVisible, load: loadMenuAccess } = useMenuAccess()

onMounted(() => {
  loadAccess()
  loadMenuAccess()
})

/**
 * Menu disaring dua kali, dan keduanya diperlukan.
 *
 * `isGranted` = wewenang tingkat layar yang dihitung kode (`security.manage`,
 * `workflow.configure`) — aturannya tetap, tidak bisa dicentang.
 * `isVisible` = centang per role di Menu Permissions — dikonfigurasi tiap
 * tenant, dan itulah yang membuat pegawai biasa tidak melihat seluruh menu.
 *
 * Grup yang seluruh itemnya tersaring ikut dibuang — judul grup
 * "Configuration" yang berdiri sendiri tanpa satu pun menu di bawahnya
 * cuma membingungkan.
 *
 * Item hub (`hubItems`) disaring sekali lagi, lewat layar yang
 * dimuatnya. Rutenya sendiri — `/payroll/bpjs` — tidak terdaftar di
 * tabel `Menu`, dan rute yang tidak dikenal dianggap boleh; tanpa
 * langkah ini, satu item hub yang menggantikan tujuh item resource
 * justru muncul untuk role yang ketujuh menunya sudah dicabut, lalu
 * membuka halaman kosong. Penyaringnya sama persis dengan yang dipakai
 * `MasterHub` di dalam hub-nya, jadi menu dan isinya tidak bisa
 * berbeda pendapat.
 */
function isReachable(item: any) {
  if (!isGranted(item?.permission) || !isVisible(item?.link))
    return false

  const hubItems = item?.hubItems

  if (!Array.isArray(hubItems) || hubItems.length === 0)
    return true

  return hubItems.some(
    (child: any) => isGranted(child?.permission) && isVisible(child?.link),
  )
}

const navMenu = computed(() => {
  const menus = moduleMenus[activeModule.value] ?? []

  return menus
    .map(group => ({
      ...group,
      items: group.items.filter(isReachable),
    }))
    .filter(group => group.items.length > 0)
})

/**
 * Menu bawah, dengan Help & Support membawa rute yang sedang dibuka.
 *
 * Halaman bantuan memakainya untuk menawarkan panduan layar itu lebih
 * dulu — orang menekan Help ketika sedang tersangkut di suatu layar,
 * bukan ketika ingin membaca daftar isi. Rutenya disisipkan di sini,
 * bukan ditulis di `menus.ts`, karena konstanta itu statis sementara
 * rutenya berubah tiap navigasi.
 *
 * `/help` sendiri sengaja **tidak** disaring `isVisible`: menu yang
 * bisa dicabut per role berarti ada tenant yang pegawainya tidak punya
 * jalan masuk ke panduan sama sekali.
 */
const bottomMenu = computed(() =>
  navMenuBottom.map((item: any) => {
    if (item.link !== '/help')
      return item

    return {
      ...item,
      link: `/help?route=${encodeURIComponent(route.path)}`,
    }
  }),
)

/*
 | Identitas diambil dari akun yang login.
 |
 | Dulu ditulis mati di sini — semua orang melihat "Meinardus /
 | admin@meinova.id" apa pun akunnya, termasuk di layar demo ke klien.
 */
const auth = useAuthStore()

const user = computed(() => ({
  name:
    auth.user?.display_name
    || auth.user?.full_name
    || auth.user?.username
    || "Pengguna",

  email: auth.user?.email || "",

  // Avatar belum ada di master pengguna. Inisial dari backend dipakai
  // sebagai gantinya, dan komponennya sudah punya fallback huruf.
  avatar: auth.user?.avatar || "",

  initials: auth.user?.initials || "?",
}))

const teams = [
  {
    name: 'Meinova ERP',
    logo: "/meinova_white.png",
    plan: 'Enterprise Platform',
  },
]

const { sidebar } = useAppSettings()
</script>

<template>
  <Sidebar v-if="navMenu.length" :collapsible="sidebar?.collapsible" :side="sidebar?.side" :variant="sidebar?.variant">
    <SidebarHeader>
      <LayoutSidebarNavHeader :teams="teams" />
      <Search />
    </SidebarHeader>

    <SidebarContent>
      <!--
        `ClientOnly` bukan hiasan — tanpa itu menunya salah, diam-diam.

        Isi sidebar bergantung pada keadaan yang **hanya ada di sisi
        klien**: `capabilities` dari localStorage dan hak menu dari API.
        Server merender daftar lengkap, klien merender daftar tersaring,
        dan Vue menjawab ketidakcocokan itu dengan mempertahankan DOM
        milik server:

            Hydration text content mismatch on span
              - rendered on server: Workflow Definitions
              - expected on client: Delegations

        Hasilnya jumlah item benar tapi isinya isi lama — `demo.hradmin`
        melihat "Security" yang seharusnya tersembunyi, sementara "Audit
        Trail" di ujung daftar justru hilang. Sidebar-nya tampak wajar,
        jadi tidak ada yang curiga. Mismatch ini hanya muncul pada
        navigasi **kedua** dan seterusnya, saat localStorage sudah terisi;
        muat pertama kebetulan benar, dan itu yang membuatnya sulit
        dilacak.

        Key-nya juga identitas item, bukan indeks: daftar ini menyusut
        setelah wewenang dimuat, dan `:key="index"` membuat Vue
        mencocokkan node lama ke posisi yang sama.
      -->
      <ClientOnly>
        <SidebarGroup v-for="nav in navMenu" :key="nav.heading">
          <!--
            `key` tetap `nav.heading` (teks Inggris), bukan judul
            terjemahannya: mengganti bahasa tidak boleh membuat Vue
            mengira seluruh grup adalah grup baru dan merakit ulang
            sidebar-nya.
          -->
          <SidebarGroupLabel v-if="nav.heading">
            {{ navHeading(nav) }}
          </SidebarGroupLabel>

          <component
            :is="resolveNavItemComponent(item)"
            v-for="item in nav.items"
            :key="navKey(item)"
            :item="item"
          />
        </SidebarGroup>
      </ClientOnly>

      <SidebarGroup class="mt-auto">
        <component
          :is="resolveNavItemComponent(item)"
          v-for="item in bottomMenu"
          :key="navKey(item)"
          :item="item"
          size="sm"
        />
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <!--
        Identitasnya juga hanya ada di klien (localStorage), jadi server
        selalu merender "Pengguna / ?" dan klien merender nama aslinya —
        mismatch yang sama, cuma kebetulan tidak berbahaya.
      -->
      <ClientOnly>
        <LayoutSidebarNavFooter :user="user" />
      </ClientOnly>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>